import { createApp } from './app';
import { env } from './config/env';

export function startServer() {
  const app = createApp();

  return app.listen(env.PORT, env.HOST, () => {
    console.log(`lazyALARM API listening on http://${env.HOST}:${env.PORT}`);
  });
}

if (require.main === module) {
  startServer();
}
