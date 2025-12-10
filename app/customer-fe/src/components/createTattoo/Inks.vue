<template>
    <p class="text-center font-bold mb-2 w-fit flex items-center mx-auto">
        <ClipboardList class="text-black mr-2" />
        Inchiostro
    <div class="rounded-full bg-green-700 p-1 w-2 h-2 ml-2"
        :class="`${createTattoStore.inksValidation() ? '' : 'bg-amber-500!'}`"></div>
    </p>
    <hr />
    <Button @click="addInk" class="w-full">Scansiona Inchiostro</Button>
    <Input placeholder="Id inchiostro" v-model="inkUuid"></Input>
    <div class="" v-if="createTattoStore.inks.length">
        <p>Inchostri scansionati</p>
    </div>
    <div class="w-full flex justify-start items-center shadow-md p-4 pl-4 bg-white mb-4 rounded-md h-fit transition-all"
        v-for="ink in createTattoStore.inks">
        <div class="">
            <p class="text-xs font-bold">#000000</p>
            <p class="text-xs">{{ ink.uuid }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import Button from '@shared/components/ui/button/button.vue';
import Input from '@shared/components/ui/input/Input.vue';
import { useCreateTattoStore } from '@/stores/createTatto.store';
import { onMounted, ref } from 'vue';
import { apiLabelService } from '@/services/api.inks.service';
import { createTattoo, getTattoByUuid, updateTattoo } from '@/services/api.tattoo.service';
import { userUserStore } from '@/stores/user.store';
import { useUiStore } from '@/stores/ui';

// 2c7a1f6a-975a-4a38-9cf2-8b02ff72c271

const createTattoStore = useCreateTattoStore();
const inkUuid = ref('');
const userStore = userUserStore();
const uiStore = useUiStore();

// TODO add scan tattoo logic
const addInk = async () => {
    uiStore.loading = true;
    if (inkUuid.value) {
        try {
            const ink = await apiLabelService.getLabelByUuid(inkUuid.value);
            if (ink) {
                await apiLabelService.updateLabelByUuid(ink.uuid, {
                    burningDate: new Date(),
                    tattooUuid: createTattoStore.uuid,
                });
                createTattoStore.inks.push(ink);
                inkUuid.value = '';
                const getTatto = await getTattoByUuid(createTattoStore.uuid);
                const tatto = await updateTattoo(
                    createTattoStore.uuid,
                    {
                        inks: [...getTatto.inks, ink.uuid]
                    }
                )
            }
            uiStore.loading = false;
            uiStore.setToast('Inchiostro bruciato');
        } catch (error) {
            uiStore.loading = false;
            uiStore.setToast('Inchiostro inesistente', 'error');
        }
    }
    else {
        uiStore.loading = false;
        uiStore.setToast('Nessun id inchiostro', 'error');
    }
}

</script>