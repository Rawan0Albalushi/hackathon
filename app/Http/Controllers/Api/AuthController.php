<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|in:user,admin,scanner'
        ]);

        if ($validator->fails()) {
            
            // Translate validation messages to Arabic
            $errors = $validator->errors();
            $translatedErrors = [];
            
            foreach ($errors->toArray() as $field => $messages) {
                $translatedMessages = [];
                foreach ($messages as $message) {
                    if (str_contains($message, 'The email has already been taken')) {
                        $translatedMessages[] = 'البريد الإلكتروني مستخدم بالفعل';
                    } elseif (str_contains($message, 'The name field is required')) {
                        $translatedMessages[] = 'الاسم مطلوب';
                    } elseif (str_contains($message, 'The email field is required')) {
                        $translatedMessages[] = 'البريد الإلكتروني مطلوب';
                    } elseif (str_contains($message, 'The password field is required')) {
                        $translatedMessages[] = 'كلمة المرور مطلوبة';
                    } elseif (str_contains($message, 'The password confirmation does not match')) {
                        $translatedMessages[] = 'تأكيد كلمة المرور غير متطابق';
                    } elseif (str_contains($message, 'The password must be at least 8 characters')) {
                        $translatedMessages[] = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
                    } else {
                        $translatedMessages[] = $message;
                    }
                }
                $translatedErrors[$field] = $translatedMessages;
            }
            
            return response()->json([
                'success' => false,
                'message' => 'فشل التحقق من البيانات',
                'errors' => $translatedErrors
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'user',
                'email_verified' => false
            ]);

            // Send OTP verification email
            $otpResult = $this->otpService->sendVerificationEmail($user->email, $user->name);
            
            if (!$otpResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $otpResult['message']
                ], 500);
            }

            // Login the user automatically after registration
            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'email_verified' => $user->email_verified
                    ],
                    'otp_sent' => true,
                    'otp_expires_in' => $otpResult['expires_in']
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'بيانات الدخول غير صحيحة'
                ], 401);
            }

            $user = Auth::user();

            // Check if email is verified
            if (!$user->isEmailVerified()) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'يرجى التحقق من بريدك الإلكتروني أولاً',
                    'requires_email_verification' => true,
                    'email' => $user->email
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'email_verified' => $user->email_verified
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Logout the user
            Auth::logout();
            
            // Invalidate the session
            $request->session()->invalidate();
            
            // Regenerate CSRF token
            $request->session()->regenerateToken();
            
            // Clear all session data
            $request->session()->flush();
            
            // Forget the session cookie
            $request->session()->forget('login_web_' . sha1('App\Models\User'));

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'email_verified' => $user->email_verified
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send OTP verification email
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني غير صحيح أو غير مسجل',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        if ($user->isEmailVerified()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني محقق بالفعل'
            ], 400);
        }

        $result = $this->otpService->sendVerificationEmail($request->email, $user->name);
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'البيانات المدخلة غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->otpService->verifyOtp($request->email, $request->code);
        
        if ($result['success']) {
            // Login the user after successful verification
            $user = User::where('email', $request->email)->first();
            Auth::login($user);
        }
        
        return response()->json($result, $result['success'] ? 200 : 400);
    }

    /**
     * Resend OTP code
     */
    public function resendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني غير صحيح أو غير مسجل',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        $result = $this->otpService->resendOtp($request->email, $user->name);
        
        return response()->json($result, $result['success'] ? 200 : 500);
    }
}