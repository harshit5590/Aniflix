import winston from 'winston';

/**
 * Regex to find and mask cloud provider URLs in logs
 * Replaces 'https://d.pcs.baidu.com/...' with '[REDACTED_PROVIDER_URL]'
 */
const maskProviderUrls = winston.format((info) => {
  const urlRegex = /https?:\/\/(?:terabox|nephobox|drive\.google|pcs\.baidu)\.[^\s]+/g;
  if (typeof info.message === 'string') {
    info.message = info.message.replace(urlRegex, '[REDACTED_CLOUD_LINK]');
  }
  return info;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    maskProviderUrls(), // Security hardening
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});