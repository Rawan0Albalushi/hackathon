<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkshopRegistration;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class WorkshopRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'workshop_id' => 'required|exists:workshops,id',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'background' => 'required|string|max:255',
            'reason' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if user already has a registration for this specific workshop
        $existingRegistration = WorkshopRegistration::where('user_id', $request->user()->id)
            ->where('workshop_id', $request->workshop_id)
            ->first();
        
        if ($existingRegistration) {
            return response()->json([
                'success' => false,
                'message' => 'You have already registered for this workshop',
                'data' => $existingRegistration
            ], 409);
        }

        try {
            $registrationData = $request->all();
            $registrationData['user_id'] = $request->user()->id;
            $registrationData['status'] = 'pending';
            
            $registration = WorkshopRegistration::create($registrationData);
            
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
