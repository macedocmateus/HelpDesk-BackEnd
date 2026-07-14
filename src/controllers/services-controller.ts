import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '#/lib/prisma.js'
import { AppError } from '#/utils/AppError.js'

class ServicesController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      price: z.number().positive(),
    })

    const { name, price } = bodySchema.parse(request.body)

    const serviceWithSameName = await prisma.service.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    })

    if (serviceWithSameName) {
      throw new AppError('Service with same name already exists')
    }

    const createdService = await prisma.service.create({
      data: { name, price },
    })

    return response.status(201).json(createdService)
  }

  async index(request: Request, response: Response) {
    const { role } = request.user!

    const where = role === 'admin' ? {} : { isActive: true }

    const listedServices = await prisma.service.findMany({
      where,
    })

    return response.status(200).json(listedServices)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      name: z.string().min(3).optional(),
      price: z.number().positive().optional(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, price } = bodySchema.parse(request.body)

    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      throw new AppError('Service not found')
    }

    if (name) {
      const serviceWithSameName = await prisma.service.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          NOT: { id },
        },
      })

      if (serviceWithSameName) {
        throw new AppError('Service with same name already exists')
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        price,
      },
    })

    return response.status(200).json(updatedService)
  }

  async deactivate(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const service = await prisma.service.findUnique({ where: { id } })

    if (!service) {
      throw new AppError('Service not found')
    }

    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    })

    return response.status(204).send()
  }
}

export { ServicesController }
