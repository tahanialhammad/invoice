<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPlanFeature
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        if (!auth()->user()->hasFeature($feature)) {
            if ($request->wantsJson() || $request->inertia()) {
                abort(403, 'Your current plan does not support this feature.');
            }
            return redirect()->route('plans.index')->with('error', 'Please upgrade your plan to access this feature.');
        }

        return $next($request);
    }
}
