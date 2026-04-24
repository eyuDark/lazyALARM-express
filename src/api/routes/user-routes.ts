import { Router } from 'express';

import { createUser } from '../../controllers/users-controller';
import { validateRequest } from '../../middleware/validate';
import { createUserBodySchema } from '../schemas';

export const userRouter = Router();

userRouter.post('/users', validateRequest({ body: createUserBodySchema }), createUser);
