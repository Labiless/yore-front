import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { bindAuthSession } from './services/api.service'
import { useUserStore } from './stores/user.store'
import '../../shared/styles/index.css'
import './styles/layout.css'
import sharedFavicon from '@shared/images/favicon.ico'

const applySharedFavicon = () => {
  let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.appendChild(favicon)
  }
  favicon.href = sharedFavicon
}

applySharedFavicon()

const app = createApp(App)

app.use(createPinia())
bindAuthSession(router, {
  onSessionExpired: () => useUserStore().clear(),
})
app.use(router)

app.mount('#app')
