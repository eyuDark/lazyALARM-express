import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error';

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction) {
  return next(new AppError(404, 'Route not found'));
}
