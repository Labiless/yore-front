<template>
    <div class="p-4 fixed top-0">
        <h1 class="font-bold text-3xl">{{ title }}</h1>
    </div>
</template>
<script setup lang="ts">

defineProps<{
    title?: string
}>();


</script>
<style>
    
</style>