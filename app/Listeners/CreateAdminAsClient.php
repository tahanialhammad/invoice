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
        // This allows the user to see the admin in their client list if needed
        // But more importantly, it establishes the link where the admin can invoice the user.
        // Actually, the requirement says: "Every registered user automatically becomes a client of the admin"
        
        Client::create([
            'user_id' => $admin->id, // Owned by admin
            'client_name' => $user->name,
            'business_name' => $user->company_name ?? $user->name,
            'email' => $user->email,
            'address' => $user->company_address ?? 'User Address',
            'vat_number' => $user->company_vat_number,
        ]);
    }
}
