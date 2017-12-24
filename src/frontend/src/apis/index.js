import axios from 'axios';

async function login(data) {
  return axios.post('http://localhost:3001/login', data);
};

function signup(data) {
  return axios.post('http://localhost:3001/signup', data);
};

function forgot(data) {
  return axios.post('http://localhost:3001/forgot', data);
};

function reset(data, token) {
  return axios.post('http://localhost:3001/reset', {headers: {'Authorization': token}})
};

export { signup, login, forgot, reset };
