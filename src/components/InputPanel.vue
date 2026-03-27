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

      <!-- 动态字段 -->
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
        <p
          v-if="sceneConfig?.countHint"
          style="
            font-size: 12px;
            color: var(--el-text-color-secondary);
            margin-top: 6px;
          "
        >
          {{ sceneConfig.countHint }}
        </p>
      </el-form-item>

      <!-- 语气 -->
      <el-form-item label="文案语气">
        <el-select
          v-model="form.tone"
          style="width: 100%"
          @change="onToneChange"
        >
          <el-option v-for="t in TONES" :key="t" :label="t" :value="t" />
        </el-select>
        <el-input
          v-if="form.tone === '自定义'"
          v-model="form.customTone"
          placeholder="请输入自定义语气，例：俏皮、煽情、学术"
          style="margin-top: 8px"
        />
      </el-form-item>

      <!-- 语言 -->
      <el-form-item label="输出语言">
        <el-select
          v-model="form.language"
          style="width: 100%"
          @change="onLanguageChange"
        >
          <el-option v-for="l in LANGUAGES" :key="l" :label="l" :value="l" />
        </el-select>
        <el-input
          v-if="form.language === '自定义'"
          v-model="form.customLanguage"
          placeholder="请输入语言，例：泰语、荷兰语"
          style="margin-top: 8px"
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
import { useSceneConfig } from "@/composables/useSceneConfig";

const TONES = [
  "专业的",
  "幽默的",
  "兴奋的",
  "机智的",
  "有趣的",
  "丰富的",
  "温和的",
  "委婉的",
  "礼貌的",
  "精简的",
  "口语化的",
  "有说服力的",
  "自定义",
];

const LANGUAGES = [
  "中文",
  "英语",
  "日语",
  "韩语",
  "法语",
  "德语",
  "西班牙语",
  "葡萄牙语",
  "阿拉伯语",
  "自定义",
];

const props = defineProps({
  selectedScene: { type: Object, default: null },
  loading: Boolean,
});
const emit = defineEmits(["open-drawer", "generate"]);

const { getFields, getConfig  } = useSceneConfig();

const form = reactive({
  count: 10,
  tone: "专业的",
  customTone: "",
  language: "中文",
  customLanguage: "",
});

const extraFields = reactive({});

const sceneFields = computed(() => {
  if (!props.selectedScene) return [];
  return getFields(props.selectedScene.platId, props.selectedScene.scene);
});

const sceneConfig = computed(() =>
  props.selectedScene
    ? getConfig(props.selectedScene.platId, props.selectedScene.scene)
    : null,
);

const canGenerate = computed(() => {
  if (sceneFields.value.length === 0) return false;
  const requiredOk = sceneFields.value
    .filter((f) => f.required)
    .every((f) => extraFields[f.key]?.trim());
  const toneOk = form.tone !== "自定义" || form.customTone.trim();
  const langOk = form.language !== "自定义" || form.customLanguage.trim();
  return requiredOk && toneOk && langOk;
});

function onToneChange(val) {
  if (val !== "自定义") form.customTone = "";
}

function onLanguageChange(val) {
  if (val !== "自定义") form.customLanguage = "";
}

watch(
  () => props.selectedScene?.scene,
  () => {
    Object.keys(extraFields).forEach((k) => delete extraFields[k]);
  },
);

function handleGenerate() {
  emit("generate", {
    count: form.count,
    tone: form.tone === "自定义" ? form.customTone.trim() : form.tone,
    language:
      form.language === "自定义" ? form.customLanguage.trim() : form.language,
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

@media (max-width: 640px) {
  .left-panel {
    width: 100%;
  }
}
</style>
