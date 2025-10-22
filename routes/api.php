<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HackathonRegistrationController;
use App\Http\Controllers\Api\WorkshopRegistrationController;
use App\Http\Controllers\Api\ConferenceRegistrationController;
use App\Http\Controllers\AdminController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Registration API routes
Route::post('/register/hackathon', [HackathonRegistrationController::class, 'store']);
Route::post('/register/workshop', [WorkshopRegistrationController::class, 'store']);
Route::post('/register/conference', [ConferenceRegistrationController::class, 'store']);

// Admin API routes
Route::get('/admin/stats', [AdminController::class, 'getStats']);
Route::get('/admin/registrations', [AdminController::class, 'getRegistrations']);
