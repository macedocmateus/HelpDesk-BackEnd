import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '#/lib/prisma.js'
import { AppError } from '#/utils/AppError.js'

class AdminsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const adminWithSameEmail = await prisma.user.findFirst({ where: { email } })

    if (adminWithSameEmail) {
      throw new AppError('Admin with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const createdAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      },
      omit: { password: true },
    })

    return response.status(201).json(createdAdmin)
  }

  async index(request: Request, response: Response) {
    const listedAdmins = await prisma.user.findMany({
      where: { role: 'admin' },
      omit: { password: true },
    })

    return response.status(200).json(listedAdmins)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const bodySchema = z.object({
      name: z.string().min(3).optional(),
      email: z.email().optional(),
      password: z.string().min(6).optional(),
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, email, password } = bodySchema.parse(request.body)

    const admin = await prisma.user.findUnique({ where: { id } })

    if (!admin) {
      throw new AppError('Admin not found')
    }

    if (email) {
      const adminWithSameEmail = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      })

      if (adminWithSameEmail) {
        throw new AppError('Admin with same email already exists')
      }
    }

    const hashedPassword = password ? await hash(password, 8) : undefined

    const updatedAdmin = await prisma.user.update({
      where: { id },
      data: { name, email, password: hashedPassword },
      omit: { password: true },
    })

    return response.status(200).json(updatedAdmin)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const admin = await prisma.user.findUnique({ where: { id } })

    if (!admin) {
      throw new AppError('Admin not found')
    }

    await prisma.user.delete({
      where: { id },
    })

    return response.status(204).send()
  }
}

export { AdminsController }
