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

    /** @var \App\Models\Plan|null In-memory cache for the active plan to avoid repeat queries. */
    protected ?Plan $cachedPlan = null;

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

    public function plan(): ?Plan
    {
        if ($this->cachedPlan !== null) {
            return $this->cachedPlan;
        }

        $subscription = $this->subscriptions()
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('ends_at')
                      ->orWhere('ends_at', '>', now());
            })
            ->latest()
            ->first();

        $this->cachedPlan = $subscription
            ? $subscription->plan->load('features')
            : Plan::where('slug', 'basic')->with('features')->first();

        return $this->cachedPlan;
    }

    public function getFeatureValue(string $featureCode)
    {
        if ($this->is_admin) {
            return 'unlimited';
        }

        $plan = $this->plan();
        if (!$plan) {
            return null;
        }

        // Use the already-loaded features collection (no extra DB query)
        $feature = $plan->features->firstWhere('code', $featureCode);

        return $feature ? $feature->pivot->value : null;
    }

    public function hasFeature(string $featureCode): bool
    {
        if ($this->is_admin) {
            return true;
        }

        $value = $this->getFeatureValue($featureCode);

        if ($value === null || $value === 'false') {
            return false;
        }

        if ($value === 'unlimited' || $value === 'true') {
            return true;
        }

        return (bool) $value;
    }

    public function getFeatureLimit(string $featureCode)
    {
        if ($this->is_admin) {
            return PHP_INT_MAX;
        }

        $value = $this->getFeatureValue($featureCode);

        if ($value === 'unlimited') {
            return PHP_INT_MAX;
        }

        return is_numeric($value) ? (int)$value : 0;
    }

    public function canAddClient(): bool
    {
        return $this->clients()->count() < $this->getFeatureLimit('client_limit');
    }

    public function canAddInvoice(): bool
    {
        // Monthly invoice limit check
        $currentMonthInvoices = $this->invoices()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        return $currentMonthInvoices < $this->getFeatureLimit('invoice_limit');
    }

    public function isProfileComplete(): bool
    {
        return !empty($this->company_name) && 
               !empty($this->company_address) && 
               !empty($this->company_phone);
    }
}
