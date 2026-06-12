<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2 shrink-0" />
        Caratteristiche del tatuaggio
        <span
            class="rounded-full p-1 w-2 h-2 ml-2 shrink-0"
            :class="createTattoStore.kirbyDesaySectionConfirmed() ? 'bg-green-700' : 'bg-amber-500'"
        />
    </p>
    <hr class="mb-4" />
    <Accordion type="single" collapsible class="w-full" default-value="item-1">
        <AccordionItem value="item-1">
            <AccordionTrigger>Fototipo</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Button @click="createTattoStore.kirbyDesay.skinType = skinType.id" v-for="skinType in skinTypes"
                        :key="skinType.id"
                        class="h-28 shadow-xl bg-white hover:bg-white hover:border-2 hover:border-blue-400  text-black flex flex-col"
                        :class="`${createTattoStore.kirbyDesay.skinType === skinType.id ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center text-sm lowercase w-full rounded-sm p-1"
                            :style="`background-color: ${skinType.bg}`">{{ skinType.name }}</p>
                        <p class="text-center text-xs block whitespace-normal">{{ skinType.description }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>Localizzazione tatuaggio</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-md mx-auto sm:max-w-none">
                    <Button @click="createTattoStore.kirbyDesay.position = position.id" v-for="position in positions"
                        :key="position.id"
                        class="hover:bg-white hover:border-2 hover:border-blue-400 h-fit max-w-[5.5rem] sm:max-w-none mx-auto w-full shadow-xl bg-white text-black flex flex-col"
                        :class="`${createTattoStore.kirbyDesay.position === position.id ? 'border-2 border-blue-400' : ''}`">
                        <img :src="`/img/kirby_desay/location-${position.id}.svg`" alt="" />
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>Colore dell'inchiostro</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 gap-2">
                    <Button
                        v-for="inkColor in inkColors"
                        :key="inkColor"
                        @click="createTattoStore.kirbyDesay.color = inkColor"
                        class="hover:bg-white hover:border-2 hover:border-blue-400 h-24 shadow-xl bg-white text-black flex flex-col justify-center"
                        :class="`${createTattoStore.kirbyDesay.color === inkColor ? 'border-2 border-blue-400' : ''}`">
                        <div class="w-10 h-10 rounded-full border mx-auto" style="background-color: #000000"></div>
                        <p class="text-center text-sm mt-2">{{ INK_COLOR_LABELS[inkColor] ?? inkColor }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
            <AccordionTrigger>Stile del tatuaggio</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    <Button
                        v-for="style in tattooStyles"
                        :key="style"
                        @click="createTattoStore.kirbyDesay.tattooStyle = style"
                        class="hover:bg-white hover:border-2 hover:border-blue-400 h-auto min-h-16 shadow-xl bg-white text-black flex flex-col justify-center py-2"
                        :class="`${createTattoStore.kirbyDesay.tattooStyle === style ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center text-sm whitespace-normal px-1">{{ style }}</p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
            <AccordionTrigger>Tipo di intervento</AccordionTrigger>
            <AccordionContent>
                <div class="grid grid-cols-1 gap-2">
                    <Button
                        v-for="type in tattooTypes"
                        :key="type"
                        @click="createTattoStore.kirbyDesay.tattooType = type"
                        class="hover:bg-white hover:border-2 hover:border-blue-400 h-auto min-h-20 shadow-xl bg-white text-black flex flex-col justify-start py-3"
                        :class="`${createTattoStore.kirbyDesay.tattooType === type ? 'border-2 border-blue-400' : ''}`">
                        <p class="text-center rounded-sm p-1 whitespace-normal font-medium">
                            {{ TATTOO_TYPE_LABELS[type]?.title ?? type }}
                        </p>
                        <p class="text-center text-xs block whitespace-normal px-2 opacity-80">
                            {{ TATTOO_TYPE_LABELS[type]?.description ?? '' }}
                        </p>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
    <Button @click="submit" class="w-full h-12">Conferma</Button>
</template>
<script setup lang="ts">
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@shared/components/ui/accordion';
import Button from '@shared/components/ui/button/Button.vue';
import { ClipboardList } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { getTattoByUuid, getTattooConfig, updateTattoo } from '@/services/api.tattoo.service';
import { useUiStore } from '@/stores/ui';
import { useTatoosStore } from '@/stores/tattoos.store';
import {
    FALLBACK_INK_COLORS,
    FALLBACK_TATTOO_STYLES,
    FALLBACK_TATTOO_TYPES,
    INK_COLOR_LABELS,
    TATTOO_TYPE_LABELS,
} from '@/constants/tattoo.config';

const createTattoStore = useCreateTattoStore();
const tattoosStore = useTatoosStore();
const uiStore = useUiStore();

const inkColors = ref<string[]>([...FALLBACK_INK_COLORS]);
const tattooStyles = ref<string[]>([...FALLBACK_TATTOO_STYLES]);
const tattooTypes = ref<string[]>([...FALLBACK_TATTOO_TYPES]);

watch(
    () => ({ ...createTattoStore.kirbyDesay }),
    () => {
        if (createTattoStore.kirbyDesaySectionConfirmed()) {
            createTattoStore.invalidateSection('kirbyDesay');
        }
    },
    { deep: true },
);

onMounted(async () => {
    try {
        const config = await getTattooConfig();
        if (config.inkColors?.length) inkColors.value = config.inkColors;
        if (config.tattooStyles?.length) tattooStyles.value = config.tattooStyles;
        if (config.tattooTypes?.length) tattooTypes.value = config.tattooTypes;
    } catch {
        // usa i fallback locali
    }
    if (!createTattoStore.kirbyDesay.color && inkColors.value.length === 1) {
        createTattoStore.kirbyDesay.color = inkColors.value[0] ?? 'black';
    }
});

const submit = async () => {
    uiStore.loading = true;
    if (createTattoStore.kirbyDesayValidation() && createTattoStore.uuid) {
        await updateTattoo(createTattoStore.uuid, {
            skinType: createTattoStore.kirbyDesay.skinType,
            position: createTattoStore.kirbyDesay.position,
            color: createTattoStore.kirbyDesay.color,
            tattooStyle: createTattoStore.kirbyDesay.tattooStyle,
            tattooType: createTattoStore.kirbyDesay.tattooType,
        });
        const updatedTattoo = await getTattoByUuid(createTattoStore.uuid);
        tattoosStore.tattoos = tattoosStore.tattoos
            .map((tattoo) => (tattoo.uuid === updatedTattoo.uuid ? updatedTattoo : tattoo))
            .sort((a: { id: number }, b: { id: number }) => b.id - a.id);
        createTattoStore.confirmSection('kirbyDesay');
        uiStore.loading = false;
        uiStore.setToast('Caratteristiche del tatuaggio aggiunte');
    } else {
        uiStore.loading = false;
        uiStore.setToast('Compilare tutti i dati prima di inviare', 'error');
    }
};

const skinTypes = [
    { id: 1, name: 'molto chiara', description: 'descrizione della pelle', bg: '#F0E4F2' },
    { id: 2, name: 'CHIARA', description: 'Spesso si scotta, si abbronza leggermente', bg: '#FBC2CF' },
    { id: 3, name: 'MEDIO CHIARA', description: 'Si scotta a volte, si abbronza gradualmente', bg: '#FBB2A4' },
    { id: 4, name: 'MEDIO SCURA', description: 'Si scotta raramente, si abbronza facilmente', bg: '#D28D56' },
    { id: 5, name: 'SCURA', description: 'Quasi mai si scotta, si abbronza subito', bg: '#AB5F4D' },
    { id: 6, name: 'MOLTO SCURA', description: 'Mai ustionata, colore naturalmente scuro', bg: '#422421' },
];

const positions = [
    { id: 1, name: 'head' },
    { id: 2, name: 'chest' },
    { id: 3, name: 'upper_legs' },
    { id: 4, name: 'downer_legs_forearms' },
    { id: 5, name: 'feet_hands' },
];
</script>

<style scoped>
.selected {
    border: 2px solid blue;
}
</style>
