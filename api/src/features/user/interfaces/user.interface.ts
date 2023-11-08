import mongoose, { Document } from 'mongoose'
import { ObjectId } from 'mongodb'

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload
    }
  }
}

export interface AuthPayload {
  userId: string
}

export interface IUserDocument extends Document {
  _id: string | ObjectId
  fullName: string
  email: string
  password?: string
  postsCount: number
  work: string
  school: string
  quote: string
  location: string
  blocked: mongoose.Types.ObjectId[]
  blockedBy: mongoose.Types.ObjectId[]
  followersCount: number
  followingCount: number
  notifications: INotificationSettings
  social: ISocialLinks
  backgroundImage: string
  profilePicture: string
  createdAt: Date
  comparePassword(password: string): Promise<boolean>
  hashPassword(password: string): Promise<string>
}

export interface INotificationSettings {
  messages: boolean
  reactions: boolean
  comments: boolean
  follows: boolean
}

export interface ISocialLinks {
  facebook: string
  instagram: string
  twitter: string
  youtube: string
}
