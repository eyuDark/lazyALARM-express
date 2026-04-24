import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/app-error';

export function requireUserMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (!req.userId) {
    return next(new AppError(401, 'Missing x-user-id header'));
  }

  return next();
}
