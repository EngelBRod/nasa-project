import express from 'express'
import type { Express } from 'express'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'
import api from './routes/api'

const app: Express = express()

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
)

app.use(morgan('combined'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

export default app
