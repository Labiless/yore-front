<template>
    <nav class="fixed flex items-center align-center bottom-0 w-full p-4">
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
import { defineProps } from 'vue';

defineProps<{
    links : {
        link: string,
        icon: string
    }[]
}>();

</script>
<style>

</style>