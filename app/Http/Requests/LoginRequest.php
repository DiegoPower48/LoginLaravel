<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

class LoginRequest extends FormRequest
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
                       'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
         
        ];
    }

    public function message(): array
    {
        return [
           
            'email.string' => 'Email must be a string',
            'email.email' => 'Email must be a valid email address',
            'email.max' => 'Email must not exceed 255 characters',            
            'email.required' => 'Email is required',
            'password.required' => 'Password is required', 'password.string' => 'Password must be a string',
            'password.min' => 'Password must be at least 8 characters',
           

        ];
    }  public function failedValidation(Validator $validator){
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation Error',
            'data' => $validator->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY));
    }
}
