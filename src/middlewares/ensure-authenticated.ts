import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '#/configs/auth.js'
import { Role } from '#/generated/prisma/enums.js'
import { AppError } from '#/utils/AppError.js'

interface TokenPayload {
  role: Role
  sub: string
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('JWT token not found', 401)
    }

    const [, token] = authHeader.split(' ')

    const { verify } = jwt

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret,
    ) as TokenPayload

    request.user = {
      id: user_id,
      role,
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid JWT token', 401)
  }
}

export { ensureAuthenticated }
