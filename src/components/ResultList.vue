<template>
  <div class="result-list">
    <h2 class="panel-title">
      生成结果
      <el-tag v-if="results.length" size="small" style="margin-left: 8px">
        {{ results.length }} 条
      </el-tag>
      <el-tag
        v-if="sensitiveCount > 0"
        type="danger"
        size="small"
        style="margin-left: 6px"
      >
        {{ sensitiveCount }} 条含敏感词
      </el-tag>
    </h2>

    <el-empty
      v-if="!loading && !results.length"
      description="输入文案后点击裂变"
      :image-size="80"
    />

    <template v-if="loading">
      <el-skeleton
        v-for="n in pendingCount"
        :key="n"
        :rows="2"
        animated
        style="margin-bottom: 12px"
      />
    </template>

    <transition-group name="fade" tag="div">
      <el-card
        v-for="item in results"
        :key="item.index"
        class="result-card"
        :class="{ 'has-sensitive': item.sensitiveWords?.length }"
        shadow="never"
      >
        <div class="result-meta">
          <span class="result-index">#{{ item.index }}</span>
          <el-tag v-if="item.sensitiveWords?.length" type="danger" size="small">
            含敏感词 {{ item.sensitiveWords.length }}
          </el-tag>
          <el-tag v-else type="success" size="small">安全</el-tag>
        </div>

        <p class="result-text" v-html="highlightText(item.text, item.sensitiveWords)" />

        <div v-if="item.sensitiveWords?.length" class="sensitive-tags">
          <span class="sensitive-label">违禁词：</span>
          <el-tag
            v-for="sw in item.sensitiveWords"
            :key="sw.word"
            type="danger"
            size="small"
            style="margin-right: 4px"
          >
            {{ sw.word }}
          </el-tag>
        </div>

        <div class="result-actions">
          <el-button link size="small" @click="copyText(item.text)">复制</el-button>
        </div>
      </el-card>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  results: { type: Array, default: () => [] },
  loading: Boolean,
  pendingCount: { type: Number, default: 5 },
})

const sensitiveCount = computed(() =>
  props.results.filter(item => item.sensitiveWords?.length > 0).length,
)

function highlightText(text, sensitiveWords) {
  if (!sensitiveWords?.length) return escapeHtml(text)
  let result = escapeHtml(text)
  sensitiveWords.forEach(sw => {
    const escaped = escapeHtml(sw.word)
    result = result.replace(
      new RegExp(escaped, 'gi'),
      `<mark class="highlight">${escaped}</mark>`,
    )
  })
  return result
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function copyText(text) {
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制')
}
</script>

<style scoped>
.result-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.result-card {
  margin-bottom: 10px;
  border: 1px solid #e4e7ed !important;
  transition: border-color 0.2s;
}
.result-card.has-sensitive {
  border-left: 3px solid #f56c6c !important;
}
.result-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.result-index {
  font-size: 12px;
  color: #c0c4cc;
}
.result-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  margin: 0;
}
.sensitive-tags {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.sensitive-label {
  font-size: 12px;
  color: #909399;
}
.result-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
</style>

<style>
.highlight {
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 500;
}
</style>