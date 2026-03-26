<template>
  <div class="layout">
    <header class="header">
      <span class="logo">AdCopy AI</span>
      <span class="sub">广告文案裂变工具</span>
    </header>

    <main class="main">
      <InputPanel
        :selected-scene="selectedScene"
        :loading="loading"
        @open-drawer="drawerVisible = true"
        @generate="handleGenerate"
      />

      <section class="panel right-panel">
        <ResultList
          :results="result"
          :loading="loading"
          :pending-count="pendingCount"
        />
        <ExportBar v-if="result.length" :results="result" />
      </section>
    </main>

    <SceneDrawer
      v-model="drawerVisible"
      :selected-scene="selectedScene"
      @confirm="confirmScene"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputPanel from '@/components/InputPanel.vue'
import ResultList from '@/components/ResultList.vue'
import ExportBar from '@/components/ExportBar.vue'
import SceneDrawer from '@/components/SceneDrawer.vue'
import { useCopyGen } from '@/composables/useCopyGen'
import { useScene } from '@/composables/useScene'

const { loading, result, generate } = useCopyGen()
const { drawerVisible, selectedScene, confirmScene } = useScene()

// 记录本次生成数量，用于 skeleton 占位
const pendingCount = ref(5)

async function handleGenerate(formData) {
  pendingCount.value = formData.count
  await generate(formData)
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}
.header {
  padding: 16px 32px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}
.sub {
  font-size: 13px;
  color: #909399;
}
.main {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 24px 32px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.panel {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e4e7ed;
}
.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
</style>