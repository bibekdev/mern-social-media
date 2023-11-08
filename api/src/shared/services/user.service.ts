import { IUserDocument } from '@/user/interfaces/user.interface'
import { UserModel } from '@/user/models/user.model'

class UserService {
  public async createUser(data: IUserDocument): Promise<IUserDocument> {
    await UserModel.create(data)
    return UserModel.findOne({ email: data.email }) as unknown as IUserDocument
  }

  public async getUserById(userId: string): Promise<IUserDocument> {
    return UserModel.findById(userId) as unknown as IUserDocument
  }
  public async getUserByEmail(email: string): Promise<IUserDocument> {
    return UserModel.findOne({ email }) as unknown as IUserDocument
  }
}

export const userService: UserService = new UserService()
