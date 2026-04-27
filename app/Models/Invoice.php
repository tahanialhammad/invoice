<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'invoice_number',
        'subtotal',
        'tax_total',
        'total_amount',
        'total',
        'status',
        'issue_date',
        'due_date',
        'is_recurring',
        'recurring_interval',
        'next_recurring_date',
        'is_subscription_invoice',
        'billing_period_start',
        'billing_period_end',
    ];

    protected $casts = [
        'subtotal'              => 'decimal:2',
        'tax_total'             => 'decimal:2',
        'total_amount'          => 'decimal:2',
        'total'                 => 'decimal:2',
        'is_recurring'          => 'boolean',
        'is_subscription_invoice' => 'boolean',
        'next_recurring_date'   => 'date',
        'billing_period_start'  => 'date',
        'billing_period_end'    => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('invoice_number', 'like', '%' . $search . '%')
                      ->orWhereHas('client', function ($query) use ($search) {
                          $query->where('client_name', 'like', '%' . $search . '%')
                                ->orWhere('business_name', 'like', '%' . $search . '%');
                      });
            });
        })->when($filters['status'] ?? null, function ($query, $status) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        })->when($filters['client_id'] ?? null, function ($query, $client_id) {
            if ($client_id !== 'all') {
                $query->where('client_id', $client_id);
            }
        });
    }
}
