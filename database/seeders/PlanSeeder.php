<?php

namespace Database\Seeders;

use App\Models\Feature;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Features
        $features = [
            ['name' => 'Monthly Invoices', 'code' => 'invoice_limit', 'type' => 'limit'],
            ['name' => 'Client Management', 'code' => 'client_limit', 'type' => 'limit'],
            ['name' => 'Recurring Invoices', 'code' => 'create_recurring_invoices', 'type' => 'boolean'],
            ['name' => 'Advanced Reports', 'code' => 'advanced_reports', 'type' => 'boolean'],
            ['name' => 'Team Management', 'code' => 'team_management', 'type' => 'boolean'],
        ];

        foreach ($features as $f) {
            Feature::updateOrCreate(['code' => $f['code']], $f);
        }

        // 2. Create Plans
        
        // Basic Plan
        $basic = Plan::updateOrCreate(['slug' => 'basic'], [
            'name' => 'Basic',
            'price' => 0.00,
            'description' => 'Perfect for individuals getting started.',
        ]);
        $basic->features()->sync([
            Feature::where('code', 'invoice_limit')->first()->id => ['value' => '5'],
            Feature::where('code', 'client_limit')->first()->id => ['value' => '5'],
            Feature::where('code', 'create_recurring_invoices')->first()->id => ['value' => 'false'],
        ]);

        // Business Plan
        $business = Plan::updateOrCreate(['slug' => 'business'], [
            'name' => 'Business',
            'price' => 19.00,
            'description' => 'For growing businesses. Includes recurring invoices.',
        ]);
        $business->features()->sync([
            Feature::where('code', 'invoice_limit')->first()->id => ['value' => 'unlimited'],
            Feature::where('code', 'client_limit')->first()->id => ['value' => '30'],
            Feature::where('code', 'create_recurring_invoices')->first()->id => ['value' => 'true'],
        ]);

        // Premium Plan
        $premium = Plan::updateOrCreate(['slug' => 'premium'], [
            'name' => 'Premium',
            'price' => 49.00,
            'description' => 'Full access for large agencies.',
        ]);
        $premium->features()->sync([
            Feature::where('code', 'invoice_limit')->first()->id => ['value' => 'unlimited'],
            Feature::where('code', 'client_limit')->first()->id => ['value' => 'unlimited'],
            Feature::where('code', 'create_recurring_invoices')->first()->id => ['value' => 'true'],
            Feature::where('code', 'advanced_reports')->first()->id => ['value' => 'true'],
            Feature::where('code', 'team_management')->first()->id => ['value' => 'true'],
        ]);
    }
}
