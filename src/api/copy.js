import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({ timeout: 60000 })

http.interceptors.response.use(
  res => res.data,
  err => {
    const status = err.response?.status
    // 429 单独提示，其他走通用报错
    const msg = status === 429
      ? '操作太频繁，请稍等一分钟'
      : err.response?.data?.message || err.message || '请求失败'
    ElMessage.error(msg)
    return Promise.reject(err)
  }
)

export const generateCopy = (data) => http.post('/api/copy/generate', data)

export const detectCopy = (texts, platName) =>
  http.post('/api/copy/detect', { texts, platName })