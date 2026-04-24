import { Request } from 'express';
import { vi } from 'vitest';

import { createUserBodySchema } from '../src/api/schemas';
import { AppError } from '../src/errors/app-error';
import { notFoundMiddleware } from '../src/middleware/not-found';
import { requireUserMiddleware } from '../src/middleware/require-user';
import { validateRequest } from '../src/middleware/validate';

describe('middleware', () => {
  it('rejects missing x-user-id', () => {
    const next = vi.fn();

    requireUserMiddleware({} as Request, {} as never, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0]?.[0] as AppError).statusCode).toBe(401);
  });

  it('rejects invalid request bodies', () => {
    const next = vi.fn();
    const middleware = validateRequest({ body: createUserBodySchema });

    middleware({ body: { email: 'bad-email' } } as Request, {} as never, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0]?.[0] as AppError).statusCode).toBe(400);
  });

  it('returns a 404 app error for unknown routes', () => {
    const next = vi.fn();

    notFoundMiddleware({} as Request, {} as never, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next.mock.calls[0]?.[0] as AppError).statusCode).toBe(404);
  });
});
