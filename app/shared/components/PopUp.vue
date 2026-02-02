<template>
    <div class="w-full h-full fixed top-0 left-0 z-10 bg-[#0000008c] flex justify-center items-center p-4" :class="``">
        <div class="bg-white p-4 rounded-lg  md:w-1/3 max-w-100">
            <p class="pb-2">
                {{ uiStore.popup.text }}
            </p>
            <hr>
            <div class="flex justify-end mt-4">
                <Button class="w-1/3 mr-2 bg-green-500"
                    @click="onclick">Si</Button>
                <Button class="w-1/3 bg-red-500" @click="uiStore.closePopup()">No</Button>
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
    const action = props.uiStore.popup.action;
    props.uiStore.closePopup();
    await action();
    props.uiStore.loading = false;
}

</script>