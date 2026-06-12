<template>
    <div class="completed-tattoo-detail flex flex-col gap-4">
        <div v-if="tattooDocuments.length" class="mb-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">Documenti</p>
            <ul class="flex flex-col gap-2">
                <li v-for="doc in tattooDocuments" :key="doc.label">
                    <a
                        :href="doc.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block"
                    >
                        <Button
                            type="button"
                            class="w-full h-11 justify-start px-4 text-sm font-normal bg-white text-black border border-gray-200 shadow-sm hover:bg-blue-50"
                        >
                            <Award
                                v-if="doc.type === 'certificate'"
                                class="size-4 mr-2 shrink-0"
                            />
                            <FileSignature
                                v-else
                                class="size-4 mr-2 shrink-0"
                            />
                            {{ doc.label }}
                        </Button>
                    </a>
                </li>
            </ul>
        </div>

        <section class="bg-white rounded-xl shadow-md p-4">
            <p class="text-xs font-medium text-green-700 mb-2">Tatuaggio completato</p>
            <h2 class="text-xl font-bold capitalize flex items-center gap-2 leading-tight">
                <User class="size-5 shrink-0" />
                {{ tattoo.customerName }}
            </h2>
            <p class="text-sm text-gray-600 mt-2">
                Completato il {{ formatDisplayDate(tattoo.creationDate) }}
            </p>
            <p class="text-xs text-gray-400 mt-1">ID pratica #{{ tattoo.id }}</p>
        </section>

        <section
            v-if="hasCustomerDetails"
            class="bg-white rounded-xl shadow-md p-4"
        >
            <h3 class="text-sm font-bold mb-3">Dati tatuato</h3>
            <dl class="grid gap-3 text-sm">
                <div v-if="customer?.email" class="detail-row">
                    <dt class="detail-label">
                        <Mail class="size-4 shrink-0" />
                        Email
                    </dt>
                    <dd class="detail-value">{{ customer.email }}</dd>
                </div>
                <div v-if="customer?.cf" class="detail-row">
                    <dt class="detail-label">
                        <IdCard class="size-4 shrink-0" />
                        Codice fiscale
                    </dt>
                    <dd class="detail-value uppercase">{{ customer.cf }}</dd>
                </div>
                <div v-if="customer?.birthDate" class="detail-row">
                    <dt class="detail-label">
                        <Calendar class="size-4 shrink-0" />
                        Data di nascita
                    </dt>
                    <dd class="detail-value">{{ formatDisplayDate(customer.birthDate) }}</dd>
                </div>
            </dl>
        </section>

        <section
            v-if="tattooPhotos.before || tattooPhotos.after"
            class="bg-white rounded-xl shadow-md p-4"
        >
            <h3 class="text-sm font-bold mb-3">Foto del tatuaggio</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-if="tattooPhotos.before">
                    <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Prima</p>
                    <button
                        type="button"
                        class="block w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                        @click="openPhotoPreview(tattooPhotos.before, 'Prima del tatuaggio')"
                    >
                        <img
                            :src="tattooPhotos.before"
                            class="w-full aspect-[3/4] object-cover"
                            alt="Prima del tatuaggio"
                        />
                    </button>
                </div>
                <div v-if="tattooPhotos.after">
                    <p class="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Dopo</p>
                    <button
                        type="button"
                        class="block w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                        @click="openPhotoPreview(tattooPhotos.after, 'Dopo il tatuaggio')"
                    >
                        <img
                            :src="tattooPhotos.after"
                            class="w-full aspect-[3/4] object-cover"
                            alt="Dopo il tatuaggio"
                        />
                    </button>
                </div>
            </div>
        </section>

        <section class="bg-white rounded-xl shadow-md p-4 mb-2">
            <h3 class="text-sm font-bold mb-3">Caratteristiche del tatuaggio</h3>
            <dl class="grid gap-3 text-sm">
                <div class="detail-row">
                    <dt class="detail-label">Colore</dt>
                    <dd class="detail-value">{{ inkColorLabel }}</dd>
                </div>
                <div class="detail-row">
                    <dt class="detail-label">Stile</dt>
                    <dd class="detail-value">{{ tattoo.tattooStyle ?? '—' }}</dd>
                </div>
                <div class="detail-row">
                    <dt class="detail-label">Tipo</dt>
                    <dd class="detail-value">{{ tattooTypeLabel }}</dd>
                </div>
                <div class="detail-row">
                    <dt class="detail-label">Posizione</dt>
                    <dd class="detail-value">{{ tattooPositionLabel }}</dd>
                </div>
                <div class="detail-row">
                    <dt class="detail-label">Fototipo</dt>
                    <dd class="detail-value">{{ tattooSkinTypeLabel }}</dd>
                </div>
            </dl>
        </section>

        <div
            v-if="photoPreview"
            class="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-black/90 p-4"
            @click.self="closePhotoPreview"
        >
            <p class="text-white text-sm font-semibold mb-3">{{ photoPreview.label }}</p>
            <img
                :src="photoPreview.url"
                :alt="photoPreview.label"
                class="max-w-full max-h-[75vh] rounded-lg object-contain shadow-2xl"
            />
            <button
                type="button"
                class="mt-4 text-white text-sm"
                @click="closePhotoPreview"
            >
                Chiudi
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@shared/components/ui/button/Button.vue';
import {
    Award,
    Calendar,
    FileSignature,
    User,
    Mail,
    IdCard,
} from 'lucide-vue-next';
import {
    INK_COLOR_LABELS,
    TATTOO_TYPE_LABELS,
    formatDisplayDate,
    skinTypeLabel,
    positionLabel,
    syncTattooPhotos,
} from '../../../customer-fe/src/constants/tattoo.config';

const props = defineProps<{
    tattoo: Record<string, any>;
    customer?: Record<string, any> | null;
}>();

const photoPreview = ref<{ url: string; label: string } | null>(null);

const tattooPhotos = computed(() => syncTattooPhotos(props.tattoo.photoUrl));

const tattooDocuments = computed(() => {
    return [
        {
            label: 'Certificato di tatuaggio',
            url: props.tattoo.certificateUrl,
            type: 'certificate' as const,
        },
        {
            label: 'Consenso informato',
            url: props.tattoo.releaseFormUrl,
            type: 'release' as const,
        },
    ].filter((doc) => !!doc.url);
});

const hasCustomerDetails = computed(() => {
    const c = props.customer;
    if (!c) return false;
    return !!(c.email || c.cf || c.birthDate);
});

const inkColorLabel = computed(() => {
    const color = props.tattoo.color;
    if (!color) return '—';
    return INK_COLOR_LABELS[color] ?? color;
});

const tattooTypeLabel = computed(() => {
    const type = props.tattoo.tattooType;
    if (!type) return '—';
    return TATTOO_TYPE_LABELS[type]?.title ?? type;
});

const tattooPositionLabel = computed(() => positionLabel(props.tattoo.position));
const tattooSkinTypeLabel = computed(() => skinTypeLabel(props.tattoo.skinType));

const openPhotoPreview = (url: string | undefined, label: string) => {
    if (!url) return;
    photoPreview.value = { url, label };
};

const closePhotoPreview = () => {
    photoPreview.value = null;
};
</script>

<style scoped>
.detail-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgb(243 244 246);
}

.detail-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.detail-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: rgb(107 114 128);
    flex-shrink: 0;
}

.detail-value {
    text-align: right;
    font-weight: 500;
    color: rgb(17 24 39);
    word-break: break-word;
    min-width: 0;
}
</style>
