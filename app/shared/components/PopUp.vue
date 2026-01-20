<template>
    <div class="w-full h-full fixed top-0 left-0 z-10 bg-[#0000008c] flex justify-center items-center" :class="``">
        <div class="bg-white p-4 rounded-lg">
            <p>
                {{ uiStore.popup.text }}
            </p>
            <div class="flex justify-around mt-4">
                <Button class="w-1/2 mr-2 bg-green-500"
                    @click="onclick">Si</Button>
                <Button class="w-1/2 bg-red-500" @click="uiStore.closePopup()">No</Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from './ui/button/Button.vue';

const props = defineProps<{
    uiStore: any,
}>();

const onclick = async () => {
    props.uiStore.loading = true;
    await props.uiStore.popup.action();
    props.uiStore.closePopup();
    props.uiStore.loading = false;
}

</script>