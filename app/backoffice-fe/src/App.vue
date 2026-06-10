<template>
  <div
    v-if="uiStore.loading"
    class="fixed inset-0 z-200 flex justify-center items-center bg-gray-900/45 px-6"
  >
    <div class="flex flex-col items-center gap-4 max-w-sm w-full rounded-2xl bg-white px-6 py-8 shadow-2xl text-center">
      <div class="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
    </div>
  </div>
  <Transition>
    <PopUp v-if="uiStore.popup.text.length && uiStore.popup.action" :uiStore="uiStore"/>
  </Transition>
  <main class="h-screen overflow-y-auto" :class="`${uiStore.loading ? 'blur' : ''}`">
    <Transition>
      <RouterView class="w-full max-w-xl mx-auto pt-12 pb-24 px-4" />
    </Transition>
    <div class="fixed bottom-0 w-full">
      <Header v-if="authStore.isAuthenticated" :title="uiStore.title" />
      <Nav :first-index="0" v-if="authStore.isAuthenticated" :links :route="route" />
    </div>
  </main>
  <Transition>
    <div v-if="uiStore.toast.length"
      class="ui-toast bottom-48 w-10/12 max-w-96 text-center shadow-black -translate-x-[50%] left-[50%] p-4 bg-green-500 text-white rounded-2xl shadow-2xl"
      :class="`${uiStore.toastType === 'error' ? 'bg-red-500!' : ''}`">
      {{ uiStore.toast }}
    </div>
  </Transition>
</template>

<script setup lang="ts">

import { RouterView, useRoute } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import PopUp from '@shared/components/PopUp.vue';
import { onMounted, onUnmounted } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from './stores/auth';
import { useLabelsStore } from '@/stores/lables.store';
import router from '@/router';
import api, { getAuthSession } from '@/services/api.service';

const route = useRoute();
const uiStore = useUiStore();
const authStore = useAuthStore();
const labelsStore = useLabelsStore();

let stopSessionWatcher: (() => void) | null = null;

onMounted(async () => {
  stopSessionWatcher = getAuthSession().startSessionWatcher();
  await getAuthSession().ensureAuthenticated();
});

onUnmounted(() => {
  stopSessionWatcher?.();
});

const links = [
  {
    link: "/",
    icon: "House",
    name: "Home",
  },
  /*{
    link: "/loadbatch",
    icon: "ArchiveRestore",
    name: "Carica lotto",
  },*/
  {
    link: "/warehouse",
    icon: "Warehouse",
    name: "Magazzino",
  },
  /*{
    link: "/createlabels",
    icon: "Tag",
    name: "Crea etichette",
  },*/
  {
    matchPath: '/labels',
    action: () => {
      labelsStore.resetSearch();
      router.push('/labels');
    },
    icon: "Tags",
    name: "Etichette",
  },
  {
    link: "/users",
    icon: "UserRoundCog",
    name: "Utenti",
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
        router.push('/login');
      });
    },
    icon: "LogOut",
    name: "Logout",
    color: "red",
  }
]
</script>


<style scoped></style>
