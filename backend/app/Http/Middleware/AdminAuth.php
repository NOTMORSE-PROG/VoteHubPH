<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainTextToken = $request->bearerToken();
        if (! $plainTextToken) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'Please log in to access the admin panel.',
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($plainTextToken);
        if (! $accessToken || ($accessToken->expires_at && $accessToken->expires_at->isPast())) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => 'The admin token is invalid or expired.',
            ], 401);
        }

        $user = $accessToken->tokenable;
        if (! $user instanceof User || ! $user->is_admin) {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Admin access required.',
            ], 403);
        }

        $accessToken->forceFill(['last_used_at' => now()])->save();
        $request->setUserResolver(fn () => $user);
        $request->merge(['authenticated_admin_id' => $user->id]);

        return $next($request);
    }
}
