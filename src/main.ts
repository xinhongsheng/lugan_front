import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'
import 'ant-design-vue/dist/reset.css'
import '@ant-design-vue/pro-layout/dist/style.css'
import './styles/tokens.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(ProLayout)
app.use(PageContainer)
app.mount('#app')
