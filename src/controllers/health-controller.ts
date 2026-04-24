import { Request, Response } from "express";

// Health stays in the controller layer because it is a direct HTTP response
// and does not need any business logic service yet.
export function getHealth(_req: Request, res: Response) {
  return res.status(200).json({ ok: true, message: "Service is running 🚀" });
}
