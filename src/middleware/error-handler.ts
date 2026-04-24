import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error';

function mapPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  if (error.code === 'P2002') {
    return new AppError(409, 'Resource already exists', error.meta);
  }

  if (error.code === 'P2025') {
    return new AppError(404, 'Resource not found');
  }

  return new AppError(500, 'Internal server error');
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  void _next;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mappedError = mapPrismaError(error);
    return res.status(mappedError.statusCode).json({
      message: mappedError.message,
      details: mappedError.details,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  console.error(error);
  return res.status(500).json({
    message: 'Internal server error',
  });
}
