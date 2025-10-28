<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is a regular user
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if user is a scanner
     */
    public function isScanner(): bool
    {
        return $this->role === 'scanner';
    }

    /**
     * Get user's hackathon registrations
     */
    public function hackathonRegistrations()
    {
        return $this->hasMany(HackathonRegistration::class);
    }

    /**
     * Get user's workshop registrations
     */
    public function workshopRegistrations()
    {
        return $this->hasMany(WorkshopRegistration::class);
    }

    /**
     * Get user's conference registrations
     */
    public function conferenceRegistrations()
    {
        return $this->hasMany(ConferenceRegistration::class);
    }
}
