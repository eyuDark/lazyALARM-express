import { Request } from 'express';
import { vi } from 'vitest';

vi.mock('../src/services/tones-service', () => ({
  createTone: vi.fn(),
  listTones: vi.fn(),
}));

import { createMockResponse } from './helpers';
import { createTone, listTones } from '../src/controllers/tones-controller';
import * as toneService from '../src/services/tones-service';

describe('tones controller', () => {
  it('lists tones', async () => {
    vi.mocked(toneService.listTones).mockResolvedValueOnce([] as never);

    const response = createMockResponse();
    const next = vi.fn();

    await listTones(
      { userId: 'user_1', query: { includeSystem: true } } as unknown as Request,
      response,
      next
    );

    expect(toneService.listTones).toHaveBeenCalledWith('user_1', true);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('creates a tone', async () => {
    vi.mocked(toneService.createTone).mockResolvedValueOnce({ id: 'tone_1' } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await createTone(
      { userId: 'user_1', body: { name: 'Bell', url: 'https://example.com/bell.mp3' } } as Request,
      response,
      next
    );

    expect(toneService.createTone).toHaveBeenCalledWith('user_1', {
      name: 'Bell',
      url: 'https://example.com/bell.mp3',
    });
    expect(response.status).toHaveBeenCalledWith(201);
  });
});
