<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\HackathonRegistration;
use App\Models\WorkshopRegistration;
use App\Models\ConferenceRegistration;

class RegistrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hackathon Registrations
        HackathonRegistration::create([
            'full_name' => 'أحمد محمد',
            'email' => 'ahmed@example.com',
            'phone' => '0501234567',
            'age' => 25,
            'city' => 'الرياض',
            'background' => 'مطور برمجيات',
            'skills' => ['JavaScript', 'React', 'Node.js'],
            'other_skills' => 'Python, Machine Learning'
        ]);

        HackathonRegistration::create([
            'full_name' => 'فاطمة علي',
            'email' => 'fatima@example.com',
            'phone' => '0507654321',
            'age' => 22,
            'city' => 'جدة',
            'background' => 'طالبة علوم حاسوب',
            'skills' => ['Python', 'Django', 'SQL'],
            'other_skills' => 'Data Analysis'
        ]);

        HackathonRegistration::create([
            'full_name' => 'محمد السعد',
            'email' => 'mohammed@example.com',
            'phone' => '0509876543',
            'age' => 28,
            'city' => 'الدمام',
            'background' => 'مهندس برمجيات',
            'skills' => ['Java', 'Spring Boot', 'MySQL'],
            'other_skills' => 'Cloud Computing'
        ]);

        // Workshop Registrations
        WorkshopRegistration::create([
            'full_name' => 'سارة أحمد',
            'email' => 'sara@example.com',
            'phone' => '0501111111',
            'background' => 'مصممة UI/UX',
            'reason' => 'أريد تعلم تقنيات التصميم الحديثة'
        ]);

        WorkshopRegistration::create([
            'full_name' => 'خالد النور',
            'email' => 'khalid@example.com',
            'phone' => '0502222222',
            'background' => 'مطور تطبيقات',
            'reason' => 'تطوير مهاراتي في البرمجة'
        ]);

        // Conference Registrations
        ConferenceRegistration::create([
            'full_name' => 'نورا الزهراني',
            'email' => 'nora@example.com',
            'phone' => '0503333333',
            'organization' => 'شركة التقنية المتقدمة',
            'session_choice' => 'first'
        ]);

        ConferenceRegistration::create([
            'full_name' => 'عبدالله القحطاني',
            'email' => 'abdullah@example.com',
            'phone' => '0504444444',
            'organization' => 'جامعة الملك سعود',
            'session_choice' => 'both'
        ]);

        ConferenceRegistration::create([
            'full_name' => 'ريم العتيبي',
            'email' => 'reem@example.com',
            'phone' => '0505555555',
            'organization' => 'معهد البحوث',
            'session_choice' => 'second'
        ]);
    }
}