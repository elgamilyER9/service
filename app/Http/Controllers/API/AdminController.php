<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function stats()
    {
        $totalServices = 0;
        $activeUsers = 0;
        $todayRevenue = 0;
        $pendingBookings = 0;
        $recentActivities = [];

        try {
            $totalServices = Service::count();
        } catch (\Throwable $e) {
            \Log::error('AdminStats Service Error: ' . $e->getMessage());
        }

        try {
            $totalRequests = ServiceRequest::count();
        } catch (\Throwable $e) {
            \Log::error('AdminStats Total Requests Error: ' . $e->getMessage());
        }

        try {
            $activeUsers = User::where('role', '!=', 'admin')->count();
        } catch (\Throwable $e) {
            \Log::error('AdminStats User Error: ' . $e->getMessage());
        }

        try {
            // Count completed and accepted requests to show progress
            $completedRequests = ServiceRequest::whereIn('status', ['completed', 'accepted'])->count();
        } catch (\Throwable $e) {
            \Log::error('AdminStats Completed Requests Error: ' . $e->getMessage());
        }

        try {
            $pendingBookings = ServiceRequest::where('status', 'pending')->count();
        } catch (\Throwable $e) {
            \Log::error('AdminStats Pending Error: ' . $e->getMessage());
        }

        try {
            $recentActivities = ServiceRequest::with(['user', 'service'])
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'user_name' => $request->user ? $request->user->name : 'Unknown User',
                        'service_name' => $request->service ? $request->service->name : 'Unknown Service',
                        'status' => $request->status,
                        'created_at_human' => $request->created_at->diffForHumans(),
                        'created_at' => $request->created_at->toIso8601String(),
                    ];
                });
        } catch (\Throwable $e) {
            \Log::error('AdminStats Activities Error: ' . $e->getMessage());
        }

        return response()->json([
            'total_services' => $totalServices,
            'total_requests' => $totalRequests ?? 0,
            'active_users' => $activeUsers,
            'completed_requests' => $completedRequests,
            'pending_bookings' => $pendingBookings,
            'recent_activities' => $recentActivities
        ]);
    }
}
