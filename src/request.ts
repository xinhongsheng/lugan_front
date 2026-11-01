import axios from 'axios'
import { message } from 'ant-design-vue'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 300000,
})

request.interceptors.response.use(
  (response) => {
    const skipAuthRedirect = (response.config as { skipAuthRedirect?: boolean }).skipAuthRedirect
    if (response.data?.code === 40100 && !skipAuthRedirect) {
      message.warning('请先登录')
      const redirect = encodeURIComponent(window.location.pathname + window.location.search)
      if (!window.location.pathname.startsWith('/user/login')) {
        window.location.href = `/user/login?redirect=${redirect}`
      }
    }
    return response
  },
  (error) => Promise.reject(error),
)

export default request
