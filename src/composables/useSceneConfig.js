import { ref } from "vue";
import { ElMessage } from "element-plus";
import { getScenes } from "@/api/scenes";
import { platformMeta } from "@/data/scenes";

// 模块级缓存，全局只请求一次
const platforms = ref([]);
const loaded = ref(false);
const loading = ref(false);

export function useSceneConfig() {
  async function load() {
    if (loaded.value || loading.value) return;
    loading.value = true;
    try {
      const res = await getScenes();
      const list = Array.isArray(res) ? res : (res.data ?? []);
      platforms.value = list.map((plat) => ({
        ...plat,
        ...(platformMeta[plat.id] ?? {}),
      }));
      loaded.value = true;
    } catch {
      ElMessage.error('场景配置加载失败，请刷新页面重试')
    } finally {
      loading.value = false;
    }
  }

  function getPlatformById(id) {
    return platforms.value.find((p) => p.id === id);
  }

  function getFields(platId, sceneName) {
    return (
      getPlatformById(platId)?.scenes.find((s) => s.name === sceneName)
        ?.fields ?? []
    );
  }

  function getRiskLevel(platId, sceneName) {
    return (
      getPlatformById(platId)?.scenes.find((s) => s.name === sceneName)
        ?.riskLevel ?? "low"
    );
  }

  function getConfig(platId, sceneName) {
    const plat = platforms.value.find((p) => p.id === platId);
    return plat?.scenes.find((s) => s.name === sceneName) ?? null;
  }

  return {
    platforms,
    loaded,
    loading,
    load,
    getPlatformById,
    getFields,
    getRiskLevel,
    getConfig,
  };
}
