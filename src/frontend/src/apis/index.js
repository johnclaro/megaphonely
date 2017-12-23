function login(input) {
  return fetch('http://localhost:3001/login', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input)
  })
}

function signup(input) {
  return fetch('http://localhost:3001/signup', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input)
  })
}

function forgot(input) {
  return fetch('http://localhost:3001/forgot', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(input)
  })
};

module.exports = { signup, login, forgot };
