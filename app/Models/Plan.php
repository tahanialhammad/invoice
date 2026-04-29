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
        'stripe_price_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'decimal:2',
    ];

    /**
     * The features that belong to the plan.
     */
    public function features()
    {
        return $this->belongsToMany(Feature::class)
            ->withPivot('value')
            ->withTimestamps();
    }

    /**
     * Get a specific feature's value for this plan.
     */
    public function getFeatureValue(string $code)
    {
        $feature = $this->features()->where('code', $code)->first();
        return $feature ? $feature->pivot->value : null;
    }
}
