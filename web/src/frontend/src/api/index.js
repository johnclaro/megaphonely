function alert(openAlert, error) {
  if (openAlert) {
    if (error.message === 'NetworkError when attempting to fetch resource.') {
      openAlert('We cannot perform that action right now. Please try again later.')
    } else {
      openAlert(error.message)
    }
  } else {
    console.error(error)
  }
  return Promise.resolve('Done')
}

function login(account) {
  return fetch('http://localhost:3001/login', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(account)
  })
  .then(response => {
    return response.json()
    .then(data => {
      if (response.status === 200) {
        localStorage.setItem('jwt', data.token);
      } else {
        return Promise.reject(data)
      }
    })
  })
  .catch(error => Promise.reject(error))
}

function signup(account) {
  return fetch('http://localhost:3001/account', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(account)
  })
  .then(response => {
    return response.json()
    .then(data => {
      if (response.status === 200) {
        return Promise.resolve(account)
      } else {
        return Promise.reject(data)
      }
    })
  })
}

module.exports = {
  alert: alert,
  signup: signup,
  login: login,
}
