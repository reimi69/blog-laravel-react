import { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import { Link } from "react-router-dom";

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchArticles()
      .then((a) => {
        setArticles(a);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ошибка загрузки статей");
        setLoading(false);
      });
  }, []);

  if (loading) {
  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full flex items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        <span className="text-gray-700 text-lg">Загрузка статей...</span>
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

if (!articles.length) {
  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-4xl w-full text-gray-500 text-lg text-center">
        Статей пока нет...
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 overflow-x-hidden">
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-left w-full sm:w-auto">
          Блог
        </h1>
        <Link
          to="/articles/new"
          className="inline-block text-center px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all"
          aria-label="Создать новую статью"
        >
          + Новая статья
        </Link>
      </div>

      <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">
        {articles.map((a) => (
          <article
            key={a.id}
            className="w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-6 sm:p-8"
          >
            <header className="mb-3">
              <Link
                to={`/articles/${a.id}`}
                className="text-2xl font-semibold text-gray-900 hover:text-blue-700 transition-colors"
                aria-label={`Читать статью ${a.title}`}
              >
                {a.title}
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(a.created_at).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </header>

            <p className="text-gray-700 leading-relaxed mb-4">
              {a.excerpt || a.content.slice(0, 250)}...
            </p>

            <Link
              to={`/articles/${a.id}`}
              className="text-blue-600 font-medium hover:underline"
              aria-label={`Читать статью ${a.title} полностью`}
            >
              Читать далее →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}