import { Request, Response } from 'express'
import httpStatus from 'http-status'

export class SignOut {
  public async index(req: Request, res: Response): Promise<void> {
    res.clearCookie('auth_token')
    res
      .status(httpStatus.OK)
      .json({ message: 'Logout successful', user: {}, token: '' })
  }
}
