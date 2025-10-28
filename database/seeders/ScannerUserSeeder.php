<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ScannerUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if scanner user already exists
        $existingScanner = User::where('email', 'scanner@example.com')->first();
        
        if (!$existingScanner) {
            User::create([
                'name' => 'Scanner User',
                'email' => 'scanner@example.com',
                'password' => Hash::make('password'),
                'role' => 'scanner',
                'status' => 'active'
            ]);
            
            $this->command->info('Scanner user created successfully!');
        } else {
            // Update existing user to scanner role
            $existingScanner->update([
                'role' => 'scanner',
                'status' => 'active'
            ]);
            
            $this->command->info('Scanner user updated successfully!');
        }
    }
}
