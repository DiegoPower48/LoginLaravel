<?php

namespace App\Http\Controllers\ApiAuth;

use App\Http\Requests\ApiRequest\RegisterRequest;
use App\Http\Requests\ApiRequest\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Controllers\Controller;

class AuthController extends Controller


{
    public function Register(RegisterRequest  $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'celular' => $request->celular,
            'pais' => $request->pais,
            'departamento' => $request->departamento,
            'ciudad' => $request->ciudad,
        ]);


        try {
            $token = JWTAuth::fromUser($user);

            Cookie::queue('token', $token, 60 * 24);
        } catch (JWTException $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Error al crear el token. Intenta iniciar sesión manualmente.',
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }

    public function Login(LoginRequest $request)

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









    public function Logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (\Exception $e) {
        }

        cookie()->queue(cookie()->forget('token'));

        return redirect('/');
    }
}
