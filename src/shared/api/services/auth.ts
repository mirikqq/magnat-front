import type { LoginRequest, LoginResponse, MeResponse } from '@/shared/api/contracts/request-response';
import { http } from '@/shared/api/http/client';

export const authService = {
  login(payload: LoginRequest) {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  me() {
    return http<MeResponse>('/auth/me');
  },
};
