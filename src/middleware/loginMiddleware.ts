import { Cache } from '../lib'
import { Request, Response, NextFunction } from 'express'
import * as Axios from 'axios'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  let token = await Cache.get<String>('token')
  if (token) {
    Object.defineProperty(req, 'token', {
      configurable: false,
      enumerable: true,
      value: `Token ${token}`,
      writable: true,
    })
  } else {
    const baseUrl = 'http://voip.xnet4u.com:7000'
    const loginPath = '/accounts/login/'
    
    let response = await Axios.default.post(`${baseUrl}${loginPath}`, {
      username: 'duany',
      password: 'macuran1234'
    })
    
    Object.defineProperty(req, 'token', {
      configurable: false,
      enumerable: true,
      value: `Token ${response.data.token}`,
      writable: true,
    })
    Cache.set('token', token)
  }

  next()
}