import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({ timeout: 60000 })

http.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.message || err.message || '请求失败'
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export const generateCopy = (data) => http.post('/api/copy/generate', data)

export const detectCopy = (texts, platName) =>
  http.post('/api/copy/detect', { texts, platName })