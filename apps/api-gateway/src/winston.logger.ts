import { LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

/**
 * WinstonLogger implements Nest's LoggerService and outputs logs in JSON format.
 * It includes a requestId (generated per log call if not provided) and can be
 * extended to include tenantId when available.
 */
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  private buildMeta(context?: string, requestId?: string, tenantId?: string) {
    const meta: Record<string, unknown> = {};
    if (context) meta.context = context;
    if (requestId) meta.requestId = requestId;
    if (tenantId) meta.tenantId = tenantId;
    return meta;
  }

  log(message: any, context?: string) {
    const requestId = uuidv4();
    this.logger.info(message, this.buildMeta(context, requestId));
  }

  error(message: any, trace?: string, context?: string) {
    const requestId = uuidv4();
    this.logger.error(message, {
      ...this.buildMeta(context, requestId),
      trace,
    });
  }

  warn(message: any, context?: string) {
    const requestId = uuidv4();
    this.logger.warn(message, this.buildMeta(context, requestId));
  }

  debug?(message: any, context?: string) {
    const requestId = uuidv4();
    this.logger.debug(message, this.buildMeta(context, requestId));
  }

  verbose?(message: any, context?: string) {
    const requestId = uuidv4();
    this.logger.verbose(message, this.buildMeta(context, requestId));
  }

  // Optional: allow setting log level at runtime
  setLogLevels(levels: LogLevel[]) {
    this.logger.level = levels[0];
  }
}
