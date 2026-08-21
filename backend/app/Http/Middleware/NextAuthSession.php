<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class NextAuthSession
{
    /**
     * Authenticate API requests with a Laravel Sanctum bearer token.
     *
     * The former X-User-Id fallback trusted a caller-controlled identifier and
     * allowed account impersonation. Tokens are now issued only after a
     * successful Laravel or NextAuth login and are verified against Sanctum's
     * hashed token store on every protected request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $plainTextToken = $request->bearerToken();
        if (! $plainTextToken) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'A valid bearer token is required.',
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($plainTextToken);
        if (! $accessToken || ($accessToken->expires_at && $accessToken->expires_at->isPast())) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'The bearer token is invalid or expired.',
            ], 401);
        }

        $user = $accessToken->tokenable;
        if (! $user instanceof User) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'The token owner no longer exists.',
            ], 401);
        }

        $accessToken->forceFill(['last_used_at' => now()])->save();
        $request->setUserResolver(fn () => $user);
        $request->attributes->set('nextauth_user', $user);
        $request->merge(['authenticated_user_id' => $user->id]);

        return $next($request);
    }
}
