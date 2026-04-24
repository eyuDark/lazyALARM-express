import { NextFunction, Request, Response } from 'express';

import * as deviceService from '../services/devices-service';

// Express params can arrive in a few shapes, so controllers normalize them
// before handing clean values to the service layer.
function getRequiredParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

// Controllers stay thin here: they trust validated input and delegate device
// ownership rules and persistence work to the service.
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
