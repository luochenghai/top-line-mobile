/**
 * 优化-封装 user 模块专门处理本地存储中的 user
*/
const USER_KEY = 'haha'
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))

export const saveUser = (data) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const deleteUser = data => {
  window.localStorage.removeItem(data)
}
