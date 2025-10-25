const BASE = 'http://localhost:8000/api';

export async function fetchArticles() {
  const res = await fetch(`${BASE}/articles`);
  const json = await res.json();
  return json.data; 
}

export async function fetchArticle(id) {
  const res = await fetch(`${BASE}/articles/${id}`);
  const json = await res.json();
  return json.data ?? json; 
}

export async function postComment(articleId, author_name, content) {
  const res = await fetch(`${BASE}/articles/${articleId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author_name, content }),
  });
  const json = await res.json();
  return json.data ?? json; 
}

export async function postArticle(data) {
  const res = await fetch(`${BASE}/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}
