import { Request } from 'express';
import { vi } from 'vitest';

vi.mock('../src/services/alarms-service', () => ({
  createAlarm: vi.fn(),
  deleteAlarm: vi.fn(),
  listAlarms: vi.fn(),
  updateAlarm: vi.fn(),
  updateAlarmEnabled: vi.fn(),
}));

import { createMockResponse } from './helpers';
import {
  createAlarm,
  deleteAlarm,
  listAlarms,
  patchAlarmEnabled,
  updateAlarm,
} from '../src/controllers/alarms-controller';
import * as alarmService from '../src/services/alarms-service';

describe('alarms controller', () => {
  it('lists alarms', async () => {
    vi.mocked(alarmService.listAlarms).mockResolvedValueOnce([] as never);

    const response = createMockResponse();
    const next = vi.fn();

    await listAlarms({ userId: 'user_1' } as Request, response, next);

    expect(alarmService.listAlarms).toHaveBeenCalledWith('user_1');
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('creates an alarm', async () => {
    vi.mocked(alarmService.createAlarm).mockResolvedValueOnce({ id: 'alarm_1' } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await createAlarm(
      {
        userId: 'user_1',
        body: {
          label: 'Wake up',
          timezone: 'Africa/Addis_Ababa',
          enabled: true,
          toneMode: 'FIXED',
          times: [{ dayOfWeek: 'MON', hour: 6, minute: 30 }],
        },
      } as Request,
      response,
      next
    );

    expect(alarmService.createAlarm).toHaveBeenCalledWith('user_1', expect.any(Object));
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it('updates an alarm', async () => {
    vi.mocked(alarmService.updateAlarm).mockResolvedValueOnce({ id: 'alarm_1' } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await updateAlarm(
      { userId: 'user_1', params: { id: 'alarm_1' }, body: { label: 'Later wake up' } } as unknown as Request,
      response,
      next
    );

    expect(alarmService.updateAlarm).toHaveBeenCalledWith('user_1', 'alarm_1', {
      label: 'Later wake up',
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('patches enabled state', async () => {
    vi.mocked(alarmService.updateAlarmEnabled).mockResolvedValueOnce({ id: 'alarm_1' } as never);

    const response = createMockResponse();
    const next = vi.fn();

    await patchAlarmEnabled(
      { userId: 'user_1', params: { id: 'alarm_1' }, body: { enabled: false } } as unknown as Request,
      response,
      next
    );

    expect(alarmService.updateAlarmEnabled).toHaveBeenCalledWith('user_1', 'alarm_1', false);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('deletes an alarm', async () => {
    vi.mocked(alarmService.deleteAlarm).mockResolvedValueOnce(undefined);

    const response = createMockResponse();
    const next = vi.fn();

    await deleteAlarm(
      { userId: 'user_1', params: { id: 'alarm_1' } } as unknown as Request,
      response,
      next
    );

    expect(alarmService.deleteAlarm).toHaveBeenCalledWith('user_1', 'alarm_1');
    expect(response.status).toHaveBeenCalledWith(204);
  });
});
