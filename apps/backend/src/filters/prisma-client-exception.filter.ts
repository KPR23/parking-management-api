import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = 500;
    let message = 'Internal server error (Prisma)';
    const details = exception.meta;

    switch (exception.code) {
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found.';
        break;

      case 'P2002':
        statusCode = 409;
        message = 'Unique constraint violation.';
        break;

      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed.';
        break;
    }

    response.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
    });
  }
}
