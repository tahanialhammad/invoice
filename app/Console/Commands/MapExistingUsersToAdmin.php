<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\User;
use Illuminate\Console\Command;

class MapExistingUsersToAdmin extends Command
{
    protected $signature = 'users:map-to-admin';
    protected $description = 'Add all existing non-admin users as clients to the admin account';

    public function handle()
    {
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->error("No admin user found.");
            return;
        }

        $users = User::where('is_admin', false)->get();
        $count = 0;

        foreach ($users as $user) {
            // Check if user is already a client of admin
            $exists = Client::where('user_id', $admin->id)
                ->where('email', $user->email)
                ->exists();

            if (!$exists) {
                Client::create([
                    'user_id' => $admin->id,
                    'client_name' => $user->name,
                    'business_name' => $user->company_name ?? $user->name,
                    'email' => $user->email,
                    'address' => $user->company_address ?? 'User Address',
                    'vat_number' => $user->company_vat_number,
                ]);
                $count++;
            }
        }

        $this->info("Successfully mapped {$count} users to admin.");
    }
}
