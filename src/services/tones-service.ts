import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

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
