import { imageUpload } from '@/globals/helpers/cloudinary-upload'
import { BadRequestError } from '@/globals/helpers/error-handler'
import { userService } from '@/services/user.service'
import { IUserDocument } from '@/user/interfaces/user.interface'
import { UploadApiResponse } from 'cloudinary'
import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import jwt, { Secret } from 'jsonwebtoken'
import { config } from '@/root/config'
import httpStatus from 'http-status'

export class SignupUser {
  public async index(req: Request, res: Response): Promise<void> {
    const { fullName, email, password, avatarImage } = req.body

    const checkIfUserExists: IUserDocument = await userService.getUserByEmail(
      email
    )
    if (checkIfUserExists) {
      throw new BadRequestError('User already exists')
    }

    const result: UploadApiResponse = (await imageUpload(
      avatarImage
    )) as unknown as UploadApiResponse
    if (!result?.public_id) {
      throw new BadRequestError('File upload: Error occured. Try again')
    }

    const userObjectId: ObjectId = new ObjectId()
    const userData: IUserDocument = {
      _id: userObjectId,
      fullName,
      email,
      password,
      profilePicture: result.secure_url,
      createdAt: new Date(),
    } as unknown as IUserDocument

    const user = await userService.createUser(userData)

    const accessToken = jwt.sign(
      {
        userId: userObjectId,
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
      user,
      token: accessToken,
    })
  }
}
