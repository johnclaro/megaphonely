import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const API_URL = 'http://megaphone.dev:3001'

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
  const headers = {'Authorization': `Bearer ${cookies.get('jwt')}`};
  const payload = new FormData();
  payload.set('media', data.media);
  payload.set('message', data.message);
  payload.set('schedule', data.schedule);
  return axios.post(`${API_URL}/content`, payload, { headers });
}

function connect(data) {
  const headers = {'Authorization': `Bearer ${cookies.get('jwt')}`};
  return axios.get(`${API_URL}/settings`, { headers });
}

export { signup, login, forgot, reset, content, connect };
