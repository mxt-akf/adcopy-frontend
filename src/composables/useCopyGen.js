import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateCopy } from '@/api/copy'

export function useCopyGen() {
  const loading = ref(false)
  const result = ref([])

  async function generate(payload) {
    loading.value = true
    result.value = []
    try {
      const res = await generateCopy(payload)
      const items = res.data?.items ?? []
      if (!items.length) {
        ElMessage.warning('未生成任何内容，请检查输入或稍后重试')
      }
      result.value = items
    } catch (e) {
      // copy.js interceptor already shows ElMessage for most errors;
      // this catches network-level or unhandled failures
      if (!e.response) {
        ElMessage.error('网络异常，请检查连接后重试')
      }
    } finally {
      loading.value = false
    }
  }

  return { loading, result, generate }
}