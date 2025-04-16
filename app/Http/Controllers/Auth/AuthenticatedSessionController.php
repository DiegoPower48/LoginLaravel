<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)

    {
        $credentials = $request->only('email', 'password');

        if (! $token = JWTAuth::attempt($credentials)) {
            return back()->withErrors([
                'email' => 'Credenciales inválidas.',
            ]);
        }

        cookie()->queue('token', $token, 60 * 24);

        return redirect()->intended(route('dashboard'));
    }





    public function destroy()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Exception $e) {
        }

        cookie()->queue(cookie()->forget('token'));

        return redirect('/');
    }
}
