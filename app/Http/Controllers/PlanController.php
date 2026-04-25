<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Plan;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index()
    {
        return Inertia::render('plans/index', [
            'plans' => Plan::all(),
            'currentPlan' => auth()->user()->plan()
        ]);
    }
}
