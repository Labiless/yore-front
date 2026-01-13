<template>
    <div class="p-4 fixed top-0 w-full">
        <h1 class="w-fit mx-auto text-2xl font-bold py-2 px-4 border-black text-black rounded-md">{{ title }}</h1>
    </div>
</template>
<script setup lang="ts">

defineProps<{
    title?: string
}>();


</script>
<style>
    
</style>