<template>
  <section class="panel left-panel">
    <h2 class="panel-title">原始文案</h2>

    <el-form label-position="top" @submit.prevent>
      <el-form-item label="应用场景">
        <div class="scene-trigger" @click="$emit('open-drawer')">
          <template v-if="selectedScene">
            <el-tag
              size="small"
              :style="{
                background: selectedScene.tagBg,
                color: selectedScene.tagColor,
                border: 'none',
                flexShrink: 0,
              }"
            >
              {{ selectedScene.platName }}
            </el-tag>
            <span class="scene-name">{{ selectedScene.scene }}</span>
          </template>
          <span v-else class="scene-placeholder">
            点击选择场景（Amazon / TikTok / FB / Shopify）
          </span>
          <el-icon class="scene-arrow"><ArrowRight /></el-icon>
        </div>
      </el-form-item>

      <!-- 全动态字段 -->
      <template v-if="sceneFields.length">
        <template v-for="field in sceneFields" :key="field.key">
          <el-form-item v-if="field.type === 'radio'" :label="field.label">
            <el-radio-group v-model="extraFields[field.key]">
              <el-radio-button
                v-for="opt in field.options"
                :key="opt"
                :value="opt"
              >
                {{ opt }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-else-if="field.type === 'textarea'"
            :label="field.label"
          >
            <el-input
              v-model="extraFields[field.key]"
              type="textarea"
              :rows="field.rows ?? 4"
              :placeholder="field.placeholder"
              :maxlength="field.key === 'originalCopy' ? 500 : undefined"
              :show-word-limit="field.key === 'originalCopy'"
            />
          </el-form-item>

          <el-form-item v-else :label="field.label">
            <el-input
              v-model="extraFields[field.key]"
              :placeholder="field.placeholder"
            />
          </el-form-item>
        </template>
      </template>

      <el-form-item label="生成数量">
        <el-slider v-model="form.count" :min="1" :max="20" show-input />
      </el-form-item>

      <el-form-item label="文案语气">
        <el-radio-group v-model="form.tone">
          <el-radio-button value="活泼">活泼</el-radio-button>
          <el-radio-button value="专业">专业</el-radio-button>
          <el-radio-button value="紧迫">紧迫</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="输出语言">
        <el-input
          v-model="form.language"
          placeholder="例：英语、中文、日语、西班牙语"
        />
      </el-form-item>

      <el-button
        type="primary"
        :loading="loading"
        :disabled="!canGenerate"
        style="width: 100%"
        @click="handleGenerate"
      >
        {{ loading ? "生成中..." : "一键裂变" }}
      </el-button>
    </el-form>
  </section>
</template>

<script setup>
import { reactive, computed, watch } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { getSceneConfig } from "@/data/scenes";

const props = defineProps({
  selectedScene: { type: Object, default: null },
  loading: Boolean,
});

const emit = defineEmits(["open-drawer", "generate"]);

const form = reactive({ count: 10, tone: "活泼", language: "中文" });
const extraFields = reactive({});

const sceneFields = computed(() => {
  if (!props.selectedScene) return [];
  return (
    getSceneConfig(props.selectedScene.platId, props.selectedScene.scene)
      ?.fields ?? []
  );
});

// 必填字段全部有值才可提交
const canGenerate = computed(
  () =>
    sceneFields.value.length > 0 &&
    sceneFields.value
      .filter((f) => f.required)
      .every((f) => extraFields[f.key]?.trim()),
);

// 切换场景清空
watch(
  () => props.selectedScene?.scene,
  () => Object.keys(extraFields).forEach((k) => delete extraFields[k]),
);

function handleGenerate() {
  emit("generate", {
    ...form,
    platName: props.selectedScene?.platName,
    scene: props.selectedScene?.scene,
    extraFields: { ...extraFields },
  });
}
</script>

<style scoped>
.panel {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e4e7ed;
}
.left-panel {
  width: 380px;
  flex-shrink: 0;
}
.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}
.scene-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  min-height: 36px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.scene-trigger:hover {
  border-color: var(--el-color-primary);
}
.scene-name {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.scene-placeholder {
  flex: 1;
  font-size: 13px;
  color: var(--el-text-color-placeholder);
}
.scene-arrow {
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;
  font-size: 14px;
}
</style>
