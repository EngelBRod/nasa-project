/* eslint-disable @typescript-eslint/no-misused-promises */
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'
import planets from './planets.mongo'

function isHabitablePlanet (planet: planet): boolean {
  return (
    planet.koi_disposition === 'CONFIRMED' &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  )
}

async function loadPlanetsData (): Promise<void> {
  await new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true
        })
      )
      .on('data', async (data: planet) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data)
        }
      })
      .on('error', (err) => {
        console.log(err)
        reject(err)
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length

        console.log(`${countPlanetsFound} habitable planets found!`)
        resolve(true)
      })
  })
}

async function getAllPlanets (): Promise<object[]> {
  return await planets.find(
    {},
    {
      __v: 0,
      _id: 0
    }
  )
}

async function savePlanet (planet: planet): Promise<void> {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name
      },
      {
        keplerName: planet.kepler_name
      },
      {
        upsert: true
      }
    )
  } catch (err: unknown) {
    console.error('Could not save planet')
  }
}

export {
  loadPlanetsData,
  getAllPlanets
}
