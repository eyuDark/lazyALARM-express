import { Router } from 'express';

import { deleteDevice, upsertDevice } from '../../controllers/devices-controller';
import { requireUserMiddleware } from '../../middleware/require-user';
import { validateRequest } from '../../middleware/validate';
import { upsertDeviceBodySchema, userParamsSchema } from '../schemas';

export const deviceRouter = Router();

deviceRouter.use(requireUserMiddleware);

deviceRouter.post('/devices', validateRequest({ body: upsertDeviceBodySchema }), upsertDevice);
deviceRouter.delete('/devices/:id', validateRequest({ params: userParamsSchema }), deleteDevice);
