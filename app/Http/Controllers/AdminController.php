<?php

namespace App\Http\Controllers;

use App\Models\HackathonRegistration;
use App\Models\WorkshopRegistration;
use App\Models\ConferenceRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function getStats(): JsonResponse
    {
        try {
            $totalHackathon = HackathonRegistration::count();
            $totalWorkshop = WorkshopRegistration::count();
            $totalConference = ConferenceRegistration::count();
            $totalRegistrations = $totalHackathon + $totalWorkshop + $totalConference;
            
            $todayRegistrations = HackathonRegistration::whereDate('created_at', today())
                ->count() + 
                WorkshopRegistration::whereDate('created_at', today())
                ->count() + 
                ConferenceRegistration::whereDate('created_at', today())
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalRegistrations' => $totalRegistrations,
                    'hackathonRegistrations' => $totalHackathon,
                    'workshopRegistrations' => $totalWorkshop,
                    'conferenceRegistrations' => $totalConference,
                    'todayRegistrations' => $todayRegistrations
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRegistrations(Request $request): JsonResponse
    {
        try {
            $type = $request->get('type', 'all');
            $search = $request->get('search', '');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $registrations = collect();

            if ($type === 'all' || $type === 'hackathon') {
                $hackathonRegistrations = HackathonRegistration::when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })->get()->map(function($reg) {
                    return [
                        'id' => $reg->id,
                        'name' => $reg->full_name,
                        'email' => $reg->email,
                        'phone' => $reg->phone,
                        'type' => 'Hackathon',
                        'skills' => $reg->skills,
                        'date' => $reg->created_at->format('Y-m-d H:i:s')
                    ];
                });
                $registrations = $registrations->merge($hackathonRegistrations);
            }

            if ($type === 'all' || $type === 'workshop') {
                $workshopRegistrations = WorkshopRegistration::when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })->get()->map(function($reg) {
                    return [
                        'id' => $reg->id,
                        'name' => $reg->full_name,
                        'email' => $reg->email,
                        'phone' => $reg->phone,
                        'type' => 'Workshop',
                        'skills' => null, // Workshop doesn't have skills
                        'date' => $reg->created_at->format('Y-m-d H:i:s')
                    ];
                });
                $registrations = $registrations->merge($workshopRegistrations);
            }

            if ($type === 'all' || $type === 'conference') {
                $conferenceRegistrations = ConferenceRegistration::when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })->get()->map(function($reg) {
                    return [
                        'id' => $reg->id,
                        'name' => $reg->full_name,
                        'email' => $reg->email,
                        'phone' => $reg->phone,
                        'type' => 'Conference',
                        'skills' => null, // Conference doesn't have skills
                        'date' => $reg->created_at->format('Y-m-d H:i:s')
                    ];
                });
                $registrations = $registrations->merge($conferenceRegistrations);
            }

            $total = $registrations->count();
            $registrations = $registrations->sortByDesc('date')->forPage($page, $perPage)->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'registrations' => $registrations,
                    'total' => $total,
                    'current_page' => $page,
                    'per_page' => $perPage,
                    'last_page' => ceil($total / $perPage)
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
}
