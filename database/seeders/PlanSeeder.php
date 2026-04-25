<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Plan::updateOrCreate(['slug' => 'basic'], [
            'name' => 'Basic',
            'price' => 0.00,
            'description' => 'Perfect for individuals getting started. Create one-time invoices only.',
            'can_create_recurring_invoices' => false,
        ]);

        \App\Models\Plan::updateOrCreate(['slug' => 'business'], [
            'name' => 'Business',
            'price' => 19.00,
            'description' => 'For growing businesses. Includes recurring invoices.',
            'can_create_recurring_invoices' => true,
        ]);

        \App\Models\Plan::updateOrCreate(['slug' => 'premium'], [
            'name' => 'Premium',
            'price' => 49.00,
            'description' => 'All features with priority support.',
            'can_create_recurring_invoices' => true,
        ]);
    }
}
