<template>
    <nav class="fixed flex items-center align-center bottom-8 shadow-xl p-4 w-fit rounded-2xl left-1/2 -translate-x-1/2 bg-white">
        <div class="flex m-auto">
            <IconLink v-for="link in links" 
                :icon="link.icon"
                :link="link.link"
            />
        </div>
    </nav>
</template>
<script setup lang="ts">

import IconLink from './ui/IconLink.vue';

defineProps<{
    links : {
        link: string,
        icon: string
    }[]
}>();

</script>
<style>

</style>