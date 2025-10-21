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
        Schema::table('hackathon_registrations', function (Blueprint $table) {
            $table->text('other_skills')->nullable()->after('skills');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hackathon_registrations', function (Blueprint $table) {
            $table->dropColumn('other_skills');
        });
    }
};
