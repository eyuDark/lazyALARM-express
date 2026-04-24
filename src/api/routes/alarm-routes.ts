import { Router } from 'express';

import {
  createAlarm,
  deleteAlarm,
  listAlarms,
  patchAlarmEnabled,
  updateAlarm,
} from '../../controllers/alarms-controller';
import { requireUserMiddleware } from '../../middleware/require-user';
import { validateRequest } from '../../middleware/validate';
import {
  createAlarmBodySchema,
  patchAlarmEnabledBodySchema,
  updateAlarmBodySchema,
  userParamsSchema,
} from '../schemas';

export const alarmRouter = Router();

alarmRouter.use(requireUserMiddleware);

alarmRouter.get('/alarms', listAlarms);
alarmRouter.post('/alarms', validateRequest({ body: createAlarmBodySchema }), createAlarm);
alarmRouter.put('/alarms/:id', validateRequest({ params: userParamsSchema, body: updateAlarmBodySchema }), updateAlarm);
alarmRouter.patch(
  '/alarms/:id/enabled',
  validateRequest({ params: userParamsSchema, body: patchAlarmEnabledBodySchema }),
  patchAlarmEnabled
);
alarmRouter.delete('/alarms/:id', validateRequest({ params: userParamsSchema }), deleteAlarm);
