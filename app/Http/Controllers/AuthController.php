<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    public function register(UserRequest $request)
    {
        $validatedData = $request->validated();
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);
        return response()->json([
            'message' => 'Usuario registrado con éxito',

        ], Response::HTTP_CREATED);
    }
    public function login(LoginRequest $request)
    {
        $validatedData = $request->validated();

        $credentials = [
            'email' => $validatedData['email'],
            'password' => $validatedData['password']
        ];

        try {

            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => 'Credenciales inválidas',
                ], Response::HTTP_UNAUTHORIZED);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Error al crear el token',
                "error" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return $this->respondWithToken($token);
    }
    public function who()
    {
        $user = auth()->user();
        return response()->json($user);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }



    public function logout()
    {
        try {
            $token = JWTAuth::getToken();
            JWTAuth::invalidate($token);
            return response()->json(["message" => "Sesion cerrada con exito"], Response::HTTP_OK);
        } catch (JWTException) {
            return response()->json(["message" => "No se pudo cerrar la sesion, el token no es valido"], Response::HTTP_INTERNAL_SERVER_ERROR);
        };
    }



    public function refresh()
    {
        try {
            $token = JWTAuth::getToken();
            $newToken = auth()->refresh($token);

            JWTAuth::invalidate($token);
            return $this->respondWithToken($newToken);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Error al refrescar el token',
                "error" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
