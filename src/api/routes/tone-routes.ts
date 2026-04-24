import { Router } from 'express';

import { createTone, listTones } from '../../controllers/tones-controller';
import { requireUserMiddleware } from '../../middleware/require-user';
import { validateRequest } from '../../middleware/validate';
import { createToneBodySchema, listTonesQuerySchema } from '../schemas';

export const toneRouter = Router();

toneRouter.use(requireUserMiddleware);

toneRouter.get('/tones', validateRequest({ query: listTonesQuerySchema }), listTones);
toneRouter.post('/tones', validateRequest({ body: createToneBodySchema }), createTone);
