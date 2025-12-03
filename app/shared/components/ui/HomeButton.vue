<template>
    <router-link :to="link" class="w-[200px] h-[200px] shadow-xl rounded-sm flex flex-col m-8 bg-white">
        <div class="mx-auto w-2/3 h-2/3 flex items-center justify-center">
            <component :is="icon" class="scale-150"/>
        </div>
        <Button class="w-fit mx-auto">
            <slot />
        </Button>
    </router-link>
</template>

<script setup lang="ts">
import * as icons from "lucide-vue-next";
import Button from './button/Button.vue';
import { computed } from 'vue';

const props = defineProps<{
    link: string,
    icon: string
}>();

const icon = computed(() => icons[props.icon]);

</script>