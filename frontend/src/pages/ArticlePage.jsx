import { useEffect, useState } from 'react';
import { fetchArticle, postComment } from '../api';
import { useParams, Link } from 'react-router-dom';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState({ author_name: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState({ author_name: '', content: '' });
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArticle(id)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Ошибка загрузки статьи');
        setLoading(false);
      });
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    setCommentError({ author_name: '', content: '' });

    // Валидация
    let hasError = false;
    const newErrors = { author_name: '', content: '' };
    if (comment.author_name.trim().length < 2) {
      newErrors.author_name = 'Имя должно быть минимум 2 символа';
      hasError = true;
    }
    if (comment.content.trim().length < 10) {
      newErrors.content = 'Комментарий должен быть минимум 10 символов';
      hasError = true;
    }
    if (hasError) {
      setCommentError(newErrors);
      return;
    }

    setCommentLoading(true);
    try {
      await postComment(id, comment.author_name, comment.content);
      setComment({ author_name: '', content: '' });
      const updatedArticle = await fetchArticle(id);
      setArticle(updatedArticle);
    } catch (err) {
      setError('Не удалось отправить комментарий');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full flex items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
          <span className="text-gray-700 text-lg">Загрузка статьи...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full text-red-500 text-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen w-full bg-gray-50 py-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full text-gray-500 text-lg text-center">
          Статья не найдена
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col gap-8">
        <Link
          to="/"
          className="text-blue-600 font-medium hover:underline mb-4 self-start"
          aria-label="Вернуться к списку статей"
        >
          ← Вернуться к блогу
        </Link>

        <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{article.title}</h1>
          <p className="text-gray-500 text-sm mb-4">
            {new Date(article.created_at).toLocaleString("ru-RU", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-700 leading-relaxed">{article.content}</p>
        </article>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Комментарии</h2>
          {(article.comments ?? []).map(c => (
            <div
              key={c.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              <strong className="text-gray-900">{c.author_name}:</strong>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(c.created_at).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-gray-700 mt-1">{c.content}</p>
            </div>
          ))}

          <form onSubmit={submitComment} className="flex flex-col gap-3 mt-4">
            <div>
              <input
                className="border p-3 rounded-lg w-full text-gray-900"
                placeholder="Имя"
                value={comment.author_name}
                onChange={e => setComment({ ...comment, author_name: e.target.value.trim() })}
                required
                disabled={commentLoading}
              />
              {commentError.author_name && (
                <p className="text-red-500 text-sm mt-1">{commentError.author_name}</p>
              )}
            </div>
            <div>
              <textarea
                className="border p-3 rounded-lg w-full text-gray-900"
                placeholder="Комментарий"
                value={comment.content}
                onChange={e => setComment({ ...comment, content: e.target.value.trim() })}
                required
                rows={4}
                disabled={commentLoading}
              />
              {commentError.content && (
                <p className="text-red-500 text-sm mt-1">{commentError.content}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-all w-max flex items-center gap-2"
              aria-label="Отправить комментарий"
              disabled={commentLoading}
            >
              {commentLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Отправка...</span>
                </>
              ) : (
                'Отправить'
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}