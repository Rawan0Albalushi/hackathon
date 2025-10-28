<?php

namespace App\Services;

use App\Models\OtpCode;
use App\Models\User;
use App\Mail\OtpVerificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Send OTP verification email
     */
    public function sendVerificationEmail(string $email, string $userName = null): array
    {
        try {
            // Create OTP code
            $otpCode = OtpCode::createForEmailVerification($email);
            
            // Send email
            Mail::to($email)->send(new OtpVerificationMail($otpCode->code, $userName));
            
            Log::info('OTP verification email sent', [
                'email' => $email,
                'otp_id' => $otpCode->id
            ]);
            
            return [
                'success' => true,
                'message' => 'تم إرسال كود التحقق إلى بريدك الإلكتروني',
                'expires_in' => 10 // minutes
            ];
        } catch (\Exception $e) {
            Log::error('Failed to send OTP verification email', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'message' => 'فشل في إرسال كود التحقق. يرجى المحاولة مرة أخرى.'
            ];
        }
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(string $email, string $code): array
    {
        try {
            $otp = OtpCode::verifyCode($email, $code, 'email_verification');
            
            if (!$otp) {
                return [
                    'success' => false,
                    'message' => 'كود التحقق غير صحيح أو منتهي الصلاحية'
                ];
            }
            
            // Mark OTP as used
            $otp->markAsUsed();
            
            // Find and verify user
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->markEmailAsVerified();
            }
            
            Log::info('OTP verified successfully', [
                'email' => $email,
                'otp_id' => $otp->id
            ]);
            
            return [
                'success' => true,
                'message' => 'تم التحقق من بريدك الإلكتروني بنجاح'
            ];
        } catch (\Exception $e) {
            Log::error('Failed to verify OTP', [
                'email' => $email,
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'message' => 'فشل في التحقق من الكود. يرجى المحاولة مرة أخرى.'
            ];
        }
    }

    /**
     * Resend OTP code
     */
    public function resendOtp(string $email, string $userName = null): array
    {
        // Delete any existing unused OTP codes
        OtpCode::where('email', $email)
            ->where('type', 'email_verification')
            ->where('used', false)
            ->delete();
        
        return $this->sendVerificationEmail($email, $userName);
    }

    /**
     * Check if user needs email verification
     */
    public function needsEmailVerification(User $user): bool
    {
        return !$user->isEmailVerified();
    }
}
