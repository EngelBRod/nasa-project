import dotenv from 'dotenv'
import http from 'http'
import { mongoConnect } from './services/mongo'
import app from './app'
import { loadPlanetsData } from './models/planets.model'
import { loadLaunchesData } from './models/launches.models'

dotenv.config()

const PORT = process.env.PORT ?? 5000

const server = http.createServer(app)

async function startServer (): Promise<void> {
  await mongoConnect()
  await loadPlanetsData()
  await loadLaunchesData()

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
  })
}

void startServer()
