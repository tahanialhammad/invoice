<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('clients', \App\Http\Controllers\ClientController::class);
    Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceController::class, 'pdf'])->name('invoices.pdf');
    Route::post('invoices/{invoice}/send', [\App\Http\Controllers\InvoiceController::class, 'send'])->name('invoices.send');
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);

    Route::get('plans', [\App\Http\Controllers\PlanController::class, 'index'])->name('plans.index');
    Route::post('subscriptions', [\App\Http\Controllers\SubscriptionController::class, 'store'])->name('subscriptions.store');
    Route::delete('subscriptions', [\App\Http\Controllers\SubscriptionController::class, 'destroy'])->name('subscriptions.destroy');
});

require __DIR__.'/settings.php';
