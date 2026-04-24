import { Router } from 'express';

import { alarmRouter } from './alarm-routes';
import { deviceRouter } from './device-routes';
import { healthRouter } from './health-routes';
import { toneRouter } from './tone-routes';
import { userRouter } from './user-routes';

export const v1Router = Router();

v1Router.use(healthRouter);
v1Router.use(userRouter);
v1Router.use(deviceRouter);
v1Router.use(toneRouter);
v1Router.use(alarmRouter);
