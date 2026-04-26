<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SubscriptionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Subscription $subscription): bool
    {
        return $user->id === $subscription->user_id || $user->is_admin;
    }

    /**
     * Determine whether the user can create models (subscribe).
     */
    public function create(User $user): bool
    {
        return !$user->is_admin;
    }

    /**
     * Determine whether the user can update the model (upgrade/downgrade).
     */
    public function update(User $user, Subscription $subscription): bool
    {
        return $user->id === $subscription->user_id || $user->is_admin;
    }

    /**
     * Determine whether the user can delete the model (cancel).
     */
    public function delete(User $user, Subscription $subscription): bool
    {
        return $user->id === $subscription->user_id || $user->is_admin;
    }
}
