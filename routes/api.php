<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HackathonRegistrationController;
use App\Http\Controllers\Api\WorkshopRegistrationController;
use App\Http\Controllers\Api\ConferenceRegistrationController;
use App\Http\Controllers\Api\UserRegistrationController;
use App\Http\Controllers\Api\QRCodeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\AuthController;

// CSRF token route (requires web middleware but no CSRF verification)
Route::middleware(['web'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::get('/csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
});

// Authentication routes (with web middleware for session but no CSRF)
Route::middleware(['web'])->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp']);
});

// Protected routes
Route::middleware(['web', 'auth:web'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Registration API routes (protected)
    Route::post('/register/hackathon', [HackathonRegistrationController::class, 'store']);
    Route::post('/register/workshop', [WorkshopRegistrationController::class, 'store']);
    Route::post('/register/conference', [ConferenceRegistrationController::class, 'store']);
    
    // User registration status routes
    Route::get('/user/registrations', [UserRegistrationController::class, 'getMyRegistrations']);
    Route::get('/user/hackathon-status', [UserRegistrationController::class, 'getHackathonStatus']);
    Route::get('/user/workshops', [UserRegistrationController::class, 'getAvailableWorkshops']);
    
    // QR Code routes
    Route::post('/qr/scan', [QRCodeController::class, 'scanQRCode']);
    Route::post('/qr/info', [QRCodeController::class, 'getQRCodeInfo']);
    
    // Admin API routes (admin only)
    Route::middleware(['web', 'auth:web', 'admin'])->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'getStats']);
        Route::get('/admin/registrations', [AdminController::class, 'getRegistrations']);
        
        // Separate admin pages for each registration type
        Route::get('/admin/hackathon-registrations', [AdminController::class, 'getHackathonRegistrations']);
        Route::get('/admin/conference-registrations', [AdminController::class, 'getConferenceRegistrations']);
        Route::get('/admin/workshop-registrations', [AdminController::class, 'getWorkshopRegistrations']);
        
        // Update registration status
        Route::put('/admin/registrations/{type}/{id}/status', [AdminController::class, 'updateRegistrationStatus']);
        
        // Alternative POST route for testing
        Route::post('/admin/registrations/{type}/{id}/status', [AdminController::class, 'updateRegistrationStatus']);
        
        // Test route for debugging
        Route::get('/admin/test', function() {
            return response()->json(['success' => true, 'message' => 'Admin test route works']);
        });
        
        // Test PUT route for debugging
        Route::put('/admin/test-put', function(Request $request) {
            return response()->json([
                'success' => true, 
                'message' => 'Admin PUT test route works',
                'data' => $request->all()
            ]);
        });
        
        // Workshop management
        Route::get('/admin/workshops', [AdminController::class, 'getWorkshops']);
        Route::post('/admin/workshops', [AdminController::class, 'createWorkshop']);
        Route::put('/admin/workshops/{id}', [AdminController::class, 'updateWorkshop']);
        Route::delete('/admin/workshops/{id}', [AdminController::class, 'deleteWorkshop']);
        
        // User management
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/admin/users/bulk-action', [AdminController::class, 'bulkUserAction']);
        
        // QR Code admin routes
        Route::get('/admin/qr/stats', [QRCodeController::class, 'getCheckInStats']);
    });
    
    // Scanner API routes (scanner only)
    Route::middleware(['web', 'auth:web', 'scanner'])->group(function () {
        // QR Code scanner routes
        Route::post('/scanner/qr/scan', [QRCodeController::class, 'scanQRCode']);
        Route::post('/scanner/qr/info', [QRCodeController::class, 'getQRCodeInfo']);
    });
});
