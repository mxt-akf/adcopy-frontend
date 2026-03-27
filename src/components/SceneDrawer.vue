<template>
  <el-drawer
    :model-value="modelValue"
    title="选择应用场景"
    direction="rtl"
    :size="drawerSize"
    :append-to-body="true"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="selector-body">
      <!-- 左栏：平台列表 -->
      <div class="plat-list">
        <div
          v-for="plat in platforms"
          :key="plat.id"
          class="plat-item"
          :class="{ 'is-active': activePlatId === plat.id }"
          :style="activePlatId === plat.id ? { '--accent': plat.dotColor } : {}"
          @click="activePlatId = plat.id"
        >
          <i class="plat-dot" :style="{ background: plat.dotColor }" />
          <span class="plat-name">{{ plat.name }}</span>
          <em class="plat-count">{{ plat.scenes?.length ?? 0 }}</em>
        </div>
      </div>

      <!-- 右栏：场景 chips -->
      <div class="scene-panel">
        <template v-if="activePlatform">
          <div class="scene-header">
            <span class="scene-header__title">{{ activePlatform.name }}</span>
            <span class="scene-header__count">{{ activePlatform.scenes?.length ?? 0 }} 个场景</span>
          </div>

          <transition name="fade" mode="out-in">
            <div :key="activePlatId" class="chip-grid">
              <span
                v-for="scene in activePlatform.scenes"
                :key="scene.name"
                class="chip"
                :class="{ 'chip--active': isActive(scene.name) }"
                :style="chipStyle(scene.name)"
                @click="handleChipClick(scene.name)"
              >
                {{ scene.name }}
              </span>
            </div>
          </transition>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <div class="footer-preview">
          <template v-if="tempSelected">
            <el-tag
              size="small"
              :style="{
                background: selectedPlatform?.tagBg,
                color: selectedPlatform?.tagColor,
                border: 'none',
                flexShrink: 0,
              }"
            >
              {{ selectedPlatform?.name }}
            </el-tag>
            <span class="preview-text">{{ tempSelected.scene }}</span>
          </template>
          <span v-else class="footer-hint">请在右侧点击选择一个场景</span>
        </div>
        <div class="footer-btns">
          <el-button @click="$emit('update:modelValue', false)">取消</el-button>
          <el-button type="primary" :disabled="!tempSelected" @click="handleConfirm">
            确认选择
          </el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useSceneConfig } from '@/composables/useSceneConfig'

const props = defineProps({
  modelValue: Boolean,
  selectedScene: { type: Object, default: null },
})
const emit = defineEmits(['update:modelValue', 'confirm'])

const { platforms, getPlatformById } = useSceneConfig()

const activePlatId = ref('')
const tempSelected = ref(null)

// 抽屉宽度：手机全屏，桌面 520px
const drawerSize = computed(() =>
  window.innerWidth <= 640 ? '100%' : '520px'
)

watch(platforms, (val) => {
  if (val.length && !activePlatId.value) {
    activePlatId.value = val[0].id
  }
}, { immediate: true })

watch(() => props.modelValue, (open) => {
  if (!open) return
  if (props.selectedScene) {
    activePlatId.value = props.selectedScene.platId
    tempSelected.value = { ...props.selectedScene }
  } else {
    activePlatId.value = platforms.value[0]?.id ?? ''
    tempSelected.value = null
  }
})

const activePlatform = computed(() => getPlatformById(activePlatId.value))
const selectedPlatform = computed(() =>
  tempSelected.value ? getPlatformById(tempSelected.value.platId) : null
)

function isActive(scene) {
  return tempSelected.value?.platId === activePlatId.value &&
    tempSelected.value?.scene === scene
}

function chipStyle(scene) {
  const plat = activePlatform.value
  if (!plat) return {}
  const base = {
    '--plat-color': plat.dotColor,
    '--plat-bg': plat.tagBg,
    '--plat-text': plat.tagColor,
  }
  if (isActive(scene)) {
    return { ...base, borderColor: plat.dotColor, background: plat.tagBg, color: plat.tagColor }
  }
  return base
}

function handleChipClick(scene) {
  tempSelected.value = { platId: activePlatId.value, scene }
}

function handleConfirm() {
  if (!tempSelected.value) return
  const plat = getPlatformById(tempSelected.value.platId)
  emit('confirm', {
    platId: tempSelected.value.platId,
    platName: plat.name,
    scene: tempSelected.value.scene,
    tagColor: plat.tagColor,
    tagBg: plat.tagBg,
    dotColor: plat.dotColor,
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
:deep(.el-drawer__body) { padding: 0; overflow: hidden; }

.selector-body { display: flex; height: 100%; overflow: hidden; }

.plat-list {
  width: 120px;
  flex-shrink: 0;
  border-right: 1px solid var(--el-border-color-lighter);
  overflow-y: auto;
  padding: 8px 0;
}

.plat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  transition: all 0.15s;
  position: relative;
  user-select: none;
}

.plat-item:hover:not(.is-active) { background: var(--el-fill-color-light); color: var(--el-text-color-primary); }
.plat-item.is-active { background: var(--el-fill-color-light); color: var(--el-text-color-primary); font-weight: 500; }
.plat-item.is-active::before {
  content: '';
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--accent);
}

.plat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.plat-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.plat-count { font-style: normal; font-size: 11px; color: var(--el-text-color-placeholder); flex-shrink: 0; }

.scene-panel { flex: 1; overflow-y: auto; padding: 12px; }

.scene-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 12px;
}

.scene-header__title { font-size: 13px; font-weight: 600; color: var(--el-text-color-primary); }
.scene-header__count { font-size: 12px; color: var(--el-text-color-placeholder); }

/* 手机两列，桌面三列 */
.chip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

@media (max-width: 640px) {
  .chip-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  height: 52px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-blank);
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
  user-select: none;
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
}

.chip:hover:not(.chip--active) { border-color: var(--plat-color); color: var(--plat-text); background: var(--plat-bg); }
.chip--active { font-weight: 500; box-shadow: 0 0 0 2px color-mix(in srgb, var(--plat-color) 25%, transparent); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.12s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.drawer-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; }
.footer-preview { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.preview-text { font-size: 13px; color: var(--el-text-color-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.footer-hint { font-size: 13px; color: var(--el-text-color-placeholder); }
.footer-btns { display: flex; gap: 8px; flex-shrink: 0; }
</style>