<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;
use App\Jobs\SendWeeklyInvoiceReminders;

Schedule::job(new SendWeeklyInvoiceReminders)->weekly();
Schedule::command('invoices:check-overdue')->daily();
