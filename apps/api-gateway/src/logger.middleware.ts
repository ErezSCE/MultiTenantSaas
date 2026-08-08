import { Injectable, NestMiddleware, LoggerService } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * LoggerMiddleware logs each incoming HTTP request in JSON format using the
 * provided WinstonLogger (or any Nest LoggerService). It generates a requestId
 * that is attached to the request object for downstream usage (e.g., in other
 * logs or error handling).
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    // Attach requestId to request for later use
    (req as any).requestId = requestId;

    const { method, originalUrl } = req;
    const start = Date.now();
    this.logger.log(`Incoming request`, {
      requestId,
      method,
      url: originalUrl,
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`Request completed`, {
        requestId,
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        durationMs: duration,
      });
    });

    next();
  }
}
