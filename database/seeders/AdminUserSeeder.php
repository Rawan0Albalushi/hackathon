<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@hackathon.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        // Create a regular user for testing
        User::create([
            'name' => 'Test User',
            'email' => 'user@hackathon.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);
    }
}