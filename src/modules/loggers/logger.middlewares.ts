import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, responce: Response, next: NextFunction) {
    const { originalUrl, method, body } = request;

    responce.on('finish', () => {
      const { statusCode } = responce;

      this.logger.log(`${method} ${originalUrl} - ${statusCode}`);
    });
  }
}
