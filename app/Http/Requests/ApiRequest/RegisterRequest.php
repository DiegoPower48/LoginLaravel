<?php

namespace App\Http\Requests\ApiRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class RegisterRequest extends FormRequest
{

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
            "celular" => 'required|string|max:12',
            "pais" => 'required|string|max:20',
            "departamento" => 'required|string|max:20',
            "ciudad" => 'required|string|max:20',
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
    public function messages()
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser una cadena de texto',
            'name.max' => 'El nombre no debe exceder los 255 caracteres',

            'email.string' => 'El correo electrónico debe ser una cadena de texto',
            'email.email' => 'El correo electrónico debe ser una dirección válida',
            'email.max' => 'El correo electrónico no debe exceder los 255 caracteres',
            'email.unique' => 'Este correo electrónico ya está registrado',
            'email.required' => 'El correo electrónico es obligatorio',

            'password.required' => 'La contraseña es obligatoria',
            'password.string' => 'La contraseña debe ser una cadena de texto',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',

            'celular.required' => 'El número de celular es obligatorio',
            'celular.string' => 'El número de celular debe ser una cadena de texto',
            'celular.max' => 'El número de celular no debe exceder los 12 caracteres',

            'pais.required' => 'El país es obligatorio',
            'pais.string' => 'El país debe ser una cadena de texto',
            'pais.max' => 'El país no debe exceder los 20 caracteres',

            'departamento.required' => 'El departamento es obligatorio',
            'departamento.string' => 'El departamento debe ser una cadena de texto',
            'departamento.max' => 'El departamento no debe exceder los 20 caracteres',

            'ciudad.required' => 'La ciudad es obligatoria',
            'ciudad.string' => 'La ciudad debe ser una cadena de texto',
            'ciudad.max' => 'La ciudad no debe exceder los 20 caracteres',
            'recaptcha.required' => 'Por favor, confirma que no eres un robot.',
        ];
    }
    public function ensureIsNotRateLimited(): void
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            throw ValidationException::withMessages([
                'email' => 'Demasiados intentos de registro. Por favor, inténtelo más tarde.',
            ]);
        }
    }

    public function throttleKey(): string
    {
        return Str::lower($this->string('email') . '|' . $this->ip());
    }
}
