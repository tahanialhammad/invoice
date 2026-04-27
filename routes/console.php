<?php

use App\Jobs\SendWeeklyInvoiceReminders;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ✅ Run daily to keep invoice statuses accurate
Schedule::command('invoices:check-overdue')->daily();

// ✅ Run daily to generate recurring invoices
Schedule::command('invoices:generate-recurring')->daily();

// ✅ Run daily to generate subscription billing invoices (filters by anniversary day internally)
Schedule::command('subscriptions:generate-invoices')->daily()->at('00:05');

// ✅ Run daily to process pending subscription downgrades
Schedule::command('app:process-plan-switches')->daily()->at('00:10');

// ✅ Run synchronously every Monday 8am — no queue worker required
Schedule::call(function () {
    (new SendWeeklyInvoiceReminders())->handle();
})->weeklyOn(1, '08:00')->name('weekly-invoice-reminders');
