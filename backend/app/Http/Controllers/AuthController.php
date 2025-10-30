<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'id' => $this->generateCuid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'provider' => 'credentials',
            'language' => $request->language ?? 'en',
            'profile_completed' => false,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Update last login
        $user->update(['last_login_at' => now()]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Handle Google OAuth callback
     */
    public function googleCallback(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'name' => 'required|string',
            'google_id' => 'required|string',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user exists with this email
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // User exists, update last login
            $user->update([
                'last_login_at' => now(),
                'image' => $request->image ?? $user->image,
            ]);

            // Check if Google account is linked
            $account = Account::where('user_id', $user->id)
                ->where('provider', 'google')
                ->first();

            if (!$account) {
                // Link Google account
                Account::create([
                    'id' => $this->generateCuid(),
                    'user_id' => $user->id,
                    'type' => 'oauth',
                    'provider' => 'google',
                    'provider_account_id' => $request->google_id,
                ]);
            }
        } else {
            // Create new user
            $user = User::create([
                'id' => $this->generateCuid(),
                'email' => $request->email,
                'name' => $request->name,
                'image' => $request->image,
                'provider' => 'google',
                'provider_id' => $request->google_id,
                'email_verified_at' => now(),
                'language' => 'en',
                'profile_completed' => false,
                'last_login_at' => now(),
            ]);

            // Create Google account entry
            Account::create([
                'id' => $this->generateCuid(),
                'user_id' => $user->id,
                'type' => 'oauth',
                'provider' => 'google',
                'provider_account_id' => $request->google_id,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Google authentication successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Generate a CUID (compatible with Prisma)
     * Simple implementation - for production, use a proper CUID library
     */
    private function generateCuid()
    {
        return 'c' . Str::random(24);
    }
}
