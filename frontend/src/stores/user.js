import { defineStore } from "pinia";

// * use guide: https://pinia.vuejs.org/zh/core-concepts/
export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token
    },
  },
  getters: {
    hasToken() {
      return !!this.token
    },

    getAccessToken() {
      return this.token
    }
  },
})
