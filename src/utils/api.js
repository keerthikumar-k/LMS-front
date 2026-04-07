const BASE_URL = 'https://lms-backend-ap1g.onrender.com/api';

const getToken = () => localStorage.getItem('token');

const request = async (path, options = {}) => {
  const token = getToken();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Request failed with status ${res.status}`);
    return data;
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    throw err;
  }
};

export const api = {
  post:  (path, body) => request(path, { method: 'POST',  body: JSON.stringify(body) }),
  get:   (path)       => request(path, { method: 'GET' }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
};
