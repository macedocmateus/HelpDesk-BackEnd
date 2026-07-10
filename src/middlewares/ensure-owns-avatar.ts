import { NextFunction, Request, Response } from 'express'
import { AppError } from '#/utils/AppError.js'

function ensureOwnsAvatar(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params

    if ( id !== request.user?.id ) {
        throw new AppError('You can only change your own resource', 403)
    }

    next()
}

export { ensureOwnsAvatar }
