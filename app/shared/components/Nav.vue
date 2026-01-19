<template>
    <nav class="flex items-center align-center custom-shadow pb-2 w-full bg-white">
        <div class="flex m-auto">
            <IconLink @click="selectedIndex = i"
                :class="`${selectedIndex === i ? 'bg-black text-white p-2 rounded-full' : ''}`"
                @mouseover="linkIndex = -1" @mouseout="linkIndex = -1" v-for="link, i in links" :icon="link.icon"
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
<style scoped>
.custom-shadow {
    /*box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.062);*/
}
</style>