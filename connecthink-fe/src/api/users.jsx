const BASE_URL = "http://127.0.0.1:8000/api";

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Session expired, please login again');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response;
};

export const loginUser = async (username, password) => {
  const response = await authFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('auth_token', data.token);
  }

  return data;
};

export const fetchUsers = async () => {
  const response = await authFetch('/users');
  return response.json();
};

export const createUser = async (userData) => {
  const response = await authFetch('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const updateUser = async (id, updatedData) => {
  const response = await authFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData)
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await authFetch(`/users/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const logoutUser = async () => {
  localStorage.removeItem('auth_token');

  try {
    await authFetch('/logout', { method: 'POST' });
  } catch (err) {
    console.log('Logout error:', err);
  }
};