import { Request, Response, NextFunction } from 'express';
import { logger } from './logging';

export const accessLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.includes('/stream/')) {
      logger.info({
        type: 'STREAM_ACCESS',
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userId: (req as any).user?.id || 'anonymous'
      });
    }
  });

  next();
};