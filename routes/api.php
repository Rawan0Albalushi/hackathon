<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HackathonRegistrationController;
use App\Http\Controllers\Api\WorkshopRegistrationController;
use App\Http\Controllers\Api\ConferenceRegistrationController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\AuthController;

// CSRF token route (requires web middleware)
Route::middleware(['web'])->group(function () {
    Route::get('/csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
});

// Authentication routes (with session middleware but no CSRF for API)
Route::middleware(['web'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:web')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Registration API routes (protected)
    Route::post('/register/hackathon', [HackathonRegistrationController::class, 'store']);
    Route::post('/register/workshop', [WorkshopRegistrationController::class, 'store']);
    Route::post('/register/conference', [ConferenceRegistrationController::class, 'store']);
    
    // Admin API routes (admin only)
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [AdminController::class, 'getStats']);
        Route::get('/admin/registrations', [AdminController::class, 'getRegistrations']);
    });
});
