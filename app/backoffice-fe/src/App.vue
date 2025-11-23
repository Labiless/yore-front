<template>
  <main>
    <Header :title="uiSTore.title" />
    <RouterView />
    <Nav :links />
  </main>
</template>

<script setup lang="ts">

import { RouterView } from 'vue-router';
import Header from '@shared/components/Header.vue';
import Nav from '@shared/components/Nav.vue';
import { useUiStore } from '@/stores/ui';

const uiSTore = useUiStore();

const links = [
  {
    link: "home",
    icon: "House"
  },
  {
    link: "home",
    icon: "Wrench"
  },
  {
    link: "home",
    icon: "ArchiveRestore"
  },
  {
    link: "home",
    icon: "Warehouse"
  },
  {
    link: "home",
    icon: "QrCode"
  },
  {
    link: "home",
    icon: "UserRoundCog"
  }
]

</script>


<style scoped></style>
