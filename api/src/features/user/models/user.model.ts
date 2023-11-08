import { Model, Schema, model } from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { IUserDocument } from '../interfaces/user.interface'

const SALT_ROUND = 10

const userSchema: Schema = new Schema<IUserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    backgroundImage: { type: String, default: '' },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blockedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notifications: {
      messages: { type: Boolean, default: true },
      reactions: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      follows: { type: Boolean, default: true },
    },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    work: { type: String, default: '' },
    school: { type: String, default: '' },
    location: { type: String, default: '' },
    quote: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password
        return ret
      },
    },
  }
)

userSchema.pre('save', async function (this: IUserDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND)
  this.password = hashedPassword
  next()
})

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IUserDocument).password!
  return compare(password, hashedPassword)
}

userSchema.methods.hashPassword = async function (
  password: string
): Promise<string> {
  return hash(password, SALT_ROUND)
}

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  'User',
  userSchema,
  'User'
)
export { UserModel }
