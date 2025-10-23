<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UpdateUsersStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update all users to have 'active' status if they don't have one
        User::whereNull('status')->orWhere('status', '')->update(['status' => 'active']);
        
        echo "Updated users status to 'active' for users without status\n";
    }
}