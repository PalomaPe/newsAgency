const winston = require('winston');
require('winston-daily-rotate-file');

const logConfiguration = {
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'application-%DATE%.log',
      dirname: './logs/',
      levels: { error: 1, warn: 2, info: 3 },
      handleExceptions: true,
      colorize: true,
      json: false,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new winston.transports.Console({
      level: 'error',
    }),
  ],
  exitOnError: false,
};

const logger = winston.createLogger(logConfiguration);

module.exports = Object.freeze(logger);
