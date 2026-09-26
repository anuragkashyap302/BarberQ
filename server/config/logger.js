import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Directory path setup kiya logs folder ke liye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, '..', 'logs');

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
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
  )
);

// File logging format (Structured JSON format)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Hindi Comment: Serverless platforms (jaise Vercel/AWS Lambda) read-only filesystem use karte hain.
// Isliye production/serverless me standard Console logging use karenge jo cloud logs dashboard me directly stream hoti hai.
const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
const isProd = process.env.NODE_ENV === 'production';

// Transports list initialize kiya
const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Sirf local non-serverless development me disk pe files log karenge
if (!isVercel && !isProd) {
  try {
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
    transports.push(
      new winston.transports.File({
        filename: path.join(logDirectory, 'error.log'),
        level: 'error',
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(logDirectory, 'combined.log'),
        format: fileFormat,
        maxsize: 5242880,
        maxFiles: 5,
      })
    );
  } catch (err) {
    console.warn('File logging initialization skipped:', err.message);
  }
}

// Winston Logger instance initialize kiya
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

// Hindi Comment: Morgan HTTP logger ke liye stream adapter banaya jo incoming API requests ko Winston ke 'http' level pe pipe karega
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;
