import { Router, Request, Response } from 'express'
import * as Axios from 'axios'
const soap = require('soap') 

const baseUrl = 'https://publidirecta.promocalltech.com'

const wsdl = `https://publidirecta.promocalltech.com/htdocs/webservices/server_user.php?wsdl`
const arg = {
  authentication: {
    dolibarrkey: 'webservice123',
    sourceapplication: 'nodetest',
    login: 'webservice',
    password: 'webservice123',
    entity: ''
  }
}

const getUser = (id: string) => Axios.default.get(`${baseUrl}/htdocs/api/index.php/user/${id}?api_key=webservice123`)

const getJob = async (id: string) => {
  const { data: { job } } = await getUser(id)
  
  return job
}

const getFormattedUser = async (user) => {
  return {
    id: user.id.$value,
    asignaciones: user.asignaciones.$value,
    asignacionesnoenv: user.asignacionesnoenv.$value,
    attributes: user.attributes.$value,
    chatscontestados: user.chatscontestados.$value,
    chatsperdidos: user.chatsperdidos.$value,
    contratosrealizados: user.contratosrealizados.$value,
    extension: user.extension.$value,
    fechafin: user.fechafin.$value,
    fechaini: user.fechaini.$value,
    firstname: user.firstname.$value,
    horainicio: user.horainicio.$value,
    lastname: user.lastname.$value,
    mailsenviados: user.mailsenviados.$value,
    mailsrecibidos: user.mailsrecibidos.$value,
    mailssincontestar: user.mailssincontestar.$value,
    tiempoconexion: user.tiempoconexion.$value,
    ventasanual: user.ventasanual.$value,
    ventasmensual: user.ventasmensual.$value,
    ventasrealizadas: user.ventasrealizadas.$value,
    ventassemanal: user.ventassemanal.$value,
    job: await getJob(user.id.$value)
  }
}

export const router = Router()

router.get('/statistics', async (req: Request, res: Response) => {
  const soapClient = await createSoapClient(wsdl)

  soapClient.getStatistics(arg, async (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err
      })
    }
    const items = result.users.item
    const promises = items.map(getFormattedUser)
    const users = await Promise.all(promises)

    res.json(users)
  })
})

const createSoapClient = async (wsdl: string) => soap.createClientAsync(wsdl, {})

export default router