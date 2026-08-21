<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Submit a new report (authenticated user)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reportable_type' => 'required|string|in:post,comment',
            'reportable_id'   => 'required|integer',
            'reason'          => 'required|string|in:Misinformation,Offensive,Spam,Impersonation,Other',
            'description'     => 'nullable|string|max:500',
        ]);

        $reporterId = $request->get('authenticated_user_id');

        // Prevent duplicate active reports from the same user on the same item
        $existing = Report::where('reporter_id', $reporterId)
            ->where('reportable_type', $validated['reportable_type'])
            ->where('reportable_id', $validated['reportable_id'])
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already submitted a report for this content.',
            ], 409);
        }

        Report::create([
            'reporter_id'     => $reporterId,
            'reportable_type' => $validated['reportable_type'],
            'reportable_id'   => $validated['reportable_id'],
            'reason'          => $validated['reason'],
            'description'     => $validated['description'] ?? null,
            'status'          => 'pending',
        ]);

        return response()->json([
            'message' => 'Report submitted. Thank you for helping keep the platform safe.',
        ], 201);
    }

    /**
     * Get all reports (admin only)
     */
    public function index(Request $request)
    {
        $reports = Report::with('reporter:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($report) {
                // Get reported content
                $excerpt = null;
                $fullContent = null;
                if ($report->reportable_type === 'post') {
                    $post = \App\Models\Post::find($report->reportable_id);
                    $excerpt = $post ? $post->name : '[deleted]';
                    $fullContent = $post ? $post->name : '[deleted]';
                } elseif ($report->reportable_type === 'comment') {
                    $comment = \App\Models\Comment::find($report->reportable_id);
                    $fullContent = $comment ? ($comment->content ?? '[content removed]') : '[deleted]';
                    $excerpt = $comment ? mb_substr($fullContent, 0, 80) : '[deleted]';
                }

                return [
                    'id'              => $report->id,
                    'reportable_type' => $report->reportable_type,
                    'reportable_id'   => $report->reportable_id,
                    'excerpt'         => $excerpt,
                    'full_content'    => $fullContent,
                    'reason'          => $report->reason,
                    'description'     => $report->description,
                    'status'          => $report->status,
                    'reporter_name'   => $report->reporter ? $report->reporter->name : 'Unknown',
                    'created_at'      => $report->created_at,
                ];
            });

        return response()->json($reports);
    }

    /**
     * Update report status (admin only)
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:reviewed,dismissed',
        ]);

        $report = Report::findOrFail($id);
        $report->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Report updated.',
            'report'  => $report,
        ]);
    }
}
