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
        'features', // JSON column
        'stripe_price_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array', // Automatically cast JSON to PHP array
    ];

    /**
     * Check if the plan has a specific feature.
     *
     * @param string $feature
     * @return bool
     */
    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features ?? []);
    }
}
