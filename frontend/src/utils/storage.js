import Cookies from 'js-cookie';

const TOKEN = "DEFAULT_TOKEN"

export const setLocalToken = (token) => {
  // localStorage.setItem(TOKEN, token)
  var in30Minutes = 1 / 48;
  Cookies.set(TOKEN, token, { expires: in30Minutes })
}

export const getLocalToken = () => {
  // return localStorage.getItem(TOKEN)
  return Cookies.get(TOKEN) || null
}

export const removeLocalToken = () => {
  // localStorage.removeItem(TOKEN)
  Cookies.remove(TOKEN)
}
