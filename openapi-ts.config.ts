import { defineConfig } from '@hey-api/openapi-ts';
import { OPENAPI_SCHEMA_URL } from './src/shared/config/api';

export default defineConfig({
  input: OPENAPI_SCHEMA_URL,
  output: 'src/openapi-gen',
  plugins: ['@hey-api/typescript'],
});
