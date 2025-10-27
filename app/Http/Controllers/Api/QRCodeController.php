<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HackathonRegistration;
use App\Models\WorkshopRegistration;
use App\Models\ConferenceRegistration;
use App\Services\QRCodeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class QRCodeController extends Controller
{
    /**
     * Scan QR code and check in user
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function scanQRCode(Request $request): JsonResponse
    {
        $request->validate([
            'qr_code' => 'required|string'
        ]);

        $qrCode = $request->qr_code;

        // Validate QR code format
        if (!QRCodeService::validateQRCode($qrCode)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid QR code format'
            ], 400);
        }

        // Parse QR code to get registration info
        $parsedQR = QRCodeService::parseQRCode($qrCode);
        
        if (!$parsedQR) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid QR code'
            ], 400);
        }

        $registrationId = $parsedQR['registration_id'];
        $type = $parsedQR['type'];

        // Find the registration based on type
        $registration = $this->findRegistration($type, $registrationId);

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Registration not found'
            ], 404);
        }

        // Check if already checked in
        if ($registration->is_checked_in) {
            return response()->json([
                'success' => false,
                'message' => 'User already checked in',
                'data' => [
                    'registration' => $registration,
                    'checked_in_at' => $registration->checked_in_at
                ]
            ], 409);
        }

        // Check if registration is approved
        if ($registration->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Registration is not approved yet',
                'data' => [
                    'registration' => $registration,
                    'status' => $registration->status
                ]
            ], 403);
        }

        // Check in the user
        $registration->update([
            'is_checked_in' => true,
            'checked_in_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in successful',
            'data' => [
                'registration' => $registration->fresh(),
                'type' => $type,
                'checked_in_at' => $registration->checked_in_at
            ]
        ]);
    }

    /**
     * Get QR code information without checking in
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getQRCodeInfo(Request $request): JsonResponse
    {
        $request->validate([
            'qr_code' => 'required|string'
        ]);

        $qrCode = $request->qr_code;

        // Validate QR code format
        if (!QRCodeService::validateQRCode($qrCode)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid QR code format'
            ], 400);
        }

        // Parse QR code to get registration info
        $parsedQR = QRCodeService::parseQRCode($qrCode);
        
        if (!$parsedQR) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid QR code'
            ], 400);
        }

        $registrationId = $parsedQR['registration_id'];
        $type = $parsedQR['type'];

        // Find the registration based on type
        $registration = $this->findRegistration($type, $registrationId);

        if (!$registration) {
            return response()->json([
                'success' => false,
                'message' => 'Registration not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'registration' => $registration,
                'type' => $type,
                'is_checked_in' => $registration->is_checked_in,
                'checked_in_at' => $registration->checked_in_at
            ]
        ]);
    }

    /**
     * Get check-in statistics for admin
     * 
     * @return JsonResponse
     */
    public function getCheckInStats(): JsonResponse
    {
        $hackathonStats = [
            'total' => HackathonRegistration::where('status', 'approved')->count(),
            'checked_in' => HackathonRegistration::where('status', 'approved')
                ->where('is_checked_in', true)->count(),
            'pending' => HackathonRegistration::where('status', 'approved')
                ->where('is_checked_in', false)->count()
        ];

        $workshopStats = [
            'total' => WorkshopRegistration::where('status', 'approved')->count(),
            'checked_in' => WorkshopRegistration::where('status', 'approved')
                ->where('is_checked_in', true)->count(),
            'pending' => WorkshopRegistration::where('status', 'approved')
                ->where('is_checked_in', false)->count()
        ];

        $conferenceStats = [
            'total' => ConferenceRegistration::where('status', 'approved')->count(),
            'checked_in' => ConferenceRegistration::where('status', 'approved')
                ->where('is_checked_in', true)->count(),
            'pending' => ConferenceRegistration::where('status', 'approved')
                ->where('is_checked_in', false)->count()
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'hackathon' => $hackathonStats,
                'workshop' => $workshopStats,
                'conference' => $conferenceStats,
                'overall' => [
                    'total' => $hackathonStats['total'] + $workshopStats['total'] + $conferenceStats['total'],
                    'checked_in' => $hackathonStats['checked_in'] + $workshopStats['checked_in'] + $conferenceStats['checked_in'],
                    'pending' => $hackathonStats['pending'] + $workshopStats['pending'] + $conferenceStats['pending']
                ]
            ]
        ]);
    }

    /**
     * Find registration by type and ID
     * 
     * @param string $type
     * @param int $registrationId
     * @return mixed
     */
    private function findRegistration(string $type, int $registrationId)
    {
        return match($type) {
            'hackathon' => HackathonRegistration::find($registrationId),
            'workshop' => WorkshopRegistration::find($registrationId),
            'conference' => ConferenceRegistration::find($registrationId),
            default => null
        };
    }
}