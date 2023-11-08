import express, { Router } from 'express'
import { SignupUser } from '../controllers/sign-up'
import { SigninUser } from '../controllers/sign-in'
import { authMiddleware } from '@/globals/middlewares/auth.middleware'
import { SignOut } from '../controllers/sign-out'

class AuthRoutes {
  private router: Router

  constructor() {
    this.router = express.Router()
  }

  public routes(): Router {
    this.router.post('/signup', SignupUser.prototype.index)
    this.router.post('/signin', SigninUser.prototype.index)
    this.router.get(
      '/signout',
      authMiddleware.verifyUser,
      SignOut.prototype.index
    )

    return this.router
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes()
