import Axios, { AxiosRequestConfig } from 'axios'
import { Router, Request, Response } from 'express'
import { IAuthorizedRequest } from '../types/AuthorizedRequest'
import { login } from '../middleware/loginMiddleware'
import * as moment from 'moment'
const models = require('../../models')

const asterisStatistisk = models.asterisk_statistics

const router = Router()

const baseUrl = 'http://voip.xnet4u.com:7000'
const loginPath = '/accounts/login/'
const statisticsPath = '/api/statistics/exten'
const cdrsPath = '/api/cdrs'

const resolveRequest = (config) => Axios.get(`${baseUrl}${statisticsPath}`, config)

const formattedStatistics = async (config) => {
  let { data } = await resolveRequest(config)

  const statistics = []

  for (const extension in data) {
    if (data.hasOwnProperty(extension)) {
      const element = data[extension];
      statistics.push({
        date: config.start_date.split(' ')[0],
        extension,
        totalCalls: element.totalCalls,
        totalTimeCalls: element.totalTimeCalls,
        totalReceivedCalls: element.totalReceivedCalls,
        totalTimeReceivedCalls: element.totalTimeReceivedCalls,
        totalEmitedCalls: element.totalEmitedCalls,
        totalTimeEmitedCalls: element.totalTimeEmitedCalls,
        total30sCalls: element.total30sCalls,
        totalDuration30sCalls: element.totalDuration30sCalls,
        lostCalls: element.lostCalls
      })
    }
  }

  return statistics
}

router.get('/load', login, async (req: IAuthorizedRequest, res: Response) => {
  const authorization = req.token
  const { start, end } = req.query
  let yesterday = moment(`${end}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
  let notToday = true
  let i = 0
  let listToFetch = []
  while (notToday) {
    let toFetchDate = moment(`${start}`, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD');
    listToFetch.push({
      start_date: `${toFetchDate} 00:00:00`,
      end_date: `${toFetchDate} 23:59:59`
    })
    notToday = toFetchDate !== yesterday
    i += 1
  }

  let promises = listToFetch.map(dates => {
    
    const config: AxiosRequestConfig = {
      params: {
        extens: '21,1021,121,125,1025,25,128,1028,28,133,33',
        start_date: dates.start_date,
        end_date: dates.end_date
      }, headers: {
        authorization
      }
    }

    return formattedStatistics(config)
  })

  let responses = await Promise.all(promises)
  await asterisStatistisk.bulkCreate(responses)

  res.send('Listo')

})

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

router.get('/statistics', login, async (req: IAuthorizedRequest, res: Response) => {
  const authorization = req.token
  const { extens, start_date, end_date } = req.query

  if (!extens || !start_date || !end_date) {
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

    return res.json({ data: response.data })
  } catch (error) {
    return res.status(400).json({
      error: `Asterisk request failed with error: ${error.message}`
    })
  }
})

router.get('/cdrs', login, async (req: IAuthorizedRequest, res: Response) => {
  const authorization = req.token
  const { offset, limit, search, ordering } = req.query

  if (!offset || !limit || !search || !ordering) {
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