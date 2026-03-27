<template>
  <transition name="banner-slide">
    <div v-if="visible" class="welcome-banner">
      <div class="banner-content">
        <span class="banner-icon">💡</span>
        <div class="banner-steps">
          <span class="step"><em>①</em> 选择平台场景</span>
          <span class="divider" />
          <span class="step"><em>②</em> 填写文案信息（原始文案可留空）</span>
          <span class="divider" />
          <span class="step"><em>③</em> 一键裂变，按需检测违禁词</span>
        </div>
      </div>
      <el-button class="banner-close" text @click="dismiss">知道了 ×</el-button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const STORAGE_KEY = 'adcopy_welcome_dismissed'
const visible = ref(!localStorage.getItem(STORAGE_KEY))

function dismiss() {
  localStorage.setItem(STORAGE_KEY, '1')
  visible.value = false
}
</script>

<style scoped>
.welcome-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 24px;
  background: #ecf5ff;
  border-bottom: 1px solid #b3d8ff;
  flex-wrap: wrap;
}

.banner-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.banner-icon {
  font-size: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.banner-steps {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.step {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

.step em {
  font-style: normal;
  font-weight: 600;
  color: #409eff;
  margin-right: 3px;
}

.divider {
  width: 1px;
  height: 12px;
  background: #c6e2ff;
  flex-shrink: 0;
}

.banner-close {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  padding: 0;
}

.banner-close:hover { color: #606266; }

.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.banner-slide-enter-to,
.banner-slide-leave-from {
  opacity: 1;
  max-height: 80px;
}

@media (max-width: 640px) {
  .welcome-banner {
    padding: 10px 16px;
  }

  /* 手机隐藏分隔线，步骤竖排 */
  .divider {
    display: none;
  }

  .banner-steps {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>