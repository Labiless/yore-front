<template>
    <div>
        <h1>{{ title }}</h1>
    </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    title?: string
}>();


</script>
<style>
    
</style>