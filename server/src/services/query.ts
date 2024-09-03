import type { Request } from 'express'
const DEFAULT_PAGE_LIMIT = 0
const DEFAULT_PAGE_NUMBER = 1

function getPagination (req: Request): query {
  const queryPage = req.query.page
  const queryLimit = req.query.limit
  const page = Math.abs(Number(queryPage)) ?? DEFAULT_PAGE_NUMBER
  const limit = Math.abs(Number(queryLimit)) ?? DEFAULT_PAGE_LIMIT
  const skip = (page - 1) * limit

  return {
    skip,
    limit
  }
}

export default getPagination
