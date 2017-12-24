function login(data) {
  return fetch('http://localhost:3001/login', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
}

function signup(data) {
  return fetch('http://localhost:3001/signup', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
}

function forgot(data) {
  return fetch('http://localhost:3001/forgot', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
};

function reset(data, token) {
  return fetch('http://localhost:3001/reset', {
    method: 'post',
    headers: {'Content-Type': 'application/json', 'Authorization': token},
    body: JSON.stringify(data)
  })
};

module.exports = { signup, login, forgot, reset };
