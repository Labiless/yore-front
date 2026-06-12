<template>
    <div class="flex items-center gap-2">
        <Input
            v-model="localValue"
            class="flex-1 shadow-xl"
            type="text"
            @keydown.enter="emitSearch"
        />
        <button
            type="button"
            @click="emitSearch"
            class="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
            <Search class="size-5 text-gray-700" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import Input from '@shared/components/ui/input/Input.vue';

const props = defineProps<{
    modelValue?: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'search': [value: string];
}>();

const localValue = ref(props.modelValue ?? '');

watch(() => props.modelValue, (v) => {
    if (v !== undefined && v !== localValue.value) {
        localValue.value = v;
    }
});

watch(localValue, (v) => {
    emit('update:modelValue', v);
});

const emitSearch = () => {
    emit('search', localValue.value.replace(/\s+/g, ''));
};
</script>
