<template>
    <div class="w-full bg-white flex pt-2 justify-between items-center h-4 ">
        <h1 class="w-fit mx-auto text-md px-4 py-1 font-bold text-white -translate-y-4 bg-black rounded-full ">{{ title }}</h1>
    </div>
</template>
<script setup lang="ts">

defineProps<{
    title?: string
}>();


</script>
<style>
    
</style>