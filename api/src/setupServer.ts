import { Application, NextFunction, Request, Response } from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import SocketIO from 'socket.io'
import compression from 'compression'
import 'express-async-errors'
import bodyParser from 'body-parser'
import httpStatus from 'http-status'
import cookieParser from 'cookie-parser'
import Logger from 'bunyan'

import { config } from './config'
import appRoutes from './routes'
import { CustomError, IErrorResponse } from '@/globals/helpers/error-handler'

const logger: Logger = config.createLogger('Server')

export class Server {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.securityMiddleware(this.app)
    this.standardMiddleware(this.app)
    this.routeMiddleware(this.app)
    this.globalMiddleware(this.app)
    this.startServer(this.app)
  }

  private securityMiddleware(app: Application): void {
    app.use(cookieParser())
    app.use(hpp())
    app.use(helmet())
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
      })
    )
  }

  private standardMiddleware(app: Application): void {
    app.use(compression())
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  }

  private routeMiddleware(app: Application): void {
    appRoutes(app)
  }

  private globalMiddleware(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res
        .status(httpStatus.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` })
    })

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors())
        }
        next()
      }
    )
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app)
      const socketIO: SocketIO.Server = await this.createSocketIO(httpServer)
      this.startHttpServer(httpServer)
      this.socketIOConnection(socketIO)
    } catch (error) {
      logger.error(error)
    }
  }

  private async createSocketIO(
    httpServer: http.Server
  ): Promise<SocketIO.Server> {
    const io: SocketIO.Server = new SocketIO.Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    })
    io.on('connection', () => {
      logger.info('SocketIO connection established')
    })
    return io
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(config.PORT, () => {
      logger.info(`Server running at ${config.PORT}`)
    })
  }

  private socketIOConnection(io: SocketIO.Server): void {}
}
