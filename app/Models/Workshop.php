<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workshop extends Model
{
    protected $fillable = [
        'title',
        'description',
        'instructor',
        'start_time',
        'end_time',
        'max_participants',
        'requirements',
        'is_active'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function registrations()
    {
        return $this->hasMany(WorkshopRegistration::class);
    }
}
