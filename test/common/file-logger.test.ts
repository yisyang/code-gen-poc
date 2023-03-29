import {expect, test} from '@oclif/test'
import * as fs from 'fs'
import FileLogger from '../../src/common/clients/file-logger'

describe('FileLogger', () => {
  const accessLogPath = './tmp/test-access.log'
  const errorLogPath = './tmp/test-error.log'

  beforeEach(() => {
    // Clean up tmp log files before each test, if they exist
    if (fs.existsSync(accessLogPath)) {
      fs.unlinkSync(accessLogPath)
    }
    if (fs.existsSync(errorLogPath)) {
      fs.unlinkSync(errorLogPath)
    }
  })

  test.it('should log data to access log file', () => {
    const fileLogger = new FileLogger(accessLogPath, errorLogPath)
    const testData = { message: 'Access test message' }

    fileLogger.info(testData, () => {
      const logContent = fs.readFileSync(accessLogPath, 'utf-8')
      expect(logContent).to.contain(JSON.stringify(testData))
    })
  })

  test.it('should log data to access log file with DEBUG', () => {
    const fileLogger = new FileLogger(accessLogPath, errorLogPath)
    const testData = { message: 'Access test message' }

    fileLogger.debug(testData, () => {
      const logContent = fs.readFileSync(accessLogPath, 'utf-8')
      expect(logContent).to.contain('DEBUG')
    })
  })

  test.it('should log data to access log file with WARN', () => {
    const fileLogger = new FileLogger(accessLogPath, errorLogPath)
    const testData = { message: 'Access test message' }

    fileLogger.warn(testData, () => {
      const logContent = fs.readFileSync(accessLogPath, 'utf-8')
      expect(logContent).to.contain('WARN')
    })
  })

  test.it('should log data to error log file', () => {
    const fileLogger = new FileLogger(accessLogPath, errorLogPath)
    const testData = { message: 'Error test message' }

    fileLogger.error(testData, undefined, () => {
      const logContent = fs.readFileSync(errorLogPath, 'utf-8')
      expect(logContent).to.contain(JSON.stringify(testData))
    })
  })

  test.it('should log error data with additional information', () => {
    const fileLogger = new FileLogger(accessLogPath, errorLogPath)
    const testData = { message: 'Error test message with additional info' }
    const testError = new Error('Test error')

    fileLogger.error(testData, testError, () => {
      const logContent = fs.readFileSync(errorLogPath, 'utf-8')
      expect(logContent).to.contain(JSON.stringify(testData))
      expect(logContent).to.contain('Test error')
    })
  })
})
