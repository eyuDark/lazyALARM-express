import { NextFunction, Request, Response } from 'express';

import * as toneService from '../services/tones-service';

// Tone controllers only shape the request/response boundary. Services decide
// which tones are visible to a user and how new tones are stored.
export async function listTones(req: Request, res: Response, next: NextFunction) {
  try {
    const tones = await toneService.listTones(req.userId!, req.query.includeSystem as boolean | undefined);
    return res.status(200).json(tones);
  } catch (error) {
    return next(error);
  }
}

export async function createTone(req: Request, res: Response, next: NextFunction) {
  try {
    const tone = await toneService.createTone(req.userId!, req.body);
    return res.status(201).json(tone);
  } catch (error) {
    return next(error);
  }
}
