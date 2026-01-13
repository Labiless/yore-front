<template>
  <div class="flex justify-center items-center w-full h-full fixed z-10 bg-gray-500 opacity-35" v-if="uiStore.loading">
    <div class="w-16 h-16 bg-white rounded-full animate-bounce"></div>
  </div>
  <Transition>
    <div v-if="uiStore.toast.length" class="fixed bottom-48 w-10/12 max-w-96 text-center shadow-black -translate-x-[50%] left-[50%] p-4 bg-green-500 text-white rounded-2xl shadow-2xl"
    :class="`${uiStore.toastType === 'error' ? 'bg-red-500!' : ''}`"
    >
      {{ uiStore.toast }}
    </div>
  </Transition>
  <Header v-if="authStore.isAuthenticated" :title="uiStore.title" />
  <main class="h-screen w-11/12 md:w-1/2 mx-auto overflow-hidden" :class="`${uiStore.loading ? 'blur' : ''}`">
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
import { onMounted } from 'vue';
import { userUserStore } from './stores/user.store';
import router from './router';
import { getUserByUuid } from '../../backoffice-fe/src/services/api.user.service';

const uiStore = useUiStore();
const authStore = useAuthStore();
const userStore = userUserStore();

onMounted (async () => {
  if(!userStore.getUiid){
    authStore.logout();
    router.push('login');
    return;
  }
  else{
    const user = userStore.getUser;
    if(!user.email){
      const user = await getUserByUuid(userStore.getUiid);
      userStore.init(user);
    }
  }
})

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
]

</script>


<style scoped></style>
