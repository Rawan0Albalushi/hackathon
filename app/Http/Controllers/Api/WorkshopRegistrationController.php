<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkshopRegistration;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class WorkshopRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'workshop_ids' => 'required|array|min:1',
            'workshop_ids.*' => 'required|exists:workshops,id',
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

        $workshopIds = $request->workshop_ids;
        $userId = $request->user()->id;
        $registrations = [];
        $errors = [];

        // Check for existing registrations for any of the selected workshops
        $existingRegistrations = WorkshopRegistration::where('user_id', $userId)
            ->whereIn('workshop_id', $workshopIds)
            ->get();
        
        if ($existingRegistrations->count() > 0) {
            $existingWorkshopIds = $existingRegistrations->pluck('workshop_id')->toArray();
            return response()->json([
                'success' => false,
                'message' => 'You have already registered for some of these workshops',
                'existing_workshops' => $existingWorkshopIds
            ], 409);
        }

        try {
            // Create registration for each selected workshop
            foreach ($workshopIds as $workshopId) {
                $registrationData = [
                    'workshop_id' => $workshopId,
                    'user_id' => $userId,
                    'full_name' => $request->full_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'background' => $request->background,
                    'reason' => $request->reason,
                    'status' => 'pending'
                ];
                
                $registration = WorkshopRegistration::create($registrationData);
                
                // Generate QR code for each workshop registration
                $qrCode = QRCodeService::generateQRCode('workshop', $registration->id);
                $registration->update(['qr_code' => $qrCode]);
                
                $registrations[] = $registration->fresh();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => $registrations
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
