<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    /**
     * Display a listing of plans for users.
     */
    public function index()
    {
        $user = auth()->user();
        $activeSub = $user->subscriptions()->where('status', 'active')->latest('starts_at')->first();

        return Inertia::render('plans/index', [
            'plans' => Plan::all(),
            'currentPlan' => $user->plan(),
            'activeSubscription' => $activeSub ? [
                'pending_plan_id' => $activeSub->pending_plan_id,
                'billing_cycle_ends_at' => $activeSub->billing_cycle_ends_at?->format('M d, Y'),
            ] : null,
        ]);
    }

    /**
     * Display the admin management interface.
     */
    public function manage()
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        return Inertia::render('admin/plans/index', [
            'plans' => Plan::all()
        ]);
    }

    /**
     * Show the form for editing the specified plan.
     */
    public function edit(Plan $plan)
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        return Inertia::render('admin/plans/edit', [
            'plan' => $plan
        ]);
    }

    /**
     * Update the specified plan.
     */
    public function update(Request $request, Plan $plan)
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        $validated = $request->validate([
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:500',
            'features' => 'required|array',
            'features.*' => 'required|string|max:100',
        ]);

        $plan->update($validated);

        return redirect()->route('admin.plans.manage')->with('success', "Plan '{$plan->name}' updated successfully.");
    }
}
