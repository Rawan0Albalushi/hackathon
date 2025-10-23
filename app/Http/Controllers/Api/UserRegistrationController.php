<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HackathonRegistration;
use App\Models\WorkshopRegistration;
use App\Models\ConferenceRegistration;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserRegistrationController extends Controller
{
    public function getMyRegistrations(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $hackathonRegistration = HackathonRegistration::where('user_id', $user->id)->first();
            $conferenceRegistration = ConferenceRegistration::where('user_id', $user->id)->first();
            $workshopRegistrations = WorkshopRegistration::with('workshop')
                ->where('user_id', $user->id)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'hackathon' => $hackathonRegistration,
                    'conference' => $conferenceRegistration,
                    'workshops' => $workshopRegistrations
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch registrations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getHackathonStatus(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $hackathonRegistration = HackathonRegistration::where('user_id', $user->id)->first();

            return response()->json([
                'success' => true,
                'data' => $hackathonRegistration
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hackathon status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableWorkshops(Request $request): JsonResponse
    {
        try {
            $workshops = Workshop::where('is_active', true)
                ->where('start_time', '>', now())
                ->orderBy('start_time', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $workshops
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch workshops',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}