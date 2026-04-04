import type { AuthLoginIn, AuthMeOut, AuthTokenOut } from '@/openapi-gen/types.gen'
import { AUTH_LOGIN } from '@/shared/constants/auth'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildMockUser(): AuthMeOut {
  return {
    id: 1,
    phone: AUTH_LOGIN.phone,
    fio: 'Integro Admin',
    selected_cabinet_id: 1,
    cabinets: [
      { id: 1, name: 'Integro', mp: 'ozon', role: 'admin' },
    ],
  }
}

export const mockAuthService = {
  async login(payload: AuthLoginIn): Promise<AuthTokenOut> {
    await wait(260)

    if (payload.phone !== AUTH_LOGIN.phone || payload.password !== AUTH_LOGIN.password) {
      throw new Error('Неверный телефон или пароль')
    }

    return {
      access_token: 'integro-mock-token',
      token_type: 'bearer',
    }
  },

  async me(token: string | null): Promise<AuthMeOut | null> {
    if (!token) {
      return null
    }

    await wait(280)

    if (token !== 'integro-mock-token') {
      throw new Error('Сессия недействительна')
    }

    return buildMockUser()
  },
}