<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        $stats = [
            'total_paid_invoices' => $user->invoices()->where('status', 'paid')->count(),
            'total_paid_invoices_this_year' => $user->invoices()
                ->where('status', 'paid')
                ->whereYear('issue_date', now()->year)
                ->count(),
        ];

        if ($user->is_admin) {
            $stats = array_merge($stats, [
                'totalUsers' => \App\Models\User::count(),
                'adminUsers' => \App\Models\User::where('is_admin', true)->count(),
                'regularUsers' => \App\Models\User::where('is_admin', false)->count(),
            ]);
        }

        return inertia('dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');

    Route::resource('clients', \App\Http\Controllers\ClientController::class);
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
});

require __DIR__.'/settings.php';
