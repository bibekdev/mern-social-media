import { BadRequestError, NotFoundError } from '@/globals/helpers/error-handler'
import { userService } from '@/services/user.service'
import { IUserDocument } from '@/user/interfaces/user.interface'
import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { config } from '@/root/config'
import httpStatus from 'http-status'

export class SigninUser {
  public async index(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    const checkIfUserExists: IUserDocument = await userService.getUserByEmail(
      email
    )
    if (!checkIfUserExists) {
      throw new NotFoundError('User not found')
    }

    const passwordMatched: Promise<boolean> =
      checkIfUserExists.comparePassword(password)

    if (!passwordMatched) {
      throw new BadRequestError('Invalid credentials')
    }

    const accessToken = jwt.sign(
      {
        userId: checkIfUserExists._id,
      },
      config.JWT_TOKEN as Secret
    )
    res.cookie('auth_token', accessToken, {
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    res.status(httpStatus.CREATED).json({
      message: 'User created successfully',
      user: checkIfUserExists,
      token: accessToken,
    })
  }
}
