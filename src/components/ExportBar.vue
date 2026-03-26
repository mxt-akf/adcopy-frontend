<template>
  <div class="export-bar">
    <el-button @click="handleExport('csv')">导出 CSV</el-button>
    <el-button @click="handleExport('txt')">导出 TXT</el-button>
  </div>
</template>

<script setup>
const props = defineProps({
  results: { type: Array, default: () => [] },
})

function handleExport(type) {
  if (!props.results.length) return

  if (type === 'txt') {
    const content = props.results.map((item, i) => `${i + 1}. ${item.text}`).join('\n')
    downloadFile(content, 'adcopy-result.txt', 'text/plain')
  } else {
    const rows = [
      ['"序号"', '"文案内容"', '"敏感词"'],
      ...props.results.map(item => [
        item.index,
        `"${item.text}"`,
        `"${item.sensitiveWords?.map(w => w.word).join('|') ?? ''}"`,
      ]),
    ]
    downloadFile(
      rows.map(r => r.join(',')).join('\n'),
      'adcopy-result.csv',
      'text/csv;charset=utf-8;',
    )
  }
}

function downloadFile(content, filename, mime) {
  const blob = new Blob(['\uFEFF' + content], { type: mime })
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