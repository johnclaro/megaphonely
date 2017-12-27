import axios from 'axios';

function login(data) {
  return axios.post(`/api/login`, data);
};

function signup(data) {
  return axios.post(`/api/signup`, data);
};

function forgot(data) {
  return axios.post(`/api/forgot`, data);
};

function reset(data, token) {
  const headers = {'Authorization': token};
  return axios.post(`/api/reset`, data, { headers });
};

function content(data) {
  const headers = {'Authorization': localStorage.getItem('jwt')};
  const payload = new FormData();
  payload.set('media', data.media);
  payload.set('message', data.message);
  payload.set('schedule', data.schedule);
  return axios.post(`/api/content`, payload, { headers });
}

function connect(data) {
  const headers = {'Authorization': localStorage.getItem('jwt')};
  return axios.get(`/api/auth/facebook`, { headers })
}

export { signup, login, forgot, reset, content, connect };
