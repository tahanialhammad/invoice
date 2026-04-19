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
                
            // New Financial Stats
            'total_revenue_this_year' => $user->invoices()
                ->where('status', 'paid')
                ->whereYear('issue_date', now()->year)
                ->sum('total'),
                
            'pending_total_amount' => $user->invoices()
                ->where('status', 'pending')
                ->sum('total'),
            'pending_invoices_count' => $user->invoices()
                ->where('status', 'pending')
                ->count(),
                
            'overdue_total_amount' => $user->invoices()
                ->where('status', 'overdue')
                ->sum('total'),
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
    Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'pdf'])->name('invoices.pdf');
    Route::post('invoices/{invoice}/send', [\App\Http\Controllers\InvoiceController::class, 'send'])->name('invoices.send');
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
});

require __DIR__.'/settings.php';
