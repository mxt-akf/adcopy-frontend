import { createApp } from 'vue'
import App from './App.vue'

import 'element-plus/dist/index.css'
import './styles/reset.css'    // ← 先重置
import './styles/global.css'   // ← 再写全局变量

createApp(App).mount('#app')