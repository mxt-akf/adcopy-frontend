import { ref } from 'vue'
import { generateCopy } from '@/api/copy'

export function useCopyGen() {
  const loading = ref(false)
  const result = ref([])   // [{ index, text, sensitiveWords }]
  const error = ref(null)

  async function generate(payload) {
    loading.value = true
    error.value = null
    result.value = []
    try {
      const res = await generateCopy(payload)
      result.value = res.data?.items ?? []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { loading, result, error, generate }
}