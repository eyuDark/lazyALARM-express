import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

// Tone services keep the "system tones + my tones" rule in one place so route
// handlers do not have to know how visibility works.
export async function listTones(userId: string, includeSystem = true) {
  return prisma.tone.findMany({
    where: includeSystem
      ? {
          OR: [{ isSystem: true }, { userId }],
        }
      : {
          userId,
        },
    orderBy: { name: 'asc' },
  });
}

export async function createTone(userId: string, data: Omit<Prisma.ToneUncheckedCreateInput, 'userId' | 'isSystem'>) {
  return prisma.tone.create({
    data: {
      ...data,
      userId,
      isSystem: false,
    },
  });
}
