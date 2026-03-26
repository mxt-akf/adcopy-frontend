import { ref } from 'vue'

/**
 * 场景选择状态管理
 * selectedScene: { platId, platName, scene, tagColor, tagBg, dotColor } | null
 */
export function useScene() {
  const drawerVisible = ref(false)
  const selectedScene = ref(null)

  return {
    drawerVisible,
    selectedScene,
    openDrawer: () => { drawerVisible.value = true },
    confirmScene: (info) => { selectedScene.value = info },
  }
}