import { NextFunction, Request, Response } from 'express';

import * as alarmService from '../services/alarms-service';

function getRequiredParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export async function listAlarms(req: Request, res: Response, next: NextFunction) {
  try {
    const alarms = await alarmService.listAlarms(req.userId!);
    return res.status(200).json(alarms);
  } catch (error) {
    return next(error);
  }
}

export async function createAlarm(req: Request, res: Response, next: NextFunction) {
  try {
    const alarm = await alarmService.createAlarm(req.userId!, req.body);
    return res.status(201).json(alarm);
  } catch (error) {
    return next(error);
  }
}

export async function updateAlarm(req: Request, res: Response, next: NextFunction) {
  try {
    const alarm = await alarmService.updateAlarm(req.userId!, getRequiredParam(req.params.id), req.body);
    return res.status(200).json(alarm);
  } catch (error) {
    return next(error);
  }
}

export async function patchAlarmEnabled(req: Request, res: Response, next: NextFunction) {
  try {
    const alarm = await alarmService.updateAlarmEnabled(
      req.userId!,
      getRequiredParam(req.params.id),
      req.body.enabled
    );
    return res.status(200).json(alarm);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAlarm(req: Request, res: Response, next: NextFunction) {
  try {
    await alarmService.deleteAlarm(req.userId!, getRequiredParam(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
