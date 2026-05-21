<template>
    <nav class="flex items-center align-center custom-shadow pb-2 w-full bg-white">
        <div class="flex m-auto">
            <div v-for="(item, i) in links" :key="i">
            <IconLink v-if="item.link" @click="selectedIndex = i"
                :class="`${selectedIndex === i ? 'bg-black text-white p-2 rounded-full' : ''}`"
                @mouseover="linkIndex = -1" @mouseout="linkIndex = -1" :icon="item.icon"
                :link="item.link" />
            <IconButton v-else
                @click="onNavAction(i, item)"
                :class="`${selectedIndex === i ? 'bg-black text-white p-2 rounded-full' : ''}`"
                @mouseover="linkIndex = -1" @mouseout="linkIndex = -1" :icon="item.icon" />
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
    matchPath?: string;
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

const syncSelectedFromRoute = (path: string) => {
    for (let i = 0; i < props.links.length; i++) {
        const item = props.links[i];
        const link = item?.link;
        const matchPath = item?.matchPath;
        if (link && (path === link || path.startsWith(`${link}/`))) {
            selectedIndex.value = i;
            return;
        }
        if (matchPath && (path === matchPath || path.startsWith(`${matchPath}/`))) {
            selectedIndex.value = i;
            return;
        }
    }
};

const onNavAction = (index: number, item: NavLinkItem) => {
    selectedIndex.value = index;
    item.action?.();
};

watch(() => props.route.fullPath, syncSelectedFromRoute, { immediate: true });

</script>
<style scoped>
.custom-shadow {
    /*box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.062);*/
}
</style>
