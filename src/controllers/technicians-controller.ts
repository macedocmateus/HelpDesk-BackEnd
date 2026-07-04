import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '#/lib/prisma.js'
import { AppError } from '#/utils/AppError.js'
import { DEFAULT_AVAILABLE_HOURS } from '#/utils/default-available-hours.js'

class TechniciansController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const techniciansWithSameEmail = await prisma.user.findFirst({
      where: { email },
    })

    if (techniciansWithSameEmail) {
      throw new AppError('Technicians with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const createdTechnician = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'technician',
        technicianProfile: {
          create: {
            availableHours: DEFAULT_AVAILABLE_HOURS,
          },
        },
      },
      omit: { password: true },
    })

    return response.status(201).json(createdTechnician)
  }

  async index(request: Request, response: Response) {
    const listedTechnicians = await prisma.user.findMany({
      where: { role: 'technician' },
      omit: { password: true },
    })

    return response.status(200).json(listedTechnicians)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      name: z.string().min(3).optional(),
      email: z.email().optional(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, email } = bodySchema.parse(request.body)

    const technician = await prisma.user.findUnique({ where: { id } })

    if (!technician) {
      throw new AppError('Technician not found')
    }

    if (email) {
      const technicianWithSameEmail = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      })

      if (technicianWithSameEmail) {
        throw new AppError('Technician with same email already exists')
      }
    }

    const updatedTechnician = await prisma.user.update({
      where: { id },
      data: { name, email },
      omit: { password: true },
    })

    return response.status(200).json(updatedTechnician)
  }

  async updatePassword(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      password: z.string().min(6),
    })

    const { id } = paramsSchema.parse(request.params)
    const { password } = bodySchema.parse(request.body)

    const technician = await prisma.user.findUnique({
      where: { id },
    })

    if (!technician) {
      throw new AppError('Technician not found')
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    return response.status(204).send()
  }

  async updateAvailableHours(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      availableHours: z.array(z.string()),
    })

    const { id } = paramsSchema.parse(request.params)
    const { availableHours } = bodySchema.parse(request.body)

    const technician = await prisma.user.findUnique({
      where: { id },
    })

    if (!technician) {
      throw new AppError('Technician not found')
    }

    await prisma.technicianProfile.update({
      where: { userId: id },
      data: { availableHours },
    })

    return response.status(204).send()
  }

  async updateAvatar(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const technician = await prisma.user.findUnique({
      where: { id },
    })

    if (!technician) {
      throw new AppError('Technician not found')
    }

    const avatarFile = request.file

    if (!avatarFile) {
      throw new AppError('Avatar file is required')
    }

    const avatarUrl = `${request.protocol}://${request.get('host')}/uploads/${avatarFile.filename}`

    await prisma.user.update({
      where: { id },
      data: { avatar: avatarUrl },
    })

    return response.status(200).json({ avatarUrl })
  }
}

export { TechniciansController }
