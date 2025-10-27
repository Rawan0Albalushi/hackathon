<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'workshop_id',
        'full_name',
        'email',
        'phone',
        'background',
        'reason',
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

    public function workshop()
    {
        return $this->belongsTo(Workshop::class);
    }
}
