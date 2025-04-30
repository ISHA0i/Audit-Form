const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs ');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger class for application logging
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  }

  // Format log message
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      // If data is an error, get the stack trace
      if (data instanceof Error) {
        logMessage += `\n${data.stack}`;
      } else {
        // For objects, stringify them
        try {
          logMessage += `\n${JSON.stringify(data, null, 2)}`;
        } catch (error) {
          logMessage += `\n[Error stringifying data]: ${error.message}`;
        }
      }
    }
    
    return logMessage;
  }

  // Write to log file
  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  // Log levels
  info(message, data = null) {
    const formattedMessage = this.formatMessage('INFO', message, data);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  warn(message, data = null) {
    const formattedMessage = this.formatMessage('WARN', message, data);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  error(message, data = null) {
    const formattedMessage = this.formatMessage('ERROR', message, data);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  debug(message, data = null) {
    // Only log debug messages in development environment
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      console.debug(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }
}

module.exports = new Logger(); 