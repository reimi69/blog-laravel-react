import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postArticle } from '../api';

export default function NewArticleForm() {
  const [data, setData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (data.title.length < 3) {
      setError('Заголовок должен быть минимум 3 символа');
      return;
    }
    if (data.content.length < 10) {
      setError('Содержимое должно быть минимум 10 символов');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const article = await postArticle(data);
      nav(`/articles/${article.id}`);
    } catch (err) {
      setError('Не удалось создать статью. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 overflow-x-hidden">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full flex items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            <span className="text-gray-700 text-lg">Сохранение статьи...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline mb-4 self-start"
            aria-label="Вернуться к списку статей"
          >
            ← Вернуться к блогу
          </Link>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Новая статья</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={submit} className="flex flex-col gap-4">
              <input
                placeholder="Заголовок"
                value={data.title}
                required
                maxLength={255}
                className="border p-3 rounded-lg w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                onChange={(e) => setData({ ...data, title: e.target.value.trim() })}
              />
              {error && error.includes('Заголовок') && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
              <textarea
                placeholder="Содержимое"
                value={data.content}
                required
                rows={6}
                className="border p-3 rounded-lg w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                onChange={(e) => setData({ ...data, content: e.target.value.trim() })}
              />
              {error && error.includes('Содержимое') && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-all w-max flex items-center gap-2"
                aria-label="Создать статью"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  'Создать'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}