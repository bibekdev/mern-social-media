import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { UnAuthorizedError } from '../helpers/error-handler'
import { AuthPayload } from '@/user/interfaces/user.interface'
import { config } from '@/root/config'

class AuthMiddleware {
  public verifyUser(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies['auth_token']) {
      throw new UnAuthorizedError('Token is not available. Please login again')
    }
    try {
      const payload: AuthPayload = jwt.verify(
        req.cookies['auth_token'],
        config.JWT_TOKEN as Secret
      ) as AuthPayload
      req.currentUser = payload
    } catch (error) {
      throw new UnAuthorizedError('Token is invalid. Please login again')
    }
    next()
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware()
