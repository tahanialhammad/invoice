<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'price',
        'description',
        'can_create_recurring_invoices',
        'stripe_price_id',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'can_create_recurring_invoices' => 'boolean',
        ];
    }
}
