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

// ✅ Run synchronously every Monday 8am — no queue worker required
Schedule::call(function () {
    (new SendWeeklyInvoiceReminders())->handle();
})->weeklyOn(1, '08:00')->name('weekly-invoice-reminders');
