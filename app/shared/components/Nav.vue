<template>
    <nav class="flex items-center align-center custom-shadow pb-2 w-full bg-white">
        <div class="flex m-auto">
            <div v-for="link, i in links" :key="i">
            <IconLink v-if="link.link" @click="selectedIndex = i;"
                :class="`${selectedIndex === i ? 'bg-black text-white p-2 rounded-full' : ''}`"
                @mouseover="linkIndex = -1" @mouseout="linkIndex = -1" :icon="link.icon"
                :link="link.link" />
            <IconButton v-else @click="link.action"
                @mouseover="linkIndex = -1" @mouseout="linkIndex = -1" :icon="link.icon"/>
            </div>
        </div>
    </nav>
</template>
<script setup lang="ts">

import IconLink from './ui/IconLink.vue';
import IconButton from './ui/IconButton.vue';
import { ref, watch } from 'vue';

export type NavLinkItem = {
    action?: () => void;
    link?: string;
    icon: string;
    name?: string;
    color?: string;
};

const props = defineProps<{
    route: { fullPath: string };
    firstIndex?: number;
    links: NavLinkItem[];
}>();

const linkIndex = ref(-1);
const selectedIndex = ref(props.firstIndex ?? 0);

watch(
    () => props.route.fullPath,
    (newPath) => {
        for (let i = 0; i < props.links.length; i++) {
            const link = props.links[i]?.link;
            if (link && link === newPath) {
                selectedIndex.value = i;
                return;
            }
        }
    }
)

</script>
<style scoped>
.custom-shadow {
    /*box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.062);*/
}
</style>
