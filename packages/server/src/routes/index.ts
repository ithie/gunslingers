import add from './add.js'
import fallback from './fallback.js'
import login from './login.js'
import logout from './logout.js'

export default [
  { path: '/', method: 'get', callback: fallback },
  {
    path: '/add',
    method: 'post',
    callback: add,
  },
  {
    path: '/login',
    method: 'post',
    callback: login,
  },
  {
    path: '/logout',
    method: 'post',
    callback: logout,
  },
  {
    path: '/login',
    method: 'get',
    callback: () => {
      console.log('GET')
      return {
        status: 200,
        message: 'success',
      }
    },
  },
]
