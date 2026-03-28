import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Toaster } from 'vue-sonner';

import App from './App.vue';
import { router } from './app/router';
import { enableMswIfNeeded } from './app/providers/msw';
import './style.css';

async function bootstrap() {
  await enableMswIfNeeded();

  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.component('AppToaster', Toaster);
  app.mount('#app');
}

void bootstrap();
