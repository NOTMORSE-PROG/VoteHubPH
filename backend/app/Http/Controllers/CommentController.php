<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Get comments for a post
     */
    public function index(Request $request, $postId)
    {
        $userId = $request->get('authenticated_user_id') ?? $this->getUserIdFromSession($request);

        // Get only top-level comments (no parent)
        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user:id,name', 'replies.user:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all comment IDs to check likes in one query (avoid N+1)
        $allCommentIds = $comments->pluck('id')->merge(
            $comments->flatMap(function ($comment) {
                return $comment->replies->pluck('id');
            })
        )->unique()->toArray();

        $userLikedCommentIds = $userId ? CommentLike::whereIn('comment_id', $allCommentIds)
            ->where('user_id', $userId)
            ->pluck('comment_id')
            ->toArray() : [];

        $formattedComments = $comments->map(function ($comment) use ($userId, $userLikedCommentIds) {
            return $this->formatCommentOptimized($comment, $userId, $userLikedCommentIds);
            });

        return response()->json($formattedComments);
    }

    protected function formatComment($comment, $userId)
    {
        $replies = [];
        if ($comment->relationLoaded('replies')) {
            $replies = $comment->replies->map(function ($reply) use ($userId) {
                return $this->formatComment($reply, $userId);
            })->toArray();
        }

        if (($comment->moderation_status ?? 'visible') === 'removed') {
            return [
                'id' => $comment->id,
                'post_id' => $comment->post_id,
                'parent_id' => $comment->parent_id,
                'removed' => true,
                'removal_reason' => $comment->removal_reason,
                'content' => null,
                'user_id' => null,
                'user_name' => null,
                'is_anonymous' => null,
                'likes_count' => 0,
                'created_at' => $comment->created_at,
                'user_has_liked' => false,
                'replies' => $replies,
            ];
        }

        return [
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'parent_id' => $comment->parent_id,
            'removed' => false,
            'user_id' => $comment->user_id,
            'user_name' => $comment->is_anonymous ? 'Anonymous' : $comment->user->name,
            'content' => $comment->content,
            'is_anonymous' => $comment->is_anonymous,
            'likes_count' => $comment->likes_count,
            'created_at' => $comment->created_at,
            'user_has_liked' => $userId ? CommentLike::where('comment_id', $comment->id)
                ->where('user_id', $userId)
                ->exists() : false,
            'replies' => $replies,
        ];
    }

    protected function formatCommentOptimized($comment, $userId, $userLikedCommentIds = [])
    {
        $replies = [];
        if ($comment->relationLoaded('replies')) {
            $replies = $comment->replies->map(function ($reply) use ($userId, $userLikedCommentIds) {
                return $this->formatCommentOptimized($reply, $userId, $userLikedCommentIds);
            })->toArray();
        }

        if (($comment->moderation_status ?? 'visible') === 'removed') {
            return [
                'id' => $comment->id,
                'post_id' => $comment->post_id,
                'parent_id' => $comment->parent_id,
                'removed' => true,
                'removal_reason' => $comment->removal_reason,
                'content' => null,
                'user_id' => null,
                'user_name' => null,
                'is_anonymous' => null,
                'likes_count' => 0,
                'created_at' => $comment->created_at,
                'user_has_liked' => false,
                'replies' => $replies,
            ];
        }

        return [
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'parent_id' => $comment->parent_id,
            'removed' => false,
            'user_id' => $comment->user_id,
            'user_name' => $comment->is_anonymous ? 'Anonymous' : $comment->user->name,
            'content' => $comment->content,
            'is_anonymous' => $comment->is_anonymous,
            'likes_count' => $comment->likes_count,
            'created_at' => $comment->created_at,
            'user_has_liked' => in_array($comment->id, $userLikedCommentIds),
            'replies' => $replies,
        ];
    }

    /**
     * Create a new comment
     */
    public function store(Request $request, $postId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'is_anonymous' => 'boolean',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $userId = $request->get('authenticated_user_id');

        // Check if post exists and is approved
        $post = Post::where('id', $postId)
            ->where('status', 'approved')
            ->firstOrFail();

        // If parent_id is provided, verify it belongs to the same post
        if (isset($validated['parent_id'])) {
            $parentComment = Comment::where('id', $validated['parent_id'])
                ->where('post_id', $postId)
                ->firstOrFail();
        }

        $comment = Comment::create([
            'post_id' => $postId,
            'parent_id' => $validated['parent_id'] ?? null,
            'user_id' => $userId,
            'content' => $validated['content'],
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'likes_count' => 0,
        ]);

        $comment->load('user:id,name');

        // Create notification for post owner (only for top-level comments, not replies)

        return response()->json([
            'message' => 'Comment posted successfully',
            'comment' => [
                'id' => $comment->id,
                'post_id' => $comment->post_id,
                'parent_id' => $comment->parent_id,
                'user_id' => $comment->user_id,
                'user_name' => $comment->is_anonymous ? 'Anonymous' : $comment->user->name,
                'content' => $comment->content,
                'is_anonymous' => $comment->is_anonymous,
                'likes_count' => $comment->likes_count,
                'created_at' => $comment->created_at,
                'user_has_liked' => false,
                'replies' => [],
            ],
        ], 201);
    }

    /**
     * Toggle like on a comment
     */
    public function toggleLike(Request $request, $commentId)
    {
        $userId = $request->get('authenticated_user_id');

        $comment = Comment::findOrFail($commentId);

        $existingLike = CommentLike::where('comment_id', $commentId)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $comment->decrement('likes_count');

            return response()->json([
                'message' => 'Like removed',
                'liked' => false,
                'likes_count' => $comment->fresh()->likes_count,
            ]);
        } else {
            // Like
            CommentLike::create([
                'comment_id' => $commentId,
                'user_id' => $userId,
            ]);
            $comment->increment('likes_count');

            return response()->json([
                'message' => 'Comment liked',
                'liked' => true,
                'likes_count' => $comment->fresh()->likes_count,
            ]);
        }
    }

    /**
     * Moderate a comment — remove or restore (admin only)
     */
    public function moderate(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|string|in:remove,restore',
            'reason' => 'nullable|string|max:255',
        ]);

        $comment = Comment::findOrFail($id);

        if ($validated['action'] === 'remove') {
            $comment->update([
                'moderation_status' => 'removed',
                'removal_reason' => $validated['reason'] ?? null,
            ]);
            return response()->json(['message' => 'Comment removed.', 'comment' => $comment]);
        }

        $comment->update([
            'moderation_status' => 'visible',
            'removal_reason' => null,
        ]);
        return response()->json(['message' => 'Comment restored.', 'comment' => $comment]);
    }

    /**
     * Get non-visible comments for admin review (admin only)
     */
    public function getFlagged()
    {
        $comments = Comment::where('moderation_status', '!=', 'visible')
            ->with(['user:id,name', 'post:id,name'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($comment) {
                return [
                    'id'                => $comment->id,
                    'post_id'           => $comment->post_id,
                    'post_name'         => $comment->post ? $comment->post->name : '[deleted]',
                    'user_name'         => $comment->is_anonymous ? 'Anonymous' : ($comment->user ? $comment->user->name : 'Unknown'),
                    'content'           => $comment->content,
                    'moderation_status' => $comment->moderation_status,
                    'removal_reason'    => $comment->removal_reason,
                    'created_at'        => $comment->created_at,
                    'updated_at'        => $comment->updated_at,
                ];
            });

        return response()->json($comments);
    }

    /**
     * Optionally get user ID from session (for public routes)
     */
    private function getUserIdFromSession($request)
    {
        try {
            $cookies = $request->cookies->all();
            $sessionToken = $cookies['next-auth.session-token']
                         ?? $cookies['__Secure-next-auth.session-token']
                         ?? $cookies['next-auth_session-token']
                         ?? $cookies['__Host-next-auth.session-token']
                         ?? null;

            if (!$sessionToken) {
                return null;
            }

            $session = \DB::table('Session')
                ->where('sessionToken', $sessionToken)
                ->where('expires', '>', now())
                ->first();

            return $session ? $session->userId : null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
