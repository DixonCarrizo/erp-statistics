import Axios, { AxiosRequestConfig } from 'axios'
import { Router, Request, Response } from 'express'

const router = Router()

const baseUrl = 'http://voip.xnet4u.com:7000'
const loginPath = '/accounts/login/'
const statisticsPath = '/api/statistics/exten'
const cdrsPath = '/api/cdrs'

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      error: 'Missing credentials'
    })
  }

  try {
    const response = await Axios.post(`${baseUrl}${loginPath}`, {
      username,
      password
    })

    return res.json({
      token: response.data.token
    })
  } catch (error) {
    return res.status(400).json({
      error: `Asterisk request failed with error: ${error.message}`
    })
  }
})

router.get('/statistics', async (req: Request, res: Response) => {
  const authorization = req.headers.authorization
  const { extens, start_date, end_date } = req.query

  if(!extens || !start_date || !end_date) {
    return res.status(400).json({
      error: 'Missing parameters'
    })
  }

  const config: AxiosRequestConfig = {
    params: {
      extens,
      start_date,
      end_date
    }, headers: {
      authorization
    }
  }

  try {
    const response = await Axios.get(`${baseUrl}${statisticsPath}`, config)
    
    return res.json({ data: response.data})
  } catch (error) {
    return res.status(400).json({
      error: `Asterisk request failed with error: ${error.message}`
    })
  }
})

router.get('/cdrs', async (req: Request, res: Response) => {
  const authorization = req.headers.authorization
  const { offset, limit, search, ordering } = req.query

  if(!offset || !limit || !search || !ordering) {
    return res.status(400).json({
      error: 'Missing parameters'
    })
  }

  const config: AxiosRequestConfig = {
    params: {
      offset,
      limit,
      search,
      ordering
    }, headers: {
      authorization
    }
  }
  try {
    const response = await Axios.get(`${baseUrl}${cdrsPath}`, config)
    
    return res.json({ data: response.data })
  } catch (error) {
    return res.status(400).json({
      error: `Asterisk request failed with error: ${error.message}`
    })
  }

})

export default router