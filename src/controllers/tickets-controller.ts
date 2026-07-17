import { Request, Response } from 'express'
import { z } from 'zod'
import { TicketStatus } from '#/generated/prisma/enums.js'
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

  async addServices(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      servicesIds: z.array(z.uuid()).min(1),
    })

    const { id } = paramsSchema.parse(request.params)
    const { servicesIds } = bodySchema.parse(request.body)

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      throw new AppError('Ticket not found')
    }

    if (request.user!.id !== ticket.technicianId) {
      throw new AppError(
        'You can only add services to tickets assigned to you',
        403,
      )
    }

    const services = await prisma.service.findMany({
      where: { id: { in: servicesIds }, isActive: true },
    })

    if (services.length !== servicesIds.length) {
      throw new AppError('One or more services are invalid or inactive')
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        ticketServices: {
          create: services.map((service) => ({
            serviceId: service.id,
            price: service.price,
          })),
        },
      },
    })

    return response.status(200).json(updatedTicket)
  }

  async updateStatus(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      status: z.enum(TicketStatus),
    })

    const { id } = paramsSchema.parse(request.params)
    const { status } = bodySchema.parse(request.body)

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    })

    if (!ticket) {
      throw new AppError('Ticket not found')
    }

    const { id: userId, role } = request.user!

    if (role !== 'admin' && userId !== ticket.technicianId) {
      throw new AppError(
        'You can only update the status of tickets assigned to you',
        403,
      )
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: { status },
    })

    return response.status(200).json(updatedTicket)
  }
}

export { TicketsController }
