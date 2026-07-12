import { NextFunction, Request, Response } from 'express'
import { Role } from '#/generated/prisma/enums.js'
import { AppError } from '#/utils/AppError.js'

function verifyUserAuthorization(role: Role[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError('Unauthorized', 401)
    }

    if (!role.includes(request.user.role)) {
      throw new AppError('Unauthorized', 401)
    }

    return next()
  }
}

export { verifyUserAuthorization }
