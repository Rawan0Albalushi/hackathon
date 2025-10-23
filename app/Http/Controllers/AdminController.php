<?php

namespace App\Http\Controllers;

use App\Models\HackathonRegistration;
use App\Models\WorkshopRegistration;
use App\Models\ConferenceRegistration;
use App\Models\Workshop;
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

    // Get hackathon registrations
    public function getHackathonRegistrations(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $status = $request->get('status', '');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $query = HackathonRegistration::with('user')
                ->when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })
                ->when($status, function($query, $status) {
                    $query->where('status', $status);
                });

            $registrations = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $registrations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch hackathon registrations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get conference registrations
    public function getConferenceRegistrations(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $status = $request->get('status', '');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $query = ConferenceRegistration::with('user')
                ->when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })
                ->when($status, function($query, $status) {
                    $query->where('status', $status);
                });

            $registrations = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $registrations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conference registrations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get workshop registrations
    public function getWorkshopRegistrations(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $status = $request->get('status', '');
            $workshop_id = $request->get('workshop_id', '');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $query = WorkshopRegistration::with(['user', 'workshop'])
                ->when($search, function($query, $search) {
                    $query->where('full_name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                })
                ->when($status, function($query, $status) {
                    $query->where('status', $status);
                })
                ->when($workshop_id, function($query, $workshop_id) {
                    $query->where('workshop_id', $workshop_id);
                });

            $registrations = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $registrations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch workshop registrations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update registration status
    public function updateRegistrationStatus(Request $request, $type, $id): JsonResponse
    {
        try {
            $status = $request->input('status');
            $rejection_reason = $request->input('rejection_reason');

            $model = null;
            switch ($type) {
                case 'hackathon':
                    $model = HackathonRegistration::findOrFail($id);
                    break;
                case 'conference':
                    $model = ConferenceRegistration::findOrFail($id);
                    break;
                case 'workshop':
                    $model = WorkshopRegistration::findOrFail($id);
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid registration type'
                    ], 400);
            }

            $model->status = $status;
            if ($status === 'rejected' && $rejection_reason) {
                $model->rejection_reason = $rejection_reason;
            } else {
                $model->rejection_reason = null;
            }
            $model->save();

            return response()->json([
                'success' => true,
                'message' => 'Registration status updated successfully',
                'data' => $model
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update registration status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Workshop management
    public function getWorkshops(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $query = Workshop::when($search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%");
            });

            $workshops = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

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

    public function createWorkshop(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'instructor' => 'required|string|max:255',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'max_participants' => 'nullable|integer|min:1',
                'requirements' => 'nullable|string'
            ]);

            $workshop = Workshop::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Workshop created successfully',
                'data' => $workshop
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create workshop',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateWorkshop(Request $request, $id): JsonResponse
    {
        try {
            $workshop = Workshop::findOrFail($id);

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'instructor' => 'required|string|max:255',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'max_participants' => 'nullable|integer|min:1',
                'requirements' => 'nullable|string',
                'is_active' => 'boolean'
            ]);

            $workshop->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Workshop updated successfully',
                'data' => $workshop
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update workshop',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteWorkshop($id): JsonResponse
    {
        try {
            $workshop = Workshop::findOrFail($id);
            $workshop->delete();

            return response()->json([
                'success' => true,
                'message' => 'Workshop deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete workshop',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
