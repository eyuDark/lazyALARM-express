import { DayOfWeek, Prisma, ToneMode } from '@prisma/client';

import { AppError } from '../errors/app-error';
import { prisma } from '../lib/prisma';

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

function toTimeCreateManyData(times: AlarmTimeInput[]) {
  return times.map((time) => ({
    dayOfWeek: time.dayOfWeek,
    hour: time.hour,
    minute: time.minute,
  }));
}

async function ensureAlarmOwner(userId: string, id: string) {
  const alarm = await prisma.alarm.findFirst({
    where: { id, userId },
  });

  if (!alarm) {
    throw new AppError(404, 'Alarm not found');
  }

  return alarm;
}

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
