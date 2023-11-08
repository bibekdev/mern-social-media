import express, { Express } from 'express'
import { Server } from './setupServer'
import setupDatabase from './setupDatabase'
import { config } from './config'

class Application {
  public initialize(): void {
    this.loadConfig()
    setupDatabase()
    const app: Express = express()
    const server: Server = new Server(app)
    server.start()
  }

  private loadConfig(): void {
    config.validateConfig()
    config.cloudinaryConfig()
  }
}

const application: Application = new Application()
application.initialize()
