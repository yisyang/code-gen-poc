import * as fs from 'fs'

export class FileLogger {
  private readonly filepath: string

  constructor(filepath: string) {
    this.filepath = filepath || './logs/access.log'
  }

  log(data: any) {
    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp}: ${JSON.stringify(data)}\n`

    fs.appendFile(this.filepath, logEntry, (err) => {
      if (err) throw err
    })
  }
}
