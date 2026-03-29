import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://46.254.17.203/api/openapi.json',
  output: 'src/openapi-gen',
  plugins: ['@hey-api/typescript'],
});
