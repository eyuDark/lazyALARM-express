import { Request } from 'express';
import { vi } from 'vitest';

vi.mock('../src/services/users-service', () => ({
  createUser: vi.fn(),
}));

import { createMockResponse } from './helpers';
import { createUser } from '../src/controllers/users-controller';
import * as userService from '../src/services/users-service';

describe('users controller', () => {
  it('creates a user', async () => {
    vi.mocked(userService.createUser).mockResolvedValueOnce({
      id: 'user_1',
      email: 'hello@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await createUser({ body: { email: 'hello@example.com' } } as Request, response, next);

    expect(userService.createUser).toHaveBeenCalledWith({ email: 'hello@example.com' });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });
});
