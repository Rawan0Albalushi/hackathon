<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class OtpCode extends Model
{
    protected $fillable = [
        'email',
        'code',
        'type',
        'expires_at',
        'used'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean'
    ];

    /**
     * Check if OTP code is valid and not expired
     */
    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    /**
     * Mark OTP as used
     */
    public function markAsUsed(): void
    {
        $this->update(['used' => true]);
    }

    /**
     * Generate a random 6-digit OTP code
     */
    public static function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create a new OTP code for email verification
     */
    public static function createForEmailVerification(string $email): self
    {
        // Delete any existing unused OTP codes for this email
        self::where('email', $email)
            ->where('type', 'email_verification')
            ->where('used', false)
            ->delete();

        return self::create([
            'email' => $email,
            'code' => self::generateCode(),
            'type' => 'email_verification',
            'expires_at' => Carbon::now()->addMinutes(10) // 10 minutes expiry
        ]);
    }

    /**
     * Verify OTP code
     */
    public static function verifyCode(string $email, string $code, string $type = 'email_verification'): ?self
    {
        $otp = self::where('email', $email)
            ->where('code', $code)
            ->where('type', $type)
            ->where('used', false)
            ->first();

        if ($otp && $otp->isValid()) {
            return $otp;
        }

        return null;
    }
}
