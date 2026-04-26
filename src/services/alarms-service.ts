import { DayOfWeek, Prisma, ToneMode } from '@prisma/client';

import { AppError } from '../errors/app-error';
import { prisma } from '../lib/prisma';

// These inputs mirror the validated request shape so services can stay typed
// without depending on Express request objects.
type AlarmTimeInput = {
  dayOfWeek: DayOfWeek;
  hour: number;
  minute: number;
};

type CreateAlarmInput = {
  label: string;
  timezone: string;
  enabled?: boolean;
  toneMode?: ToneMode;
  primaryToneId?: string;
  escalateStepSec?: number;
  escalateMaxVolume?: number;
  times: AlarmTimeInput[];
};

type UpdateAlarmInput = Partial<CreateAlarmInput>;

// Prisma createMany wants a flat array, so we normalize alarm-time payloads in
// one helper instead of repeating that mapping in multiple service methods.
function toTimeCreateManyData(times: AlarmTimeInput[]) {
  return times.map((time) => ({
    dayOfWeek: time.dayOfWeek,
    hour: time.hour,
    minute: time.minute,
  }));
}

// Ownership checks live in the service layer because they are business rules,
// not controller concerns.
async function ensureAlarmOwner(userId: string, id: string) {
  const alarm = await prisma.alarm.findFirst({
    where: { id, userId },
  });

  if (!alarm) {
    throw new AppError(404, 'Alarm not found');
  }

  return alarm;
}

// Alarm services centralize the important wake-up logic: creating schedules,
// replacing times, toggling enabled state, and enforcing ownership.
export async function listAlarms(userId: string) {
  return prisma.alarm.findMany({
    where: { userId },
    include: { times: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAlarm(userId: string, data: CreateAlarmInput) {
  const createData: Prisma.AlarmUncheckedCreateInput = {
    userId,
    label: data.label,
    timezone: data.timezone,
    enabled: data.enabled ?? true,
    toneMode: data.toneMode ?? ToneMode.FIXED,
    ...(data.primaryToneId ? { primaryToneId: data.primaryToneId } : {}),
    ...(data.escalateStepSec !== undefined ? { escalateStepSec: data.escalateStepSec } : {}),
    ...(data.escalateMaxVolume !== undefined ? { escalateMaxVolume: data.escalateMaxVolume } : {}),
  };

  return prisma.alarm.create({
    data: {
      ...createData,
      times: {
        createMany: {
          data: toTimeCreateManyData(data.times),
        },
      },
    },
    include: { times: true },
  });
}

export async function updateAlarm(userId: string, id: string, data: UpdateAlarmInput) {
  await ensureAlarmOwner(userId, id);

  const updateData: Prisma.AlarmUncheckedUpdateInput = {
    ...(data.label !== undefined ? { label: data.label } : {}),
    ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
    ...(data.enabled !== undefined ? { enabled: data.enabled } : {}),
    ...(data.toneMode !== undefined ? { toneMode: data.toneMode } : {}),
    ...(data.primaryToneId !== undefined ? { primaryToneId: data.primaryToneId } : {}),
    ...(data.escalateStepSec !== undefined ? { escalateStepSec: data.escalateStepSec } : {}),
    ...(data.escalateMaxVolume !== undefined ? { escalateMaxVolume: data.escalateMaxVolume } : {}),
  };

  return prisma.alarm.update({
    where: { id },
    data: {
      ...(updateData as Prisma.AlarmUncheckedUpdateInput),
      ...(data.times
        ? {
            times: {
              deleteMany: {},
              createMany: {
                data: toTimeCreateManyData(data.times),
              },
            },
          }
        : {}),
    },
    include: { times: true },
  });
}

export async function updateAlarmEnabled(userId: string, id: string, enabled: boolean) {
  await ensureAlarmOwner(userId, id);

  return prisma.alarm.update({
    where: { id },
    data: { enabled },
    include: { times: true },
  });
}

export async function deleteAlarm(userId: string, id: string) {
  await ensureAlarmOwner(userId, id);

  await prisma.alarm.delete({
    where: { id },
  });
}
