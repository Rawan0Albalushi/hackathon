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
            // Basic counts
            $totalHackathon = HackathonRegistration::count();
            $totalWorkshop = WorkshopRegistration::count();
            $totalConference = ConferenceRegistration::count();
            $totalRegistrations = $totalHackathon + $totalWorkshop + $totalConference;
            
            // Today's registrations
            $todayRegistrations = HackathonRegistration::whereDate('created_at', today())
                ->count() + 
                WorkshopRegistration::whereDate('created_at', today())
                ->count() + 
                ConferenceRegistration::whereDate('created_at', today())
                ->count();

            // This week's registrations
            $weekStart = Carbon::now()->startOfWeek();
            $weekRegistrations = HackathonRegistration::where('created_at', '>=', $weekStart)
                ->count() + 
                WorkshopRegistration::where('created_at', '>=', $weekStart)
                ->count() + 
                ConferenceRegistration::where('created_at', '>=', $weekStart)
                ->count();

            // This month's registrations
            $monthStart = Carbon::now()->startOfMonth();
            $monthRegistrations = HackathonRegistration::where('created_at', '>=', $monthStart)
                ->count() + 
                WorkshopRegistration::where('created_at', '>=', $monthStart)
                ->count() + 
                ConferenceRegistration::where('created_at', '>=', $monthStart)
                ->count();

            // Pending registrations
            $pendingHackathon = HackathonRegistration::where('status', 'pending')->count();
            $pendingWorkshop = WorkshopRegistration::where('status', 'pending')->count();
            $pendingConference = ConferenceRegistration::where('status', 'pending')->count();
            $totalPending = $pendingHackathon + $pendingWorkshop + $pendingConference;

            // Approved registrations
            $approvedHackathon = HackathonRegistration::where('status', 'approved')->count();
            $approvedWorkshop = WorkshopRegistration::where('status', 'approved')->count();
            $approvedConference = ConferenceRegistration::where('status', 'approved')->count();
            $totalApproved = $approvedHackathon + $approvedWorkshop + $approvedConference;

            // Rejected registrations
            $rejectedHackathon = HackathonRegistration::where('status', 'rejected')->count();
            $rejectedWorkshop = WorkshopRegistration::where('status', 'rejected')->count();
            $rejectedConference = ConferenceRegistration::where('status', 'rejected')->count();
            $totalRejected = $rejectedHackathon + $rejectedWorkshop + $rejectedConference;

            // Growth calculations
            $lastWeekStart = Carbon::now()->subWeek()->startOfWeek();
            $lastWeekEnd = Carbon::now()->subWeek()->endOfWeek();
            $lastWeekRegistrations = HackathonRegistration::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
                ->count() + 
                WorkshopRegistration::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
                ->count() + 
                ConferenceRegistration::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
                ->count();

            $weekGrowth = $lastWeekRegistrations > 0 ? (($weekRegistrations - $lastWeekRegistrations) / $lastWeekRegistrations) * 100 : 0;

            // Daily registrations for the last 7 days
            $dailyRegistrations = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $dayRegistrations = HackathonRegistration::whereDate('created_at', $date)
                    ->count() + 
                    WorkshopRegistration::whereDate('created_at', $date)
                    ->count() + 
                    ConferenceRegistration::whereDate('created_at', $date)
                    ->count();
                
                $dailyRegistrations[] = [
                    'date' => $date->format('Y-m-d'),
                    'day' => $date->format('D'),
                    'count' => $dayRegistrations
                ];
            }

            // Registration trends by type for the last 30 days
            $monthlyTrends = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $hackathonCount = HackathonRegistration::whereDate('created_at', $date)->count();
                $workshopCount = WorkshopRegistration::whereDate('created_at', $date)->count();
                $conferenceCount = ConferenceRegistration::whereDate('created_at', $date)->count();
                
                $monthlyTrends[] = [
                    'date' => $date->format('Y-m-d'),
                    'hackathon' => $hackathonCount,
                    'workshop' => $workshopCount,
                    'conference' => $conferenceCount,
                    'total' => $hackathonCount + $workshopCount + $conferenceCount
                ];
            }


            return response()->json([
                'success' => true,
                'data' => [
                    // Basic statistics
                    'totalRegistrations' => $totalRegistrations,
                    'hackathonRegistrations' => $totalHackathon,
                    'workshopRegistrations' => $totalWorkshop,
                    'conferenceRegistrations' => $totalConference,
                    'todayRegistrations' => $todayRegistrations,
                    'weekRegistrations' => $weekRegistrations,
                    'monthRegistrations' => $monthRegistrations,
                    
                    // Status breakdown
                    'totalPending' => $totalPending,
                    'totalApproved' => $totalApproved,
                    'totalRejected' => $totalRejected,
                    'pendingHackathon' => $pendingHackathon,
                    'pendingWorkshop' => $pendingWorkshop,
                    'pendingConference' => $pendingConference,
                    'approvedHackathon' => $approvedHackathon,
                    'approvedWorkshop' => $approvedWorkshop,
                    'approvedConference' => $approvedConference,
                    'rejectedHackathon' => $rejectedHackathon,
                    'rejectedWorkshop' => $rejectedWorkshop,
                    'rejectedConference' => $rejectedConference,
                    
                    // Growth metrics
                    'weekGrowth' => round($weekGrowth, 2),
                    'lastWeekRegistrations' => $lastWeekRegistrations,
                    
                    // Trends and analytics
                    'dailyRegistrations' => $dailyRegistrations,
                    'monthlyTrends' => $monthlyTrends
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
            \Log::info('Admin status update request', [
                'type' => $type,
                'id' => $id,
                'status' => $request->input('status'),
                'rejection_reason' => $request->input('rejection_reason'),
                'user_id' => auth()->id(),
                'user_role' => auth()->user()?->role,
                'method' => $request->method(),
                'url' => $request->url(),
                'headers' => $request->headers->all()
            ]);

            $status = $request->input('status');
            $rejection_reason = $request->input('rejection_reason');

            // التحقق من صحة البيانات
            if (!$status) {
                \Log::error('No status provided', ['request_data' => $request->all()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Status is required'
                ], 400);
            }

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
                    \Log::error('Invalid registration type', ['type' => $type]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid registration type'
                    ], 400);
            }

            if (!$model) {
                \Log::error('Model not found', ['type' => $type, 'id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Registration not found'
                ], 404);
            }

            \Log::info('Found model', ['model_id' => $model->id, 'current_status' => $model->status]);

            $model->status = $status;
            if ($status === 'rejected' && $rejection_reason) {
                $model->rejection_reason = $rejection_reason;
            } else {
                $model->rejection_reason = null;
            }
            if (!$model->save()) {
                \Log::error('Failed to save model', ['model_id' => $model->id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to save registration status'
                ], 500);
            }

            \Log::info('Status updated successfully', [
                'model_id' => $model->id,
                'new_status' => $model->status,
                'rejection_reason' => $model->rejection_reason
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration status updated successfully',
                'data' => $model
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to update registration status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'type' => $type,
                'id' => $id
            ]);
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

    // User management methods
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $role = $request->get('role', 'all');
            $status = $request->get('status', 'all');
            $page = $request->get('page', 1);
            $perPage = $request->get('per_page', 10);

            $query = User::when($search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($role !== 'all', function($query, $role) {
                $query->where('role', $role);
            })
            ->when($status !== 'all', function($query, $status) {
                $query->where('status', $status);
            });

            $users = $query->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            // Log for debugging
            \Log::info('Users query result:', [
                'total' => $users->total(),
                'count' => $users->count(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage()
            ]);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching users:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $id,
                'role' => 'required|in:user,admin',
                'status' => 'required|in:active,inactive,banned'
            ]);

            $user->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            
            // Prevent deleting the last admin
            if ($user->role === 'admin') {
                $adminCount = User::where('role', 'admin')->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the last admin user'
                    ], 400);
                }
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function bulkUserAction(Request $request): JsonResponse
    {
        try {
            $userIds = $request->input('user_ids', []);
            $action = $request->input('action');

            if (empty($userIds) || !in_array($action, ['activate', 'deactivate', 'ban', 'delete'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid action or no users selected'
                ], 400);
            }

            $users = User::whereIn('id', $userIds);

            switch ($action) {
                case 'activate':
                    $users->update(['status' => 'active']);
                    break;
                case 'deactivate':
                    $users->update(['status' => 'inactive']);
                    break;
                case 'ban':
                    $users->update(['status' => 'banned']);
                    break;
                case 'delete':
                    // Check if trying to delete all admins
                    $adminUsers = $users->where('role', 'admin')->get();
                    $totalAdmins = User::where('role', 'admin')->count();
                    
                    if ($adminUsers->count() > 0 && $totalAdmins <= $adminUsers->count()) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Cannot delete all admin users'
                        ], 400);
                    }
                    
                    $users->delete();
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => 'Bulk action completed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to perform bulk action',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
