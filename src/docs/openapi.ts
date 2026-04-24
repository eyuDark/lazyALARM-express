import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import {
  alarmResponseSchema,
  createAlarmBodySchema,
  createToneBodySchema,
  createUserBodySchema,
  deviceResponseSchema,
  healthResponseSchema,
  patchAlarmEnabledBodySchema,
  toneResponseSchema,
  updateAlarmBodySchema,
  upsertDeviceBodySchema,
  userHeaderDocSchema,
  userParamsDocSchema,
  userResponseSchema,
  validationErrorSchema,
} from '../api/schemas';

const registry = new OpenAPIRegistry();

registry.registerPath({
  method: 'get',
  path: '/v1/health',
  responses: {
    200: {
      description: 'Health check',
      content: { 'application/json': { schema: healthResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/users',
  request: {
    body: {
      content: { 'application/json': { schema: createUserBodySchema } },
    },
  },
  responses: {
    201: {
      description: 'Created user',
      content: { 'application/json': { schema: userResponseSchema } },
    },
    409: {
      description: 'Conflict',
      content: { 'application/json': { schema: validationErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/devices',
  request: {
    headers: userHeaderDocSchema,
    body: {
      content: { 'application/json': { schema: upsertDeviceBodySchema } },
    },
  },
  responses: {
    201: {
      description: 'Upserted device',
      content: { 'application/json': { schema: deviceResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/v1/devices/{id}',
  request: {
    headers: userHeaderDocSchema,
    params: userParamsDocSchema,
  },
  responses: {
    204: {
      description: 'Deleted device',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/tones',
  request: {
    headers: userHeaderDocSchema,
  },
  responses: {
    200: {
      description: 'List tones',
      content: { 'application/json': { schema: toneResponseSchema.array() } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/tones',
  request: {
    headers: userHeaderDocSchema,
    body: {
      content: { 'application/json': { schema: createToneBodySchema } },
    },
  },
  responses: {
    201: {
      description: 'Created tone',
      content: { 'application/json': { schema: toneResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/alarms',
  request: {
    headers: userHeaderDocSchema,
  },
  responses: {
    200: {
      description: 'List alarms',
      content: { 'application/json': { schema: alarmResponseSchema.array() } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/alarms',
  request: {
    headers: userHeaderDocSchema,
    body: {
      content: { 'application/json': { schema: createAlarmBodySchema } },
    },
  },
  responses: {
    201: {
      description: 'Created alarm',
      content: { 'application/json': { schema: alarmResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/v1/alarms/{id}',
  request: {
    headers: userHeaderDocSchema,
    params: userParamsDocSchema,
    body: {
      content: { 'application/json': { schema: updateAlarmBodySchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated alarm',
      content: { 'application/json': { schema: alarmResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/v1/alarms/{id}/enabled',
  request: {
    headers: userHeaderDocSchema,
    params: userParamsDocSchema,
    body: {
      content: { 'application/json': { schema: patchAlarmEnabledBodySchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated alarm enabled state',
      content: { 'application/json': { schema: alarmResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/v1/alarms/{id}',
  request: {
    headers: userHeaderDocSchema,
    params: userParamsDocSchema,
  },
  responses: {
    204: {
      description: 'Deleted alarm',
    },
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'lazyAlarm API',
    version: '1.0.0',
  },
});
