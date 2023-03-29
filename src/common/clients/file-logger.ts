import * as fs from 'fs'
import axios from 'axios'

export default class FileLogger {
  private readonly filepathAccess: string
  private readonly filepathError: string

  constructor(filepathAccess?: string, filepathError?: string) {
    this.filepathAccess = filepathAccess || './logs/access.log'
    this.filepathError = filepathError || filepathAccess || './logs/error.log'
  }

  log(data: any, level?: string, cb?: CallableFunction) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${level?.toUpperCase() ?? 'INFO'}] ${timestamp}: ${JSON.stringify(data)}\n`
    console.log(logEntry)

    fs.appendFile(level === 'error' ? this.filepathError : this.filepathAccess, logEntry, (err) => {
      if (err) throw err
      if (cb) cb()
    })
  }

  debug(data: any, cb?: CallableFunction) {
    this.log(data, 'debug', cb)
  }

  info(data: any, cb?: CallableFunction) {
    this.log(data, 'info', cb)
  }

  warn(data: any, cb?: CallableFunction) {
    this.log(data, 'warn', cb)
  }

  error(data: any, e?: any, cb?: CallableFunction) {
    // If error parsing is desired
    if (e) {
      if (axios.isAxiosError(e)) {
        if (e.response) {
          data.status = e.response.status
          data.error = e.response.data.error
        }
      } else {
        data.error = String(e)
      }
    }

    this.log(data, 'error', cb)
  }
}
