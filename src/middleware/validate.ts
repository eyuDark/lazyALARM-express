import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";

import { AppError } from "../errors/app-error";

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
        const parsedBody = target.body.parse(req.body);
        Object.assign(req.body, parsedBody);
      }

      if (target.params) {
        const parsedParams = target.params.parse(req.params);
        Object.assign(req.params, parsedParams);
      }

      if (target.query) {
        const parsedQuery = target.query.parse(req.query);
        Object.assign(req.query, parsedQuery);
      }

      if (target.headers) {
        const parsedHeaders = target.headers.parse(req.headers);
        Object.assign(req.headers, parsedHeaders);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError(400, "Validation failed", error.flatten()));
      }

      return next(error);
    }
  };
}
