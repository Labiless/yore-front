<template>
    <button type="button" class="m-2 flex items-center justify-center hover:scale-120 transition-all rounded-full">
        <component :is="icon" />
    </button>
</template>

<script setup lang="ts">

import { computed, type Component } from 'vue';
import * as icons from "lucide-vue-next";

const props = defineProps<{
    icon: string,
}>();

const icon = computed(
    () => icons[props.icon as keyof typeof icons] as Component | undefined,
);

</script>
