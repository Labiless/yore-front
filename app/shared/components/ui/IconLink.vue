<template>
    <router-link class="m-2" :to="link">
        <component :is="icon" />
    </router-link>
</template>

<script setup lang="ts">

import { defineProps, computed } from 'vue';
import * as icons from "lucide-vue-next";

const props = defineProps<{
    icon: any,
    link: string
}>();

const icon = computed(() => icons[props.icon]);

</script>
