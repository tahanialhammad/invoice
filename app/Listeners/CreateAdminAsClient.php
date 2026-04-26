<?php

namespace App\Listeners;

use App\Models\Client;
use App\Models\User;
use Illuminate\Auth\Events\Registered;

class CreateAdminAsClient
{
    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        // Skip if the user being registered is an admin
        if ($user->is_admin) {
            return;
        }

        // Get the admin user
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            return;
        }

        // Create the admin as a client for THIS user
        // We use firstOrCreate to prevent "duple client" (duplicate records)
        // if the registration event is triggered multiple times.
        Client::firstOrCreate(
            [
                'user_id' => $admin->id,
                'email' => $user->email,
            ],
            [
                'client_name' => $user->name,
                'business_name' => $user->company_name ?? $user->name,
                'address' => $user->company_address ?? 'User Address',
                'vat_number' => $user->company_vat_number,
            ]
        );
    }
}
