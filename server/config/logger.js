import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Directory path setup kiya logs folder create karne ke liye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '..', 'logs');

// Hindi Comment: Agar logs folder exist nahi karta toh safe way me synchronously create karenge
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Log severity levels define kiya
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors mapping console output me visual debugging ke liye
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

// Log level environment ke basis pe dynamically set hoga (production me http/info, testing/dev me debug)
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'http';
};

// Console formatting (Colorized aur timestamp ke sath clean human-readable text)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

// File logging format (Structured JSON format jo APM tools aur centralized logging systems easily parse kar sakte hain)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// Winston Logger instance initialize kiya
const logger = winston.createLogger({
  level: level(),
  levels,
  transports: [
    // 1. Console Transport (Terminal pe real-time logs print karne ke liye)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // 2. Error File Transport (Sirf error-level logs 'logs/error.log' file me save honge)
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB limit
      maxFiles: 5,
    }),

    // 3. Combined File Transport (Sabhi info, http, warn aur error logs 'logs/combined.log' me save honge)
    new winston.transports.File({
      filename: path.join(logDirectory, 'combined.log'),
      format: fileFormat,
      maxsize: 5242880, // 5MB limit
      maxFiles: 5,
    }),
  ],
  // Unhandled exceptions aur promise rejections ko gracefully catch karke log karega
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDirectory, 'exceptions.log'), format: fileFormat }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDirectory, 'rejections.log'), format: fileFormat }),
  ],
});

// Hindi Comment: Morgan HTTP logger ke liye stream adapter banaya jo incoming API requests ko Winston ke 'http' level pe pipe karega
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;
