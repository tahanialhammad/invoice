<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('plans/index', [
            'plans' => Plan::with('features')->get(),
        ]);
    }

    /**
     * Display management interface for admins.
     */
    public function manage()
    {
        Gate::authorize('admin-access');

        $chartData = Plan::all()->map(function ($plan) {
            return [
                'name' => $plan->name,
                'subscribers' => \App\Models\Subscription::where('plan_id', $plan->id)
                    ->where('status', 'active')
                    ->count()
            ];
        });

        return Inertia::render('admin/plans/index', [
            'plans' => Plan::with('features')->get(),
            'features' => Feature::all(),
            'chartData' => $chartData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plan $plan)
    {
        Gate::authorize('admin-access');

        return Inertia::render('admin/plans/edit', [
            'plan' => $plan->load('features'),
            'allFeatures' => Feature::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Plan $plan)
    {
        Gate::authorize('admin-access');

        try {
            $validated = $request->validate([
                'price' => 'required|numeric|min:0',
                'description' => 'nullable|string|max:500',
                'features' => 'required|array',
            ]);

            \Illuminate\Support\Facades\Log::info('Updating plan features (Final Refactor)', [
                'plan_id' => $plan->id,
                'data' => $validated['features']
            ]);

            $plan->update([
                'price' => $validated['price'],
                'description' => $validated['description'],
            ]);

            // Transform keyed features into sync format
            $syncData = [];
            foreach ($validated['features'] as $id => $data) {
                if (isset($data['enabled']) && $data['enabled']) {
                    $syncData[$id] = ['value' => $data['value'] ?? 'true'];
                }
            }

            $plan->features()->sync($syncData);

            Inertia::flash('toast', ['type' => 'success', 'message' => "Plan '{$plan->name}' updated successfully."]);

            return Redirect::route('admin.plans.manage');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to update plan', [
                'error' => $e->getMessage(),
                'plan_id' => $plan->id,
                'stack' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'An error occurred while updating the plan: ' . $e->getMessage()]);
        }
    }

    /**
     * Store a new feature in storage.
     */
    public function storeFeature(Request $request)
    {
        Gate::authorize('admin-access');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:boolean,limit',
            'description' => 'nullable|string'
        ]);

        $validated['code'] = \Illuminate\Support\Str::slug($validated['name']);

        Feature::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => "Feature '{$validated['name']}' created successfully."]);

        return Redirect::route('admin.plans.manage');
    }
}
