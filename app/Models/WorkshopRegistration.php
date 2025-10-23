<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopRegistration extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'background',
        'reason'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
