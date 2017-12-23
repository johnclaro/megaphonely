function alert(openAlert, response, color) {
  if (openAlert) {
    if (response.message === 'NetworkError when attempting to fetch resource.') {
      openAlert('We cannot perform that action right now. Please try again later.', 'danger')
    } else {
      openAlert(response, color)
    }
  } else {
    console.error(response)
  }
  return Promise.resolve()
}

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

module.exports = { alert, signup, login, forgot };
