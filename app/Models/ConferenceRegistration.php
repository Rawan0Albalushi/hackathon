<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConferenceRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'organization',
        'session_choice',
        'status',
        'rejection_reason',
        'qr_code',
        'is_checked_in',
        'checked_in_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
