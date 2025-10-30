<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get authenticated user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'image' => $user->image,
            'provider' => $user->provider,
            'language' => $user->language,
            'profileCompleted' => $user->profile_completed,
            'location' => [
                'region' => $user->region,
                'city' => $user->city,
                'barangay' => $user->barangay,
            ],
            'createdAt' => $user->created_at,
            'lastLoginAt' => $user->last_login_at,
        ]);
    }

    /**
     * Complete user profile (add location)
     */
    public function completeProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'region' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update([
            'region' => $request->region,
            'city' => $request->city,
            'barangay' => $request->barangay,
            'profile_completed' => true,
        ]);

        return response()->json([
            'message' => 'Profile completed successfully',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'image' => $user->image,
                'provider' => $user->provider,
                'language' => $user->language,
                'profileCompleted' => $user->profile_completed,
                'location' => [
                    'region' => $user->region,
                    'city' => $user->city,
                    'barangay' => $user->barangay,
                ],
            ],
        ]);
    }

    /**
     * Update user information
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'language' => 'sometimes|string|in:en,tl',
            'region' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'barangay' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update($request->only(['name', 'language', 'region', 'city', 'barangay']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'image' => $user->image,
                'provider' => $user->provider,
                'language' => $user->language,
                'profileCompleted' => $user->profile_completed,
                'location' => [
                    'region' => $user->region,
                    'city' => $user->city,
                    'barangay' => $user->barangay,
                ],
            ],
        ]);
    }
}
