import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: {
      id: 1,
      phone: '+79990000000',
      fio: 'Admin User',
      role: 'admin' as const,
      cabinet_id: 1,
    },
    bypassAuth: true,
  }),
});
