<template>
  <div class="flex justify-center items-center w-full h-full fixed z-10 bg-gray-500 opacity-35" v-if="uiStore.loading">
    <div class="w-16 h-16 bg-white rounded-full animate-bounce"></div>
  </div>
  <Transition>
    <PopUp v-if="uiStore.popup.text.length && uiStore.popup.action" :uiStore="uiStore"/>
  </Transition>
  <main class="h-screen" :class="`${uiStore.loading ? 'blur' : ''}`">
    <Transition>
      <RouterView class="lg:w-1/2 mx-auto pt-12 pb-24 px-4" />
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
