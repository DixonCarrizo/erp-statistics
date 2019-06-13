import * as express from 'express'
import * as bodyParser from 'body-parser'
import appRouter from './routes'

const port = process.env.PORT || 8090

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(appRouter)

app.listen(port, async () => {
  console.log(`Server running on port ${port}`)
})