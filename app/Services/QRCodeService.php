<?php

namespace App\Services;

use Illuminate\Support\Str;

class QRCodeService
{
    /**
     * Generate a unique QR code for registration
     * 
     * @param string $type Registration type (hackathon, workshop, conference)
     * @param int $registrationId Registration ID
     * @return string
     */
    public static function generateQRCode(string $type, int $registrationId): string
    {
        $prefix = self::getTypePrefix($type);
        // $timestamp = now()->format('YmdHis');
        $randomNumber = rand(12345, 98769);
        // $randomString = Str::random(8);
        
        return $prefix . $randomNumber . $registrationId;
    }

    /**
     * Get prefix for registration type
     * 
     * @param string $type
     * @return string
     */
    private static function getTypePrefix(string $type): string
    {
        return match($type) {
            'hackathon' => 'H1',
            'workshop' => 'W2',
            'conference' => 'C3',
            default => 'X0'
        };
    }

    /**
     * Parse QR code to extract information
     * 
     * @param string $qrCode
     * @return array|null
     */
    public static function parseQRCode(string $qrCode): ?array
    {
        // Extract prefix (first 2 characters)
        $prefix = substr($qrCode, 0, 2);
        $type = self::getTypeFromPrefix($prefix);
        
        if (!$type) {
            return null;
        }

        // Extract timestamp (next 14 characters)
        $timestamp = substr($qrCode, 2, 14);
        
        // Extract random string (next 8 characters)
        $randomString = substr($qrCode, 16, 8);
        
        // Extract registration ID (remaining characters)
        $registrationId = substr($qrCode, 24);

        return [
            'type' => $type,
            'prefix' => $prefix,
            'timestamp' => $timestamp,
            'random_string' => $randomString,
            'registration_id' => (int) $registrationId,
            'original_qr_code' => $qrCode
        ];
    }

    /**
     * Get registration type from prefix
     * 
     * @param string $prefix
     * @return string|null
     */
    private static function getTypeFromPrefix(string $prefix): ?string
    {
        return match($prefix) {
            'H1' => 'hackathon',
            'W2' => 'workshop',
            'C3' => 'conference',
            default => null
        };
    }

    /**
     * Validate QR code format
     * 
     * @param string $qrCode
     * @return bool
     */
    public static function validateQRCode(string $qrCode): bool
    {
        $parsed = self::parseQRCode($qrCode);
        return $parsed !== null && is_numeric($parsed['registration_id']);
    }
}
