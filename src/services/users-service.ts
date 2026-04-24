import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}
