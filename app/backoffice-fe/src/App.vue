<template>
  <div class="flex justify-center items-center w-full h-full fixed z-10 bg-gray-500 opacity-35" v-if="uiStore.loading">
    <div class="w-16 h-16 bg-white rounded-full animate-bounce"></div>
  </div>
  <main class="h-screen w-full bg-gray-100" :class="`${uiStore.loading ? 'blur' : ''}`">
    <Header v-if="authStore.isAuthenticated" :title="uiStore.title" />
    <RouterView/>
    <Nav v-if="authStore.isAuthenticated" :links />
  </main>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from './stores/auth';

const uiStore = useUiStore();
const authStore = useAuthStore();

const links = [
  {
    link: "/",
    icon: "House"
  },
  {
    link: "/",
    icon: "Wrench"
  },
  {
    link: "/loadbatch",
    icon: "ArchiveRestore"
  },
  {
    link: "/",
    icon: "Warehouse"
  },
  {
    link: "/",
    icon: "QrCode"
  },
  {
    link: "/",
    icon: "UserRoundCog"
  }
]

</script>


<style scoped></style>
