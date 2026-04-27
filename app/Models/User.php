<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'is_admin', 'company_name', 'company_address', 'company_email', 'company_phone', 'company_vat_number', 'company_logo_url'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

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
            'is_admin' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function plan()
    {
        $subscription = $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>', now());
            })
            ->latest()
            ->first();

        return $subscription ? $subscription->plan : Plan::where('slug', 'basic')->first();
    }

    public function hasFeature($feature)
    {
        if ($this->is_admin) return true;
        
        $plan = $this->plan();
        if (!$plan) return false;

        return $plan->hasFeature($feature);
    }

    public function canAddClient(): bool
    {
        if ($this->is_admin) {
            return true;
        }

        $plan = $this->plan();
        if (!$plan) {
            return false;
        }

        // Search the plan's JSON features array for the limit string
        $features = collect($plan->features ?? []);
        $limitFeature = $features->first(fn($feature) => str_starts_with($feature, 'max_') && str_ends_with($feature, '_clients'));

        if (!$limitFeature) {
            return false; // Safely deny if limit feature is missing
        }

        // Extract the numeric limit or 'unlimited' keyword
        if (preg_match('/max_(\d+|unlimited)_clients/', $limitFeature, $matches)) {
            $limitValue = $matches[1];

            if ($limitValue === 'unlimited') {
                return true;
            }

            return $this->clients()->count() < (int) $limitValue;
        }

        return false;
    }
}
