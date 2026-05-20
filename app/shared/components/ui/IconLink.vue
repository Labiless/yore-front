<template>
    <router-link class="m-2 flex items-center justify-center hover:scale-120 transition-all" :to="link">
        <component :is="icon" />
    </router-link>
</template>

<script setup lang="ts">

import { computed, type Component } from 'vue';
import * as icons from "lucide-vue-next";

const props = defineProps<{
    icon: string,
    link: string
}>();

const icon = computed(
    () => icons[props.icon as keyof typeof icons] as Component | undefined,
);

</script>
