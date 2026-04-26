<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Automatically check and update overdue statuses for the current user
        \Illuminate\Support\Facades\Artisan::call('invoices:check-overdue');

        $user = auth()->user();
        
        // Basic Stats
        $stats = [
            'total_paid_invoices' => $user->invoices()->where('status', 'paid')->count(),
            'total_revenue_this_year' => (float) $user->invoices()
                ->where('status', 'paid')
                ->whereYear('issue_date', now()->year)
                ->sum('total'),
            'pending_total_amount' => (float) $user->invoices()
                ->where('status', 'pending')
                ->sum('total'),
            'overdue_total_amount' => (float) $user->invoices()
                ->where('status', 'overdue')
                ->sum('total'),
        ];

        if ($user->is_admin) {
            $stats = array_merge($stats, [
                'totalUsers' => User::count(),
                'adminUsers' => User::where('is_admin', true)->count(),
            ]);
        }

        // 1. Monthly Revenue (Last 12 Months)
        $monthlyRevenue = $user->invoices()
            ->where('status', 'paid')
            ->where('issue_date', '>=', now()->subMonths(11)->startOfMonth())
            ->select(
                DB::raw("DATE_FORMAT(issue_date, '%Y-%m') as month"),
                DB::raw('SUM(total) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');
            $label = now()->subMonths($i)->format('M');
            
            $match = $monthlyRevenue->firstWhere('month', $month);
            $monthlyData[] = [
                'label' => $label,
                'total' => $match ? (float) $match->total : 0
            ];
        }

        // 2. Status Distribution
        $statusDistribution = $user->invoices()
            ->select('status', DB::raw('count(*) as count'), DB::raw('SUM(total) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => ['count' => $item->count, 'total' => (float) $item->total]];
            });

        // 3. Top 5 Clients
        $topClients = $user->clients()
            ->withSum(['invoices' => function($query) {
                $query->where('status', 'paid');
            }], 'total')
            ->orderByDesc('invoices_sum_total')
            ->take(5)
            ->get()
            ->map(function($client) {
                return [
                    'name' => $client->client_name,
                    'revenue' => (float) ($client->invoices_sum_total ?? 0)
                ];
            });

        return Inertia::render('Dashboard/index', [
            'stats' => $stats,
            'charts' => [
                'monthlyRevenue' => $monthlyData,
                'statusDistribution' => $statusDistribution,
                'topClients' => $topClients,
            ]
        ]);
    }
}
