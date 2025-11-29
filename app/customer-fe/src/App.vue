<template>
  <div class="flex justify-center items-center w-full h-full fixed z-10 bg-gray-500 opacity-35" v-if="uiStore.loading">
    <div class="w-16 h-16 bg-white rounded-full animate-bounce"></div>
  </div>
  <Header v-if="authStore.isAuthenticated" :title="uiStore.title" />
  <main class="h-screen w-4/6 mx-auto" :class="`${uiStore.loading ? 'blur' : ''}`">
    <Transition>
      <RouterView />
    </Transition>
  </main>
  <Nav firstIndex="0" v-if="authStore.isAuthenticated" :links />
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
    icon: "House",
    name: "Home",
  },
  {
    link: "/tattoo",
    icon: "Palette",
    name: "Tattoo",
  },
  {
    link: "/user",
    icon: "UserRound",
    name: "Accont",
  },
  {
    link: "/inks",
    icon: "Warehouse",
    name: "Inchiostro",
  },
]

</script>


<style scoped></style>
