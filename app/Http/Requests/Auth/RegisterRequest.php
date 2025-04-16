<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            "celular" => 'required|string|max:255',
            "pais" => 'required|string|max:255',
            "departamento" => 'required|string|max:255',
            "ciudad" => 'required|string|max:255',
            'recaptcha' => ['required', function ($attribute, $value, $fail) {
                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => env('RECAPTCHA_SECRET_KEY'),
                    'response' => $value,
                ]);

                if (!($response->json()['success'] ?? false)) {
                    $fail('Verificación de reCAPTCHA fallida.');
                }
            }],
        ];
    }
    public function message(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a string',
            'name.max' => 'Name must not exceed 255 characters',
            'email.string' => 'Email must be a string',
            'email.email' => 'Email must be a valid email address',
            'email.max' => 'Email must not exceed 255 characters',
            'email.unique' => 'Email already exists',
            'email.required' => 'Email is required',
            'password.required' => 'Password is required',
            'password.string' => 'Password must be a string',
            'password.min' => 'Password must be at least 8 characters',
            "celular.required" => 'Celular is required',
            "celular.string" => 'Celular must be a string',
            "celular.max" => 'Celular must not exceed 255 characters',
            "pais.required" => 'Pais is required',
            "pais.string" => 'Pais must be a string',
            "pais.max" => 'Pais must not exceed 255 characters',
            "departamento.required" => 'Departamento is required',
            "departamento.string" => 'Departamento must be a string',
            "departamento.max" => 'Departamento must not exceed 255 characters',
            "ciudad.required" => 'Ciudad is required',
            "ciudad.string" => 'Ciudad must be a string',
            "ciudad.max" => 'Ciudad must not exceed 255 characters',
        ];
    }
}
