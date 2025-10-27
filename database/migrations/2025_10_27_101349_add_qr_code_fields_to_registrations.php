<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add QR code fields to hackathon_registrations
        Schema::table('hackathon_registrations', function (Blueprint $table) {
            $table->string('qr_code')->unique()->nullable();
            $table->boolean('is_checked_in')->default(false);
            $table->timestamp('checked_in_at')->nullable();
        });

        // Add QR code fields to workshop_registrations
        Schema::table('workshop_registrations', function (Blueprint $table) {
            $table->string('qr_code')->unique()->nullable();
            $table->boolean('is_checked_in')->default(false);
            $table->timestamp('checked_in_at')->nullable();
        });

        // Add QR code fields to conference_registrations
        Schema::table('conference_registrations', function (Blueprint $table) {
            $table->string('qr_code')->unique()->nullable();
            $table->boolean('is_checked_in')->default(false);
            $table->timestamp('checked_in_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove QR code fields from hackathon_registrations
        Schema::table('hackathon_registrations', function (Blueprint $table) {
            $table->dropColumn(['qr_code', 'is_checked_in', 'checked_in_at']);
        });

        // Remove QR code fields from workshop_registrations
        Schema::table('workshop_registrations', function (Blueprint $table) {
            $table->dropColumn(['qr_code', 'is_checked_in', 'checked_in_at']);
        });

        // Remove QR code fields from conference_registrations
        Schema::table('conference_registrations', function (Blueprint $table) {
            $table->dropColumn(['qr_code', 'is_checked_in', 'checked_in_at']);
        });
    }
};
