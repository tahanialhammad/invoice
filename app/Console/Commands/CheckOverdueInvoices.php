<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckOverdueInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan pending and sent invoices and mark them as overdue if the due date has passed.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        $updatedCount = Invoice::whereIn('status', ['pending', 'sent', 'draft'])
            ->where('due_date', '<', $today)
            ->update(['status' => 'overdue']);

        $this->info("Successfully marked {$updatedCount} invoices as overdue.");
    }
}
