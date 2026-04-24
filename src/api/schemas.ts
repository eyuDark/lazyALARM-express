import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DayOfWeek, Platform, ToneMode } from '@prisma/client';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const userHeaderSchema = z
  .object({
    'x-user-id': z.string().min(1),
  })
  .openapi('UserHeader');

export const userHeaderDocSchema = z.object({
  'x-user-id': z.string().openapi({
    param: {
      name: 'x-user-id',
      in: 'header',
      required: true,
    },
    example: 'user_1',
  }),
});

export const userParamsSchema = z
  .object({
    id: z.string().min(1),
  })
  .openapi('EntityIdParams');

export const userParamsDocSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true,
    },
    example: 'entity_1',
  }),
});

export const createUserBodySchema = z
  .object({
    email: z.string().email().optional(),
  })
  .openapi('CreateUserBody');

export const userResponseSchema = z
  .object({
    id: z.string(),
    email: z.string().email().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('UserResponse');

export const upsertDeviceBodySchema = z
  .object({
    pushToken: z.string().min(1),
    platform: z.nativeEnum(Platform),
    timezone: z.string().min(1),
    tzOffsetMinutes: z.number().int(),
  })
  .openapi('UpsertDeviceBody');

export const deviceResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    pushToken: z.string(),
    platform: z.nativeEnum(Platform),
    timezone: z.string(),
    tzOffsetMinutes: z.number().int(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('DeviceResponse');

export const createToneBodySchema = z
  .object({
    name: z.string().min(1),
    url: z.string().url(),
  })
  .openapi('CreateToneBody');

export const toneResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string().nullable(),
    name: z.string(),
    url: z.string(),
    isSystem: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('ToneResponse');

export const listTonesQuerySchema = z
  .object({
    includeSystem: z.coerce.boolean().optional().default(true),
  })
  .openapi('ListTonesQuery');

export const alarmTimeSchema = z
  .object({
    dayOfWeek: z.nativeEnum(DayOfWeek),
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
  })
  .openapi('AlarmTime');

export const createAlarmBodySchema = z
  .object({
    label: z.string().min(1),
    timezone: z.string().min(1),
    enabled: z.boolean().default(true),
    toneMode: z.nativeEnum(ToneMode).default(ToneMode.FIXED),
    primaryToneId: z.string().optional(),
    escalateStepSec: z.number().int().positive().optional(),
    escalateMaxVolume: z.number().int().min(0).max(100).optional(),
    times: z.array(alarmTimeSchema).min(1),
  })
  .openapi('CreateAlarmBody');

export const updateAlarmBodySchema = createAlarmBodySchema.partial().openapi('UpdateAlarmBody');

export const patchAlarmEnabledBodySchema = z
  .object({
    enabled: z.boolean(),
  })
  .openapi('PatchAlarmEnabledBody');

export const alarmResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    label: z.string(),
    timezone: z.string(),
    enabled: z.boolean(),
    toneMode: z.nativeEnum(ToneMode),
    primaryToneId: z.string().nullable(),
    escalateStepSec: z.number().int().nullable(),
    escalateMaxVolume: z.number().int().nullable(),
    nextFireAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    times: z.array(
      z.object({
        id: z.number().int(),
        alarmId: z.string(),
        dayOfWeek: z.nativeEnum(DayOfWeek),
        hour: z.number().int(),
        minute: z.number().int(),
      })
    ),
  })
  .openapi('AlarmResponse');

export const validationErrorSchema = z
  .object({
    message: z.string(),
    details: z.unknown().optional(),
  })
  .openapi('ValidationError');

export const healthResponseSchema = z
  .object({
    ok: z.boolean(),
  })
  .openapi('HealthResponse');
