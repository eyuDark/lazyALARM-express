import { NextFunction, Request, Response } from 'express';

import * as deviceService from '../services/devices-service';

function getRequiredParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export async function upsertDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const device = await deviceService.upsertDevice(req.userId!, req.body);
    return res.status(201).json(device);
  } catch (error) {
    return next(error);
  }
}

export async function deleteDevice(req: Request, res: Response, next: NextFunction) {
  try {
    await deviceService.deleteDevice(req.userId!, getRequiredParam(req.params.id));
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
