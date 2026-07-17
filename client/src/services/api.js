import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add JWT token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('nexushub_user');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
};

// User API
export const userAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => API.put('/users/profile', data),
  followUser: (id) => API.put(`/users/${id}/follow`),
  getFollowers: (id) => API.get(`/users/${id}/followers`),
  getFollowing: (id) => API.get(`/users/${id}/following`),
  searchUsers: (query) => API.get(`/users/search?q=${query}`),
};

// Post API
export const postAPI = {
  createPost: (data) => API.post('/posts', data),
  getFeed: (page = 1) => API.get(`/posts/feed?page=${page}`),
  getExplore: (page = 1) => API.get(`/posts/explore?page=${page}`),
  getPost: (id) => API.get(`/posts/${id}`),
  updatePost: (id, data) => API.put(`/posts/${id}`, data),
  deletePost: (id) => API.delete(`/posts/${id}`),
  likePost: (id) => API.put(`/posts/${id}/like`),
  addComment: (id, data) => API.post(`/posts/${id}/comment`, data),
  deleteComment: (postId, commentId) => API.delete(`/posts/${postId}/comment/${commentId}`),
  getUserPosts: (userId, page = 1) => API.get(`/posts/user/${userId}?page=${page}`),
};

export default API;
