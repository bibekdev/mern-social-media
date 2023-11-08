import mongoose from 'mongoose'
import { config } from './config'
import Logger from 'bunyan'

const logger: Logger = config.createLogger('DB')

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DB_URI}`)
      .then(() => logger.info('DB connection established'))
      .catch(error => logger.error(error))
  }
  connect()
  mongoose.connection.on('disconnected', connect)
}
