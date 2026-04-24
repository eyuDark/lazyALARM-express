import { Request } from 'express';
import { vi } from 'vitest';

vi.mock('../src/services/devices-service', () => ({
  deleteDevice: vi.fn(),
  upsertDevice: vi.fn(),
}));

import { createMockResponse } from './helpers';
import { deleteDevice, upsertDevice } from '../src/controllers/devices-controller';
import * as deviceService from '../src/services/devices-service';

describe('devices controller', () => {
  it('upserts a device', async () => {
    vi.mocked(deviceService.upsertDevice).mockResolvedValueOnce({
      id: 'device_1',
    } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await upsertDevice(
      {
        userId: 'user_1',
        body: {
          pushToken: 'push_1',
          platform: 'IOS',
          timezone: 'Africa/Addis_Ababa',
          tzOffsetMinutes: 180,
        },
      } as Request,
      response,
      next
    );

    expect(deviceService.upsertDevice).toHaveBeenCalledWith('user_1', expect.any(Object));
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it('deletes a device', async () => {
    vi.mocked(deviceService.deleteDevice).mockResolvedValueOnce(undefined);

    const response = createMockResponse();
    const next = vi.fn();

    await deleteDevice(
      { userId: 'user_1', params: { id: 'device_1' } } as unknown as Request,
      response,
      next
    );

    expect(deviceService.deleteDevice).toHaveBeenCalledWith('user_1', 'device_1');
    expect(response.status).toHaveBeenCalledWith(204);
  });
});
