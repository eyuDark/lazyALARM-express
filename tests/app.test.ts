import { createApp } from '../src/app';
import { openApiDocument } from '../src/docs/openapi';

describe('app boot', () => {
  it('creates an express app instance', () => {
    const app = createApp();

    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('builds the OpenAPI document', () => {
    expect(openApiDocument.info.title).toBe('lazyAlarm API');
    expect(openApiDocument.paths['/v1/health']).toBeDefined();
  });
});
