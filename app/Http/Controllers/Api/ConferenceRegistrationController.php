<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConferenceRegistration;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ConferenceRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        // Check if user already has a conference registration
        $existingRegistration = ConferenceRegistration::where('user_id', $request->user()->id)->first();
        
        if ($existingRegistration) {
            return response()->json([
                'success' => false,
                'message' => 'You have already registered for the conference',
                'data' => $existingRegistration
            ], 409);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'organization' => 'nullable|string|max:255',
            'session_choice' => 'required|string|in:first,second,both'
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
            
            $registration = ConferenceRegistration::create($registrationData);
            
            // Generate QR code after registration is created
            $qrCode = QRCodeService::generateQRCode('conference', $registration->id);
            $registration->update(['qr_code' => $qrCode]);
            
            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => $registration->fresh()
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
