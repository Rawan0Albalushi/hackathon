<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HackathonRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'age',
        'city',
        'background',
        'skills',
        'other_skills',
        'status',
        'rejection_reason',
        'qr_code',
        'is_checked_in',
        'checked_in_at'
    ];

    protected $casts = [
        'skills' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
