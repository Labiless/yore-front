<template>
  <div class="flex justify-center items-center w-full h-full fixed z-10 bg-gray-500 opacity-35" v-if="uiStore.loading">
    <div class="w-16 h-16 bg-white rounded-full animate-bounce"></div>
  </div>
  <Transition>
    <PopUp v-if="uiStore.popup.text.length && uiStore.popup.action" :uiStore="uiStore" />
  </Transition>
  <main class="h-screen overflow-y-auto" :class="`${uiStore.loading ? 'blur' : ''}`">
    <Transition>
      <RouterView class="app-shell px-4 pt-12 pb-28" />
    </Transition>
  </main>
  <div v-if="authStore.isAuthenticated" class="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
    <div class="app-shell w-full pointer-events-auto bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <Header :title="uiStore.title" />
      <Nav :first-index="0" :links :route="route" />
    </div>
  </div>
  <Transition>
    <div v-if="uiStore.toast.length"
      class="ui-toast bottom-48 w-10/12 max-w-96 text-center shadow-black -translate-x-[50%] left-[50%] p-4 bg-green-500 text-white rounded-2xl shadow-2xl"
      :class="`${uiStore.toastType === 'error' ? 'bg-red-500!' : ''}`">
      {{ uiStore.toast }}
    </div>
  </Transition>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import PopUp from '@shared/components/PopUp.vue';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';
import { useUserStore } from './stores/user.store';
import router from './router';
import { getUserByUuid } from '../../backoffice-fe/src/services/api.user.service';
import { useRoute } from 'vue-router';

const uiStore = useUiStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();

(async () => {
  if (!userStore.getUiid) {
    authStore.logout();
    router.push('login');
  }
  else if (userStore.getUiid && authStore.isAuthenticated) {
    try {
      const profile = await getUserByUuid(userStore.getUiid);
      userStore.init(profile);
    } catch {
      // keep cached profile if refresh fails
    }
  }
})()

const links = [
  {
    link: "/",
    icon: "House",
    name: "Home",
  },
  {
    link: "/tattoos",
    icon: "Palette",
    name: "Tattoos",
  },
  {
    link: "/inks",
    icon: "Droplet",
    name: "Inchiostro",
  },
  {
    link: "/user",
    icon: "UserRound",
    name: "Account",
  },
  {
    action: () => {
      uiStore.setPopoup('Sei sicuro di voler effettuare il logout?', async () => {
        authStore.logout();
        location.reload();
      });
    },
    icon: "LogOut",
    name: "Logout",
    color: "red",
  }
]

</script>


<style scoped></style>
