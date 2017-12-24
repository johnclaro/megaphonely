import axios from 'axios';

function login(data) {
  return axios.post('http://localhost:3001/login', data);
};

function signup(data) {
  return axios.post('http://localhost:3001/signup', data);
};

function forgot(data) {
  return axios.post('http://localhost:3001/forgot', data);
};

function reset(data, token) {
  const headers = {'Authorization': token}
  const options = { headers }
  return axios.post('http://localhost:3001/reset', data, options)
};

export { signup, login, forgot, reset };
