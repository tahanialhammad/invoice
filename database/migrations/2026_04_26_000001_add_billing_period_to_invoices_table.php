<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // Track which billing period this invoice covers
            $table->date('billing_period_start')->nullable()->after('is_subscription_invoice');
            $table->date('billing_period_end')->nullable()->after('billing_period_start');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['billing_period_start', 'billing_period_end']);
        });
    }
};
