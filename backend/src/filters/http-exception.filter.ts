import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = exception.getStatus();
    const res = exception.getResponse();

    const message =
      typeof res === 'string'
        ? res
        : (res as any).message || 'An error occurred';

    response.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      details: typeof res === 'object' ? res : undefined,
    });
  }
}
