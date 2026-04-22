                                                                                    # AdCopy AI — 前端 README

> **定位**：跨境广告文案裂变工具的前端层，基于 Vue 3 + Element Plus 构建，负责场景选择、表单输入、AI 结果展示与导出。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| UI 组件库 | Element Plus 2.13.6 |
| 构建工具 | Vite 8.0.1 |
| HTTP 客户端 | Axios 1.13.6（统一封装，含 429 限流提示） |
| 状态管理 | 轻量 Composable（无 Pinia/Vuex） |
| 工具库 | @vueuse/core |
| 部署 | Docker 多阶段构建（node → nginx） |

---

## 目录结构

```
src/
├── api/
│   ├── copy.js              # Axios 实例 + generateCopy / detectCopy 接口
│   └── scenes.js            # 获取平台/场景配置的接口（GET /api/scenes）
├── assets/                  # 静态资源
├── composables/
│   ├── useCopyGen.js        # 文案生成的异步状态（loading / result / error）
│   ├── useScene.js          # 场景抽屉开关 + 选中场景状态
│   └── useSceneConfig.js    # 从后端拉取并缓存平台/场景配置
├── components/
│   ├── InputPanel.vue       # 左侧表单面板（场景触发器 + 动态字段 + 参数）
│   ├── ResultList.vue       # 右侧结果列表（敏感词高亮 + 检测 + 复制）
│   ├── ExportBar.vue        # 导出 CSV / TXT
│   ├── SceneDrawer.vue      # 场景选择抽屉（平台列表 + 场景 chip 网格）
│   └── WelcomeBanner.vue    # 使用步骤引导横幅（可关闭，localStorage 记忆）
├── data/
│   └── scenes.js            # 平台视觉样式元数据（颜色），场景配置来自后端
├── styles/
│   ├── reset.css            # 全局样式重置
│   └── global.css           # Element Plus 覆盖 + 滚动条
├── App.vue                  # 根组件，组合所有子组件
└── main.js                  # 入口，挂载 App + 引入样式
```

---

## 核心业务逻辑

### 1. 场景配置（后端驱动）

场景配置**全部来自后端** `GET /api/scenes`，前端 `src/data/scenes.js` 仅保留平台视觉样式（颜色）。`useSceneConfig.js` 在首次挂载时请求并全局缓存，提供以下工具函数：

| 函数 | 用途 |
|------|------|
| `getConfig()` | 获取完整平台列表 |
| `getPlatformById(id)` | 获取单个平台配置（含视觉元数据） |
| `getFields(platId, sceneName)` | 获取当前场景的动态字段列表 |
| `getRiskLevel(platId, sceneName)` | 获取场景风险等级 |

后端场景数据结构示例：

```json
[
  {
    "id": "amazon",
    "name": "Amazon",
    "scenes": [
      {
        "name": "产品标题",
        "riskLevel": "low",
        "fields": [
          {
            "key": "originalCopy",
            "label": "原始文案",
            "type": "textarea",
            "rows": 4,
            "required": true,
            "placeholder": "..."
          },
          { "key": "keywords", "label": "核心关键词" }
        ]
      }
    ]
  }
]
```

字段 `type` 支持：
- `textarea` — 多行文本（支持 `rows`、`maxlength`、`show-word-limit`）
- `radio` — 单选按钮组（需配置 `options: ['选项A', '选项B']`）
- 省略/其他 — 默认单行 `el-input`

---

### 2. 场景选择流程

```
用户点击"选择场景" → App.vue 打开 SceneDrawer
  → 左栏选平台 → 右栏点击 chip 选场景
  → 确认 emit('confirm', { platId, platName, scene, ...colors })
  → useScene.confirmScene() 更新 selectedScene
  → InputPanel 接收 selectedScene，重新计算 sceneFields
  → watch scene 变化时清空 extraFields
```

---

### 3. 表单提交与生成流程

```
用户填写字段（canGenerate = 所有必填项有值）
  → 点击"一键裂变"
  → InputPanel emit('generate', { count, tone, language, platName, scene, extraFields })
  → App.vue handleGenerate → useCopyGen.generate(payload)
  → POST /api/copy/generate
  → result.value 更新 → ResultList 渲染
```

**`useCopyGen.js` 状态**：

| ref | 说明 |
|-----|------|
| `loading` | 控制按钮 loading 状态和骨架屏显示 |
| `result` | `[{ index, text, sensitiveWords: [{ word }] }]` |
| `error` | 错误信息 |

---

### 4. 结果展示（`ResultList.vue`）

- **敏感词高亮**：`escapeHtml` 防 XSS，正则将违禁词替换为 `<mark>` 标签，通过 `v-html` 渲染
- **安全/危险 Tag**：`sensitiveWords.length > 0` 显示 danger tag，否则 success
- **左侧红色边框**：`.has-sensitive` 通过 `border-left: 3px solid #f56c6c` 视觉区分
- **骨架屏**：生成期间根据 `pendingCount` 渲染对应数量的 `el-skeleton`
- **违禁词检测**：支持单条检测和一键批量检测，调用 `POST /api/copy/detect`
- **高风险场景提示**：`riskLevel` 为高风险时显示警告 tag

---

### 5. 导出（`ExportBar.vue`）

| 格式 | 内容 |
|------|------|
| TXT | `序号. 文案内容`，换行分隔 |
| CSV | 表头 + `序号,文案内容,敏感词（\|分隔）`，UTF-8 BOM 防中文乱码 |

---

## API 接口约定

### 生成文案

**请求**：`POST /api/copy/generate`

```json
{
  "count": 10,
  "tone": "活泼",
  "language": "中文",
  "platName": "Amazon",
  "scene": "产品标题",
  "extraFields": {
    "originalCopy": "...",
    "keywords": "...",
    "category": "..."
  }
}
```

**响应**：

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "index": 1,
        "text": "生成的文案内容",
        "sensitiveWords": [{ "word": "最好" }]
      }
    ],
    "totalSensitiveCount": 2
  }
}
```

### 违禁词检测

**请求**：`POST /api/copy/detect`

```json
{
  "texts": ["文案1", "文案2"],
  "platName": "Amazon"
}
```

### 场景配置

**请求**：`GET /api/scenes`

响应为平台数组，结构见上方"场景配置"章节。

---

## 开发启动

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 生产构建，输出 /dist
npm run preview    # 本地预览生产构建
```

> Vite 开发服务器将 `/api/**` 代理到 `http://localhost:8080`（后端）。

---

## Docker 部署

```bash
docker build -t adcopy-frontend .
docker run -p 80:80 adcopy-frontend
```

Dockerfile 采用多阶段构建：`node:20-alpine` 编译，`nginx:alpine` 提供静态服务，最终镜像约 30–50 MB。

---

## 扩展指南

### 新增平台或场景

在**后端**的场景配置接口（`GET /api/scenes`）中添加即可，无需修改前端代码。  
如需为新平台添加视觉样式（点颜色、tag 颜色），在 `src/data/scenes.js` 的 `platformMeta` 中补充对应 `id` 的配色。

### 新增导出格式

在 `ExportBar.vue` 的导出逻辑中增加分支。

### 新增语言选项

语言列表在 `InputPanel.vue` 中维护，支持"自定义"输入，无需后端配合。
                                                                                    
### 替换 AI 服务商

前端无需改动，只需修改后端 `application.properties` 中的 `openai.base-url` 和 `openai.api-key`。
