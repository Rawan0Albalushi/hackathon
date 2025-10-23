<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Workshop;
use Carbon\Carbon;

class WorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workshops = [
            [
                'title' => 'أساسيات البرمجة في Python',
                'description' => 'ورشة تعليمية شاملة لتعلم أساسيات البرمجة باستخدام لغة Python',
                'instructor' => 'د. أحمد محمد',
                'start_time' => Carbon::now()->addDays(7)->setTime(10, 0),
                'end_time' => Carbon::now()->addDays(7)->setTime(14, 0),
                'max_participants' => 30,
                'requirements' => 'لا توجد متطلبات مسبقة',
                'is_active' => true
            ],
            [
                'title' => 'تطوير تطبيقات الويب باستخدام React',
                'description' => 'ورشة متقدمة لتعلم تطوير تطبيقات الويب التفاعلية باستخدام React',
                'instructor' => 'م. سارة أحمد',
                'start_time' => Carbon::now()->addDays(10)->setTime(9, 0),
                'end_time' => Carbon::now()->addDays(10)->setTime(17, 0),
                'max_participants' => 25,
                'requirements' => 'معرفة أساسية بـ HTML, CSS, JavaScript',
                'is_active' => true
            ],
            [
                'title' => 'أمن المعلومات والحماية السيبرانية',
                'description' => 'ورشة متخصصة في أمن المعلومات والحماية من التهديدات السيبرانية',
                'instructor' => 'د. خالد العلي',
                'start_time' => Carbon::now()->addDays(14)->setTime(8, 0),
                'end_time' => Carbon::now()->addDays(14)->setTime(16, 0),
                'max_participants' => 20,
                'requirements' => 'خلفية تقنية أساسية',
                'is_active' => true
            ],
            [
                'title' => 'الذكاء الاصطناعي وتعلم الآلة',
                'description' => 'ورشة متقدمة في الذكاء الاصطناعي وتطبيقات تعلم الآلة',
                'instructor' => 'د. فاطمة السعيد',
                'start_time' => Carbon::now()->addDays(21)->setTime(9, 0),
                'end_time' => Carbon::now()->addDays(21)->setTime(15, 0),
                'max_participants' => 15,
                'requirements' => 'معرفة بـ Python والرياضيات الأساسية',
                'is_active' => true
            ]
        ];

        foreach ($workshops as $workshop) {
            Workshop::create($workshop);
        }
    }
}