<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::updateOrCreate(['slug' => 'basic'], [
            'name' => 'Basic',
            'price' => 0.00,
            'description' => 'Perfect for individuals getting started.',
            'features' => [
                'max_5_clients',
                'create_one_time_invoices',
            ],
        ]);

        Plan::updateOrCreate(['slug' => 'business'], [
            'name' => 'Business',
            'price' => 19.00,
            'description' => 'For growing businesses. Includes recurring invoices.',
            'features' => [
                'max_30_clients',
                'create_one_time_invoices',
                'create_recurring_invoices',
            ],
        ]);

        Plan::updateOrCreate(['slug' => 'premium'], [
            'name' => 'Premium',
            'price' => 49.00,
            'description' => 'Full access for large agencies.',
            'features' => [
                'max_unlimited_clients',
                'create_one_time_invoices',
                'create_recurring_invoices',
                'advanced_reports',
                'team_management',
            ],
        ]);
    }
}
