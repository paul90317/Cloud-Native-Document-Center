import { removeLocalToken, setLocalToken } from "@/utils/storage";
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
    // clear token here and in local
    logout() {
      // Clear the token (pinia)
      this.token = null
      // Clear the token (localStorage)
      removeLocalToken()
    },
    // set token here and in local
    login(token) {
      this.token = token
      setLocalToken(token)
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