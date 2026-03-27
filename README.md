# AdCopy AI — 前端 README

> **定位**：跨境广告文案裂变工具的前端层，基于 Vue 3 + Element Plus 构建，负责场景选择、表单输入、AI 结果展示与导出。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| UI 组件库 | Element Plus |
| 构建工具 | Vite |
| HTTP 客户端 | Axios（统一封装于 `src/api/copy.js`） |
| 状态管理 | 轻量 Composable（无 Pinia/Vuex） |

---

## 目录结构

```
src/
├── api/
│   └── copy.js              # Axios 实例 + generateCopy 接口封装
├── assets/                  # 静态资源
├── composables/
│   ├── useCopyGen.js        # 生成文案的异步状态管理（loading / result / error）
│   └── useScene.js          # 场景抽屉的开关 + 选中场景状态
├── components/
│   ├── InputPanel.vue       # 左侧表单面板（场景触发器 + 动态字段 + 参数）
│   ├── ResultList.vue       # 右侧结果列表（高亮敏感词 + 复制）
│   ├── ExportBar.vue        # 导出 CSV / TXT
│   └── SceneDrawer.vue      # 场景选择抽屉（平台列表 + 场景 chip 网格）
├── data/
│   └── scenes.js            # 全部平台/场景/字段配置（单一数据源）
├── styles/
│   ├── reset.css            # 全局样式重置
│   └── global.css           # Element Plus 覆盖 + 滚动条
├── App.vue                  # 根组件，组合所有子组件
└── main.js                  # 入口，挂载 App + 引入样式
```

---

## 核心业务逻辑

### 1. 场景数据驱动（`src/data/scenes.js`）

这是**整个前端的核心配置文件**，所有平台、场景、表单字段均在此定义，增删改场景只需修改此文件。

```js
// 数据结构
platforms = [
  {
    id: 'amazon',          // 平台唯一 ID
    name: 'Amazon',        // 展示名
    dotColor / tagBg / tagColor,  // 主题色（用于 chip、tag、侧边栏高亮）
    scenes: [
      {
        name: '产品标题',   // 场景名（同时作为后端 scene 参数传递）
        fields: [
          {
            key: 'originalCopy',   // extraFields 中的 key
            label: '原始文案',
            type: 'textarea',      // textarea | radio | text（默认）
            rows: 4,
            placeholder: '...',
            required: true,        // 控制提交按钮的 canGenerate 计算属性
          },
          { key: 'keywords', label: '核心关键词', placeholder: '...' },
        ],
      },
    ],
  },
]
```

**导出函数**：
- `getSceneConfig(platId, sceneName)` — 用于 `InputPanel` 获取当前场景的字段列表
- `getPlatformById(id)` — 用于 `SceneDrawer` 获取平台主题色信息

---

### 2. 场景选择流程（`SceneDrawer` → `useScene` → `InputPanel`）

```
用户点击"选择场景"触发器
  → App.vue 打开 SceneDrawer（drawerVisible = true）
  → SceneDrawer 内部：左栏选平台 → 右栏点击 chip 选场景
  → 点击"确认选择" emit('confirm', { platId, platName, scene, ...colors })
  → useScene.confirmScene() 更新 selectedScene ref
  → InputPanel 接收 selectedScene prop，computed sceneFields 重新计算
  → 动态渲染对应字段（watch scene 变化时清空 extraFields）
```

---

### 3. 表单提交与生成流程（`InputPanel` → `useCopyGen` → API）

```
用户填写字段，canGenerate（必填字段全部有值）= true
  → 点击"一键裂变"
  → InputPanel emit('generate', { count, tone, platName, scene, extraFields })
  → App.vue handleGenerate → useCopyGen.generate(payload)
  → POST /api/copy/generate
  → 返回 { code: 200, data: { items: [...], totalSensitiveCount } }
  → result.value 更新 → ResultList 渲染
```

**`useCopyGen.js` 状态**：

| ref | 说明 |
|-----|------|
| `loading` | 控制按钮 loading 状态和骨架屏显示 |
| `result` | `[{ index, text, sensitiveWords: [{ word }] }]` |
| `error` | 错误信息（当前仅 console，可扩展为 ElMessage） |

---

### 4. 结果展示（`ResultList.vue`）

- **敏感词高亮**：`highlightText()` 先 `escapeHtml` 防 XSS，再用正则将违禁词替换为 `<mark class="highlight">` 标签，通过 `v-html` 渲染
- **安全/危险 Tag**：`sensitiveWords.length > 0` 则显示 danger tag，否则 success
- **左侧红色边框**：`.has-sensitive` 类通过 `border-left: 3px solid #f56c6c` 实现视觉区分
- **骨架屏**：生成期间根据 `pendingCount`（本次请求数量）渲染对应数量的 `el-skeleton`

---

### 5. 导出（`ExportBar.vue`）

| 格式 | 内容 |
|------|------|
| TXT | `序号. 文案内容`，换行分隔 |
| CSV | 表头 + `序号,文案内容,敏感词（\|分隔）`，UTF-8 BOM 防中文乱码 |

---

## API 接口约定

**请求**：`POST /api/copy/generate`

```json
{
  "count": 10,
  "tone": "活泼",
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

---

## 开发启动

```bash
npm install
npm run dev        # 默认 http://localhost:5173
```

> Vite 开发服务器会将 `/api/**` 代理到后端（需在 `vite.config.js` 中配置 proxy，目标 `http://localhost:8080`）。

---

## 扩展指南

### 新增平台或场景

只需在 `src/data/scenes.js` 的 `platforms` 数组中添加配置，**无需修改任何组件代码**。

字段 `type` 支持：
- `textarea` — 多行文本（支持 `rows`、`maxlength`、`show-word-limit`）
- `radio` — 单选按钮组（需配置 `options: ['选项A', '选项B']`）
- 省略/其他 — 默认单行 `el-input`

### 新增导出格式

在 `ExportBar.vue` 的 `handleExport()` 中增加 `type` 分支即可。

### 替换 AI 服务商

前端无需改动，只需修改后端 `application.properties` 中的 `openai.base-url` 和 `openai.api-key`。
