<?php

use Illuminate\Support\Facades\Route;

// Serve built assets directly
Route::get('/build/{path}', function () {
    abort(404);
})->where('path', '.*');

// Fallback to SPA for all non-API routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api/).*$');
