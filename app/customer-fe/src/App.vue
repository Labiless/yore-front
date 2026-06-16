<template>
  <Transition>
    <PopUp v-if="uiStore.popup.text.length && uiStore.popup.action" :uiStore="uiStore" />
  </Transition>
  <main
    class="h-screen overflow-y-auto"
    :class="`${uiStore.loading ? 'blur pointer-events-none select-none' : ''}`"
  >
    <Transition>
      <RouterView class="app-shell px-4 pt-12 pb-28" />
    </Transition>
  </main>
  <div
    v-if="authStore.isAuthenticated"
    class="fixed bottom-0 w-full z-30 bg-white"
    :class="`${uiStore.loading ? 'pointer-events-none' : ''}`"
  >
    <Header :title="uiStore.title" />
    <Nav :first-index="0" :links :route="route" />
  </div>
  <Transition>
    <div v-if="uiStore.toast.length"
      class="ui-toast bottom-48 w-10/12 max-w-96 text-center shadow-black -translate-x-[50%] left-[50%] p-4 bg-green-500 text-white rounded-2xl shadow-2xl"
      :class="`${uiStore.toastType === 'error' ? 'bg-red-500!' : ''}`">
      {{ uiStore.toast }}
    </div>
  </Transition>
  <div
    v-if="uiStore.loading"
    class="loading-overlay fixed inset-0 z-[200] flex justify-center items-center bg-gray-900/45 px-6"
    role="alertdialog"
    aria-modal="true"
    aria-busy="true"
    aria-label="Caricamento in corso"
  >
    <div class="flex flex-col items-center gap-4 max-w-sm w-full rounded-2xl bg-white px-6 py-8 shadow-2xl text-center pointer-events-auto">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
      <p v-if="uiStore.loadingMessage && !uiStore.loadingSteps.length" class="text-sm text-gray-700 leading-relaxed">
        {{ uiStore.loadingMessage }}
      </p>
      <ul v-if="uiStore.loadingSteps.length" class="w-full flex flex-col gap-3 text-left mt-1">
        <li
          v-for="(step, i) in uiStore.loadingSteps"
          :key="i"
          class="flex items-center gap-3 text-sm"
          :class="step.done ? 'text-gray-800' : 'text-gray-400'"
        >
          <span v-if="step.done" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span v-else class="w-5 h-5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin shrink-0" />
          {{ step.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import PopUp from '@shared/components/PopUp.vue';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from './stores/auth';
import { onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from './stores/user.store';
import { getUserByUuid } from '@/services/api.user.service';
import { useRoute } from 'vue-router';
import api, { getAuthSession } from '@/services/api.service';
import router from '@/router';

const uiStore = useUiStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();

watch(
  () => uiStore.loading,
  (loading) => {
    document.body.style.overflow = loading ? 'hidden' : '';
  },
  { immediate: true },
);

let stopSessionWatcher: (() => void) | null = null;

onMounted(async () => {
  stopSessionWatcher = getAuthSession().startSessionWatcher();

  const isAuthenticated = await getAuthSession().ensureAuthenticated();
  if (!isAuthenticated) return;

  if (userStore.getUiid) {
    try {
      const profile = await getUserByUuid(userStore.getUiid);
      userStore.init(profile);
    } catch {
      // keep cached profile if profile refresh fails
    }
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  stopSessionWatcher?.();
});

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
        try {
          await api.post('/auth/logout');
        } catch {
          // ignore
        }
        authStore.logout();
        userStore.clear();
        window.location.href = '/login';
      });
    },
    icon: "LogOut",
    name: "Logout",
    color: "red",
  }
]

</script>


<style scoped>
.loading-overlay {
  touch-action: none;
  overscroll-behavior: none;
}
</style>
