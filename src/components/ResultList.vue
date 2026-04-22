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

      <!-- 高风险场景提示 + 批量检测入口 -->
      <template v-if="results.length">
        <el-tooltip
          v-if="isHighRisk"
          content="此场景建议检测违禁词后再投放"
          placement="top"
        >
          <el-tag
            type="warning"
            size="small"
            style="margin-left: 6px; cursor: default"
          >
            高风险场景
          </el-tag>
        </el-tooltip>
        <el-button
          size="small"
          :loading="detecting"
          style="margin-left: auto"
          @click="handleDetectAll"
        >
          {{ detecting ? "检测中..." : "检测全部违禁词" }}
        </el-button>
      </template>
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
          <template v-if="item.detected">
            <el-tag
              v-if="item.sensitiveWords?.length"
              type="danger"
              size="small"
            >
              含敏感词 {{ item.sensitiveWords.length }}
            </el-tag>
            <el-tag v-else type="success" size="small">安全</el-tag>
          </template>
          <el-tag v-else size="small" type="info">未检测</el-tag>
        </div>

        <p
          class="result-text"
          v-html="highlightText(item.text, item.sensitiveWords)"
        />

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
          <!-- 单条检测 -->
          <el-button
            link
            size="small"
            :loading="item.detecting"
            @click="handleDetectOne(item)"
          >
            检测违禁词
          </el-button>
          <el-button link size="small" @click="copyText(item.text)"
            >复制</el-button
          >
        </div>
      </el-card>
    </transition-group>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { detectCopy } from "@/api/copy";
import { useSceneConfig } from "@/composables/useSceneConfig";

const props = defineProps({
  results: { type: Array, default: () => [] },
  loading: Boolean,
  pendingCount: { type: Number, default: 5 },
  selectedScene: { type: Object, default: null },
});

const { getRiskLevel } = useSceneConfig();

const detecting = ref(false);

const isHighRisk = computed(() => {
  if (!props.selectedScene) return false;
  return (
    getRiskLevel(props.selectedScene.platId, props.selectedScene.scene) ===
    "high"
  );
});

const sensitiveCount = computed(
  () => props.results.filter((item) => item.sensitiveWords?.length > 0).length,
);

// 批量检测全部
async function handleDetectAll() {
  if (!props.results.length || detecting.value) return;
  detecting.value = true;
  try {
    const texts = props.results.map((item) => item.text);
    const res = await detectCopy(texts, props.selectedScene?.platName);
    const detectionMap = Object.fromEntries(
      (res.data?.items ?? []).map((d) => [d.index, d.sensitiveWords]),
    );
    props.results.forEach((item) => {
      item.sensitiveWords = detectionMap[item.index] ?? [];
      item.detected = true;
    });
  } finally {
    detecting.value = false;
  }
}

// 单条检测
async function handleDetectOne(item) {
  if (item.detecting) return;
  item.detecting = true;
  try {
    const res = await detectCopy([item.text], props.selectedScene?.platName);
    const first = res.data?.items?.[0];
    item.sensitiveWords = first?.sensitiveWords ?? [];
    item.detected = true;
  } finally {
    item.detecting = false;
  }
}

function highlightText(text, sensitiveWords) {
  let result = escapeHtml(text)
    .replace(/\n+/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  if (!sensitiveWords?.length) return result
  sensitiveWords.forEach(sw => {
    const escaped = escapeHtml(sw.word)
    const pattern = escapeRegExp(escaped)
    result = result.replace(
      new RegExp(pattern, 'gi'),
      `<mark class="highlight">${escaped}</mark>`,
    )
  })
  return result
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success("已复制")
  } catch {
    ElMessage.error("复制失败，请手动复制")
  }
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
  line-height: 1.9; /* 原来是 1.6 */
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
  gap: 8px;
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
