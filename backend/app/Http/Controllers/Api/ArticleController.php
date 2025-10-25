<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ArticleController extends Controller
{
    // Можно добавить авторизацию 


    // GET /api/articles
    public function index(): JsonResponse
    {
        try {
            $articles = Article::query()
                ->latest('created_at')
                ->select(['id', 'title', 'content', 'created_at'])
                ->paginate(10);

            $articles->getCollection()->transform(function ($a) {
                $a->excerpt = mb_substr(strip_tags($a->content), 0, 200);
                return $a;
            });

            return response()->json($articles);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch articles'], 500);
        }
    }

    // GET /api/articles/{id}
    public function show($id): JsonResponse
    {
        try {
            $article = Article::with(['comments' => function($q){
                $q->orderBy('created_at', 'asc')->select(['id', 'article_id', 'author_name', 'content', 'created_at']);
            }])->findOrFail($id, ['id', 'title', 'content', 'created_at']);

            return response()->json($article);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Article not found'], 404);
        }
    }

    // POST /api/articles
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'title' => 'required|string|min:3|max:255',
                'content' => 'required|string|min:10',
            ]);


            $article = Article::create($data);

            return response()->json($article, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create article'], 500);
        }
    }

    // POST /api/articles/{id}/comments
    public function storeComment(Request $request, $id): JsonResponse
    {
        try {
            $article = Article::findOrFail($id);

            $data = $request->validate([
                'author_name' => 'required|string|min:2|max:100',
                'content' => 'required|string|min:10|max:2000',
            ]);

            

            $comment = $article->comments()->create($data);

            return response()->json($comment, 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create comment'], 500);
        }
    }
}
