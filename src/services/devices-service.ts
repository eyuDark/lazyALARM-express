import { Prisma } from '@prisma/client';

import { AppError } from '../errors/app-error';
import { prisma } from '../lib/prisma';

// Device services protect the ownership boundary so one user cannot update or
// delete another user's registered push device.
export async function upsertDevice(userId: string, data: Omit<Prisma.DeviceUncheckedCreateInput, 'userId'>) {
  return prisma.device.upsert({
    where: {
      userId_pushToken: {
        userId,
        pushToken: data.pushToken,
      },
    },
    update: {
      platform: data.platform,
      timezone: data.timezone,
      tzOffsetMinutes: data.tzOffsetMinutes,
    },
    create: {
      ...data,
      userId,
    },
  });
}

export async function deleteDevice(userId: string, id: string) {
  const device = await prisma.device.findFirst({
    where: { id, userId },
  });

  if (!device) {
    throw new AppError(404, 'Device not found');
  }

  await prisma.device.delete({
    where: { id },
  });
}
