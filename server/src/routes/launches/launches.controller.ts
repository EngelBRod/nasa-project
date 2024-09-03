import type { Response, Request } from 'express'
import {
  getAllLaunches,
  existsLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
} from '../../models/launches.models'

import getPagination from '../../services/query'

async function httpGetAllLaunches (req: Request, res: Response): Promise<object> {
  const { skip, limit } = getPagination(req)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200).json(launches)
}

async function httpAddNewLaunch (req: Request, res: Response): Promise<object> {
  const launch: launch = req.body
  if (
    launch.mission === null ||
    launch.rocket === null ||
    launch.launchDate === null ||
    launch.target === null
  ) {
    return res.status(400).json({
      error: 'Missing required launch property'
    })
  }

  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate.valueOf())) {
    return res.status(400).json({
      error: 'Invalid Date'
    })
  }

  await scheduleNewLaunch(launch)
  return res.status(201).json(launch)
}

async function httpAbortLaunch (req: Request, res: Response): Promise<object> {
  const launchId = Number(req.params.id)
  console.log('id', launchId)
  const existsLaunch = await existsLaunchWithId(launchId)
  if (existsLaunch === null) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }
  const aborted = await abortLaunchById(launchId)
  if (!aborted) {
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  }
  return res.status(200).json({
    ok: true
  })
}

export {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}
