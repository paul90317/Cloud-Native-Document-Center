const TOKEN = "DEFAULT_TOKEN"

export const setLocalToken = (token) => {
  localStorage.setItem(TOKEN, token)
}

export const getLocalToken = () => {
  return localStorage.getItem(TOKEN)
}

export const removeLocalToken = () => {
  localStorage.removeItem(TOKEN)
}
