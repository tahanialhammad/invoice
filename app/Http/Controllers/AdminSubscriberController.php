<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class AdminSubscriberController extends Controller
{
    /**
     * Display all registered (non-admin) users with their subscription info.
     */
    public function index()
    {
        if (!auth()->user()->is_admin) {
            abort(403);
        }

        $subscribers = User::where('is_admin', false)
            ->with([
                'subscriptions' => fn ($q) => $q
                    ->where('status', 'active')
                    ->where(fn ($q2) => $q2
                        ->whereNull('ends_at')
                        ->orWhere('ends_at', '>', now())
                    )
                    ->with('plan')
                    ->latest()
            ])
            ->withCount('clients', 'invoices')
            ->latest()
            ->get()
            ->map(function (User $user) {
                $activeSub = $user->subscriptions->first();
                return [
                    'id'            => $user->id,
                    'name'          => $user->name,
                    'email'         => $user->email,
                    'created_at'    => $user->created_at->toDateString(),
                    'clients_count' => $user->clients_count,
                    'invoices_count'=> $user->invoices_count,
                    'plan'          => $activeSub?->plan?->name ?? 'Free / Basic',
                    'plan_slug'     => $activeSub?->plan?->slug ?? 'basic',
                    'subscription_status' => $activeSub?->status ?? 'none',
                    'subscription_ends_at'=> $activeSub?->ends_at?->toDateString(),
                ];
            });

        return Inertia::render('admin/subscribers/index', [
            'subscribers' => $subscribers,
        ]);
    }
}
