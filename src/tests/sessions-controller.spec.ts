import request from 'supertest'

import { app } from '#/app.js'
import { prisma } from '#/lib/prisma.js'

describe('SessionsController', () => {
  let userId: string

  beforeAll(async () => {
    const userResponse = await request(app).post('/customers').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '1234567',
    })

    userId = userResponse.body.id
  })

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: userId },
    })

    await prisma.$disconnect()
  })

  it('should authenticate and return an access token', async () => {
    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'john@example.com',
      password: '1234567',
    })

    expect(sessionsResponse.status).toBe(200)
    expect(sessionsResponse.body.token).toEqual(expect.any(String))
  })

  it('should not authenticate with a non-existing email', async () => {
    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'joana@example.com',
      password: '1234567',
    })

    expect(sessionsResponse.status).toBe(400)
    expect(sessionsResponse.body.message).toBe('Invalid email or password')
  })

  it('should not authenticate with an incorrect password', async () => {
    const sessionsResponse = await request(app).post('/sessions').send({
      email: 'john@example.com',
      password: '12345678910',
    })

    expect(sessionsResponse.status).toBe(400)
    expect(sessionsResponse.body.message).toBe('Invalid email or password')
  })
})
