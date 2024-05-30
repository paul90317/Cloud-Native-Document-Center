import { removeLocalToken } from "@/utils/storage";
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
    logout() {
      // Clear the token (pinia)
      this.token = null
      // Clear the token (localStorage)
      removeLocalToken()
    }
  },
  getters: {
    hasToken() {
      return !!this.token
    },

    getAccessToken() {
      return this.token
    },
  },
})