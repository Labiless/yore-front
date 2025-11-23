<template>
    <router-link class="m-2 hover:scale-120 transition-all" :to="link">
        <component :is="icon" />
    </router-link>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import * as icons from "lucide-vue-next";

const props = defineProps<{
    icon: any,
    link: string
}>();

const icon = computed(() => icons[props.icon]);

</script>
