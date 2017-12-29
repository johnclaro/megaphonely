import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const API_URL = 'http://megaphone.dev:3001'

axios.interceptors.response.use((config) => {
  return config;
}, function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401  && !originalRequest._retry && error.response.data.message !== 'Refresh token has been revoked') {
    originalRequest._retry = true;
    const refreshToken = localStorage.getItem('mprt');
    return axios.post(`${API_URL}/refresh`, { refreshToken })
    .then(refreshed => {
      const { accessToken } = refreshed.data;
      cookies.set('mpat', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
      return axios(originalRequest);
    })
  };

  return Promise.reject(error);
});

function login(data) {
  return axios.post(`${API_URL}/login`, data);
};

function signup(data) {
  return axios.post(`${API_URL}/signup`, data);
};

function forgot(data) {
  return axios.post(`${API_URL}/forgot`, data);
};

function reset(data, token) {
  const headers = {'Authorization': token};
  return axios.post(`${API_URL}/reset`, data, { headers });
};

function content(data) {
  const headers = {'Authorization': `Bearer ${cookies.get('mpat')}`};
  const payload = new FormData();
  payload.set('media', data.media);
  payload.set('message', data.message);
  payload.set('schedule', data.schedule);
  return axios.post(`${API_URL}/content`, payload, { headers });
}

function connect(data) {
  const headers = {'Authorization': `Bearer ${cookies.get('mpat')}`};
  return axios.get(`${API_URL}/settings`, { headers });
}

export { signup, login, forgot, reset, content, connect };
