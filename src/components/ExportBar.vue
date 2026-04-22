<template>
  <div class="export-bar">
    <el-button :disabled="!results.length" @click="handleExport('csv')">
      <el-icon><Download /></el-icon>导出 CSV
    </el-button>
    <el-button :disabled="!results.length" @click="handleExport('txt')">
      <el-icon><Document /></el-icon>导出 TXT
    </el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Download, Document } from '@element-plus/icons-vue'

const props = defineProps({
  results: { type: Array, default: () => [] },
})

function escapeCsvCell(value) {
  const str = String(value ?? '')
  return `"${str.replace(/"/g, '""')}"`
}

function handleExport(type) {
  if (!props.results.length) {
    ElMessage.warning('暂无文案可导出')
    return
  }

  if (type === 'txt') {
    const content = props.results.map(item => `${item.index}. ${item.text}`).join('\n')
    downloadFile(content, 'adcopy-result.txt', 'text/plain;charset=utf-8;', false)
  } else {
    const rows = [
      ['序号', '文案内容', '敏感词'].map(escapeCsvCell),
      ...props.results.map(item => [
        escapeCsvCell(item.index),
        escapeCsvCell(item.text),
        escapeCsvCell(item.sensitiveWords?.map(w => w.word).join('|') ?? ''),
      ]),
    ]
    downloadFile(
      rows.map(r => r.join(',')).join('\r\n'),
      'adcopy-result.csv',
      'text/csv;charset=utf-8;',
      true,
    )
  }

  ElMessage.success('导出成功')
}

function downloadFile(content, filename, mime, bom = false) {
  const parts = bom ? ['\uFEFF', content] : [content]
  const blob = new Blob(parts, { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.export-bar {
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
}
</style>