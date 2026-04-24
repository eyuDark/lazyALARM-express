import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

import { AppError } from '../errors/app-error';

type ValidationTarget = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  headers?: ZodTypeAny;
};

export function validateRequest(target: ValidationTarget) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (target.body) {
        req.body = target.body.parse(req.body);
      }

      if (target.params) {
        req.params = target.params.parse(req.params) as Request['params'];
      }

      if (target.query) {
        req.query = target.query.parse(req.query) as Request['query'];
      }

      if (target.headers) {
        target.headers.parse(req.headers);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError(400, 'Validation failed', error.flatten()));
      }

      return next(error);
    }
  };
}
