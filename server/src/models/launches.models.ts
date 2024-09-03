import Axios from 'axios'
import launchesDatabase from '../models/launches.mongo'
import planets from './planets.mongo'

// const launches = new Map();

const DEFAULT_FLIGHT_NUMBER: number = 100

// const launch = {
//     flightNumber:100, //flight_number
//     mission: 'Kepler Exploration X',//name
//     rocket: 'Explorer IS1',//rocket.name
//     launchDate: new Date('December 27, 2030'),//date_local
//     target: 'Kepler-442 b',//not applicable
//     customer:['ZTM','NASA'],
//     upcoming: true, //upcoming
//     success: true, //success

// }

// saveLaunch(launch)

const SPACEX_API_URL: string = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches (): Promise<void> {
  console.log('Downloading launch data')
  const response = await Axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  })

  if (response.status !== 200) {
    console.log('Problem downloading launch data')
    throw new Error('Launch data download failed')
  }

  const launchDocs = response.data.docs
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads
    interface payload { customers: string }
    const customers = payloads.flatMap((payload: payload) => {
      return payload.customers
    })

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers
    }
    console.log(`${launch.flightNumber} ${launch.mission}`)
    await saveLaunch(launch)
  }
}

async function loadLaunchesData (): Promise<void> {
  const firstLaunch: object | null | undefined = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })
  if (firstLaunch !== null) {
    console.log('Launch data already loaded')
  } else {
    await populateLaunches()
  }
}

async function findLaunch (filter: flight): Promise<object | null> {
  return await launchesDatabase.findOne(filter)
}

async function existsLaunchWithId (launchId: number): Promise<object | null> {
  return await findLaunch({
    flightNumber: launchId
  })
}

async function scheduleNewLaunch (launch: launch): Promise<void> {
  const planet = await planets.findOne({
    keplerName: launch.target
  })
  if (planet === null) {
    throw new Error('No matching planets found')
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    sucess: true,
    upcoming: true,
    customers: ['Zero to Mastery', 'NASA'],
    flightNumber: newFlightNumber
  })

  await saveLaunch(newLaunch)
}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(latestFlightNumber,Object.assign(launch,{
//         success:true,
//         upcoming: true,
//         customers:['ZTM','NASA'],
//         flightNumber: latestFlightNumber,
//     }));
// }

async function getLatestFlightNumber (): Promise<number> {
  const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')
  if (latestLaunch === null) {
    return DEFAULT_FLIGHT_NUMBER
  }
  return latestLaunch.flightNumber
}

async function getAllLaunches (skip: number, limit: number): Promise<object> {
  console.log(skip)
  return await launchesDatabase
    .find({}, { __v: 0, _id: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit)
}

async function saveLaunch (launch: launch): Promise<void> {
  await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber
    },
    launch,
    {
      upsert: true
    }
  )
}

async function abortLaunchById (launchId: number): Promise<boolean> {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId
    },
    {
      upcoming: false,
      success: false
    }
  )

  return aborted.modifiedCount === 1
  // console.log(launchId,'aborted')
  // const aborted = launches.get(launchId)
  // console.log(launches);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted
}

export {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById
}
