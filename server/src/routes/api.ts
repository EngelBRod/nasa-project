import express from 'express'
import type { IRouter } from 'express'
import planetsRouter from './planets/planets.routers'
import launchesRouter from './launches/launches.routers'

const api: IRouter = express.Router()

api.use('/launches', launchesRouter)
api.use('/planets', planetsRouter)

export default api
