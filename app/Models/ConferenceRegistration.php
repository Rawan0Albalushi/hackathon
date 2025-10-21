<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConferenceRegistration extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'organization',
        'session_choice'
    ];
}
