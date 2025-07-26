<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\UserModel;

class UsersController extends Controller
{
    public function index()
    {
        try {
            $users = UserModel::all();
            return response()->json([
                'status' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: '.$e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve users'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);
    
        $user = UserModel::where('username', $request->username)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => 'Login success',
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|unique:table_users,username',
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = UserModel::create([
                'username' => $validated['username'],
                'password' => bcrypt($validated['password']),
                'created_at' => now()
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            Log::error('User creation failed: '.$e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'User creation failed'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = UserModel::find($id);

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch user: '.$e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Failed to retrieve user'
            ], 500);
        }
    }
}