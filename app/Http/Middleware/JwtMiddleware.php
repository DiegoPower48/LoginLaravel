<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {

            $token = $request->cookie('token');

            if (! $token) {
                return redirect()->route('login');
            }


            JWTAuth::setToken($token)->authenticate();
        } catch (JWTException $e) {
            if ($request->header('X-Inertia')) {
                return redirect()->route('login')->withErrors([
                    'auth' => 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                ]);
            }
            //Para la api
            return response()->json([
                'error' => 'No autorizado.',
                'message' => $e->getMessage(),
            ], 401);
        }

        return $next($request);
    }
}
