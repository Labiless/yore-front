<template>
    <nav
        class="fixed flex items-center align-center bottom-8 shadow-xl p-4 w-fit rounded-2xl left-1/2 -translate-x-1/2 bg-white">
        <Transition>
            <p class="absolute -top-8 text-sm" v-if="linkIndex > -1">{{ links[linkIndex].name }}</p>
        </Transition>
        <div class="flex m-auto">
            <IconLink @click="selectedIndex = i" :class="`${selectedIndex === i ? 'bg-black text-white p-2 rounded-full' : ''}`" @mouseover="linkIndex = i" @mouseout="linkIndex = -1" v-for="link, i in links" :icon="link.icon"
                :link="link.link" />
        </div>
    </nav>
</template>
<script setup lang="ts">

import IconLink from './ui/IconLink.vue';
import { ref } from 'vue';

const props = defineProps<{
    firstIndex?: number,
    links: {
        link: string,
        icon: string,
        name?: string
    }[]
}>();

const linkIndex = ref(-1);
const selectedIndex = ref(+props.firstIndex || 0);

</script>
<style></style>