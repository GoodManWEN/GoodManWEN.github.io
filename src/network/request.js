import axios from 'axios'

let baseURL = '/'
if (process.env.NODE_ENV == 'development') {    
  baseURL = '/dev/'
} else if (process.env.NODE_ENV == 'production') {    
  baseURL = '/'
}

let rcall = (req) => {
  return req
}
let rerr = (err) => {
  console.log('axios network error', err)
  return err
}

let request = {
  get: (config) => {
    const instance = axios.create({
      baseURL: baseURL,
      timeout: 10000
    })
    instance.interceptors.request.use(rcall , rerr)
    return instance(config)
  },
  post: (config) => {
    const instance = axios.create({
      baseURL: baseURL,
      timeout: 10000,
      method: 'post',
    })
    instance.interceptors.request.use(rcall , rerr)
    return instance(config)
  },
  raw: (config) => {
    const instance = axios.create({
      timeout: 10000
    })
    return instance(config)
  },
}
export {request}