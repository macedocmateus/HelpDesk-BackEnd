import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '#/lib/prisma.js'
import { AppError } from '#/utils/AppError.js'

class TicketsController {
  async create(request: Request, response: Response) {
    const { id: clientId } = request.user!

    const bodySchema = z.object({
      technicianId: z.uuid(),
      servicesIds: z.array(z.uuid()).min(1),
    })

    const { technicianId, servicesIds } = bodySchema.parse(request.body)

    const technician = await prisma.user.findFirst({
      where: { id: technicianId, role: 'technician' },
    })

    if (!technician) {
      throw new AppError('Technician not found')
    }

    const services = await prisma.service.findMany({
      where: { id: { in: servicesIds }, isActive: true },
    })

    if (services.length !== servicesIds.length) {
      throw new AppError('One or more services are invalid or inactive')
    }

    const createdTicket = await prisma.ticket.create({
      data: {
        clientId,
        technicianId,
        ticketServices: {
          create: services.map((service) => ({
            serviceId: service.id,
            price: service.price,
          })),
        },
      },
    })

    return response.status(201).json(createdTicket)
  }

  async index(request: Request, response: Response) {
    const { id, role } = request.user!

    const whereByRole = {
      admin: {},
      technician: { technicianId: id },
      customer: { clientId: id },
    }

    const where = whereByRole[role]

    const listedTickets = await prisma.ticket.findMany({ where })

    return response.status(200).json(listedTickets)
  }
}

export { TicketsController }
