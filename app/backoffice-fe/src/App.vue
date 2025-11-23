<template>
  <main>
    <Header v-if="authStore.isAuthenticated" :title="uiSTore.title" />
    <RouterView class="h-screen bg-gray-100" />
    <Nav v-if="authStore.isAuthenticated" :links />
  </main>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import { useUiStore } from '@/stores/ui';
import { useAuthStore } from './stores/auth';

const uiSTore = useUiStore();
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
    link: "/",
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
