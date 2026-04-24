import { NextFunction, Request, Response } from 'express';

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  const userId = req.header('x-user-id');

  if (userId) {
    req.userId = userId;
  }

  next();
}
