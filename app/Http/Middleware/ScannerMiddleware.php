<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ScannerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->isScanner()) {
            \Log::warning('Scanner access denied', [
                'user_id' => $user?->id,
                'user_role' => $user?->role,
                'url' => $request->url()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Scanner privileges required.'
            ], 403);
        }

        return $next($request);
    }
}
