import request from 'supertest'
import app from '../../app'
import { mongoConnect, mongoDisconnect } from '../../services/mongo'
import { loadPlanetsData } from '../../models/planets.model'

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect()
    await loadPlanetsData()
  })
  afterAll(async () => {
    await mongoDisconnect()
  })
  describe('TEST GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('TEST POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4,2028'
    }

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f'
    }

    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot'
    }
    test('It should respond with 200 success', () => {})
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)
      const receiveDate: string | number | Date = response.body.launchDate
      const requestDate = new Date(completeLaunchData.launchDate).valueOf()
      const responseDate = new Date(receiveDate).valueOf()
      expect(responseDate).toBe(requestDate)
      expect(response.body).toMatchObject(launchDataWithoutDate)
    })
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
      })
    })
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toStrictEqual({
        error: 'Invalid Date'
      })
    })
  })
})
