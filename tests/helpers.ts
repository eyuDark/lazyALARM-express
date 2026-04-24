import { Response } from 'express';
import { vi } from 'vitest';

export function createMockResponse() {
  const response = {} as Response;

  response.status = vi.fn().mockReturnValue(response);
  response.json = vi.fn().mockReturnValue(response);
  response.send = vi.fn().mockReturnValue(response);

  return response;
}
