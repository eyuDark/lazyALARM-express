import { NextFunction, Request, Response } from 'express';

import * as userService from '../services/users-service';

// Controllers translate HTTP requests into service calls and return responses.
// The actual user creation rules live in the service layer.
export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser({
      email: req.body.email,
    });

    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
}
