import { createApp } from 'vue'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.scss'
import router from './routers/router.js'
import App from './App.vue'
import plugin from './plugin.js'
import naive from 'naive-ui'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(router).use(pinia).use(plugin).use(naive)
app.mount('#app');