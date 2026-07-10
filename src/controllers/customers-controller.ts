import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '#/lib/prisma.js'
import { AppError } from '#/utils/AppError.js'
import path from 'node:path'
import fs from 'node:fs'
import { UPLOADS_FOLDER } from '#/lib/multer.js'

class CustomersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const customerWithSameEmail = await prisma.user.findFirst({ where: { email } })

    if (customerWithSameEmail) {
      throw new AppError('Customer with same email already exists')
    }

    const hashedPassword = await hash(password, 8)

    const createdCustomer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'customer',
      },
      omit: { password: true },
    })

    return response.status(201).json(createdCustomer)
  }

  async index(request: Request, response: Response) {
    const listedCustomers = await prisma.user.findMany({
      where: { role: 'customer' },
      omit: { password: true },
    })

    return response.status(200).json(listedCustomers)
  }

  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid()
    })

    const bodySchema = z.object({
      name: z.string().min(3).optional(),
      email: z.email().optional(),
      password: z.string().min(6).optional()
    })

    const { id } = paramsSchema.parse(request.params)
    const { name, email, password } = bodySchema.parse(request.body)

    if (request.user?.role === 'customer' && request.user?.id !== id) {
      throw new AppError('You can only change your own account', 403)
    }

    const customer = await prisma.user.findUnique({
      where: { id }
    })

    if (!customer) {
      throw new AppError('Customer not found')
    }

    if (email) {
      const customerWithSameEmail = await prisma.user.findFirst({
        where: { email, NOT: {id} }
      })

      if (customerWithSameEmail) {
        throw new AppError('Customer with same email already exists')
      }
    }

    const hashedPassword = password ? await hash(password, 8) : undefined

    const updatedCustomer = await prisma.user.update({
      where: { id },
      data: { name, email, password: hashedPassword },
      omit: { password: true },
    })

    return response.status(200).json(updatedCustomer)
  }

  async remove(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid()
    })

    const { id } = paramsSchema.parse(request.params)

    if (request.user?.role === 'customer' && request.user.id !== id) {
      throw new AppError('You can only delete your own account', 403)
    }

    const customer = await prisma.user.findUnique({
      where: { id }
    })

    if (!customer) {
      throw new AppError('Customer not found')
    }

    await prisma.user.delete({
      where: {id}
    })

    response.status(204).send()
  }

  async updateAvatar(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const customer = await prisma.user.findUnique({
      where: { id },
    })

    if (!customer) {
      throw new AppError('Customer not found')
    }

    const oldAvatarUrl = customer.avatar

    if (oldAvatarUrl) {
      const oldFileName = oldAvatarUrl.split('/').pop() ?? ''

      const oldFilePath = path.join(UPLOADS_FOLDER, oldFileName)

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
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

export { CustomersController }
