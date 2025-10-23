<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        \Log::info('Admin middleware check', [
            'user_id' => $user?->id,
            'user_role' => $user?->role,
            'is_admin' => $user?->isAdmin(),
            'url' => $request->url(),
            'method' => $request->method()
        ]);
        
        if (!$user || !$user->isAdmin()) {
            \Log::warning('Admin access denied', [
                'user_id' => $user?->id,
                'user_role' => $user?->role,
                'url' => $request->url()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.'
            ], 403);
        }

        return $next($request);
    }
}
