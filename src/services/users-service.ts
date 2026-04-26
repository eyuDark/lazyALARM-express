import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma';

// Services own application work. This one is simple today, but keeping it
// separate means auth or onboarding rules can grow here later.
export async function createUser(data: Prisma.UserCreateInput) {
  return prisma.user.create({
    data,
  });
}
