<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HackathonRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class HackathonRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Check if user already has a hackathon registration
        $existingRegistration = HackathonRegistration::where('user_id', $request->user()->id)->first();
        
        if ($existingRegistration) {
            return response()->json([
                'success' => false,
                'message' => 'You have already registered for the hackathon',
                'data' => $existingRegistration
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'age' => 'required|integer|min:16|max:100',
            'city' => 'required|string|max:255',
            'background' => 'required|string|max:255',
            'skills' => 'required|array|min:1',
            'project_idea' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $registrationData = $request->all();
            $registrationData['user_id'] = $request->user()->id;
            $registrationData['status'] = 'pending';
            
            $registration = HackathonRegistration::create($registrationData);
            
            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => $registration
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
