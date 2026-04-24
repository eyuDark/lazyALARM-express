import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { v1Router } from './api/routes';
import { openApiDocument } from './docs/openapi';
import { errorHandler } from './middleware/error-handler';
import { notFoundMiddleware } from './middleware/not-found';
import { requestContextMiddleware } from './middleware/request-context';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(requestContextMiddleware);

  app.get('/docs.json', (_req, res) => {
    res.json(openApiDocument);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use('/v1', v1Router);
  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
