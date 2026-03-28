import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8000/api/docs/openapi.json',
  output: 'src/shared/api/generated',
  client: 'fetch',
  plugins: ['@hey-api/typescript'],
});
