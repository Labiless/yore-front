<template>
    <button class="m-2 flex items-center justify-center hover:scale-120 transition-all" :to="link">
        <component :is="icon" />
    </button>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import * as icons from "lucide-vue-next";

const props = defineProps<{
    icon: any,
}>();

const icon = computed(() => icons[props.icon]);

</script>
