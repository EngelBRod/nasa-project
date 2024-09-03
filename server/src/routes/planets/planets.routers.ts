/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import type { IRouter } from 'express'
import { httpGetAllPlanets } from './planets.controller'

const planetsRouter: IRouter = express.Router()

planetsRouter.get('/', httpGetAllPlanets)

export default planetsRouter
