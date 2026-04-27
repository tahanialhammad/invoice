<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessPlanSwitches extends Command
{
    protected $signature = 'app:process-plan-switches';
    protected $description = 'Process delayed subscription downgrades at the end of billing cycles';

    public function handle()
    {
        $this->info("Checking for pending plan downgrades...");

        $today = now()->startOfDay();

        // Find subscriptions that have a pending downgrade and the cycle has ended
        $subscriptions = Subscription::with('pendingPlan')
            ->whereNotNull('pending_plan_id')
            ->whereDate('billing_cycle_ends_at', '<=', $today)
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info("No pending downgrades to process.");
            return;
        }

        foreach ($subscriptions as $sub) {
            $newPlan = $sub->pendingPlan;

            if (!$newPlan) {
                // Failsafe
                $sub->update(['pending_plan_id' => null]);
                continue;
            }

            try {
                // Update to the new plan, clear pending, set next cycle end
                $sub->update([
                    'plan_id' => $newPlan->id,
                    'pending_plan_id' => null,
                    'billing_cycle_ends_at' => $today->copy()->addMonth(),
                ]);

                $this->info("User {$sub->user_id} downgraded to {$newPlan->name} plan.");

                // If downgraded to Basic, stop recurring invoices since Basic doesn't support it
                if (strtolower($newPlan->slug) === 'basic') {
                    $recurringUpdatedCount = Invoice::where('user_id', $sub->user_id)
                        ->where('is_recurring', true)
                        ->update(['is_recurring' => false]);
                        
                    if ($recurringUpdatedCount > 0) {
                        $this->info("  -> Disabled {$recurringUpdatedCount} recurring invoices for user {$sub->user_id}.");
                        Log::info("ProcessPlanSwitches: Disabled {$recurringUpdatedCount} recurring invoices for user {$sub->user_id} upon downgrade to Basic.");
                    }
                }

                Log::info("ProcessPlanSwitches: Successfully downgraded user {$sub->user_id} to {$newPlan->name}.");

            } catch (\Exception $e) {
                $this->error("Failed to process downgrade for user {$sub->user_id}: " . $e->getMessage());
                Log::error("ProcessPlanSwitches failed for user {$sub->user_id}: " . $e->getMessage());
            }
        }

        $this->info("Done processing " . $subscriptions->count() . " downgrade(s).");
    }
}
