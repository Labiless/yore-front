<template>
    <div v-if="user" class="account-page mx-auto w-full items-start overflow-y-auto hide-scrollbar pb-24">
        <div class="mb-4 bg-white rounded-xl w-full p-4 flex flex-col gap-3 min-w-0 shadow-md">
            <div v-if="user.businessName" class="user-info-row">
                <Building2 class="user-info-icon" />
                <span class="user-field text-xl font-bold">{{ user.businessName }}</span>
            </div>
        </div>

        <div class="flex flex-col w-full gap-2 min-w-0">
            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 shadow-md">
                <p class="font-bold mb-2">Contatti</p>
                <div v-if="user.email" class="user-info-row">
                    <Mail class="user-info-icon" />
                    <span class="user-field" x-apple-data-detectors="false">{{ user.email }}</span>
                </div>
                <div v-if="user.phone" class="user-info-row">
                    <Phone class="user-info-icon" />
                    <span class="user-field">{{ user.phone }}</span>
                </div>
            </div>

            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 shadow-md">
                <p class="font-bold mb-2">Indirizzo</p>
                <div v-if="user.country" class="user-info-row">
                    <Globe class="user-info-icon" />
                    <span class="user-field">{{ user.country }}</span>
                </div>
                <div v-if="user.city" class="user-info-row">
                    <MapPin class="user-info-icon" />
                    <span class="user-field">{{ user.city }}</span>
                </div>
                <div v-if="user.cap" class="user-info-row">
                    <Mailbox class="user-info-icon" />
                    <span class="user-field">{{ user.cap }}</span>
                </div>
                <div v-if="user.province" class="user-info-row">
                    <MapPinned class="user-info-icon" />
                    <span class="user-field">{{ user.province }}</span>
                </div>
                <div v-if="user.address" class="user-info-row">
                    <Home class="user-info-icon" />
                    <span class="user-field">{{ user.address }}</span>
                </div>
            </div>

            <div class="mb-4 bg-white rounded-xl w-full p-4 min-w-0 shadow-md">
                <p class="font-bold mb-2">Dati azienda</p>
                <div v-if="user.legalForm" class="user-info-row">
                    <Scale class="user-info-icon" />
                    <span class="user-field">{{ user.legalForm }}</span>
                </div>
                <div v-if="user.piva" class="user-info-row">
                    <BookMarked class="user-info-icon" />
                    <span class="user-field">{{ user.piva }}</span>
                </div>
                <div v-if="user.cf" class="user-info-row">
                    <IdCard class="user-info-icon" />
                    <span class="user-field">{{ user.cf }}</span>
                </div>
                <div v-if="user.fePecAddress" class="user-info-row">
                    <Inbox class="user-info-icon" />
                    <span class="user-field">{{ user.fePecAddress }}</span>
                </div>
                <div v-if="user.pecMail" class="user-info-row">
                    <AtSign class="user-info-icon" />
                    <span class="user-field" x-apple-data-detectors="false">{{ user.pecMail }}</span>
                </div>
                <div v-if="user.taxCode" class="user-info-row">
                    <FileText class="user-info-icon" />
                    <span class="user-field">{{ user.taxCode }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { userService } from '@/services/api.user.service';
import {
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Mailbox,
    MapPinned,
    Home,
    Scale,
    BookMarked,
    IdCard,
    Inbox,
    AtSign,
    FileText,
} from 'lucide-vue-next';

const uiStore = useUiStore();
const userStore = useUserStore();
const user = ref<any>(null);

onMounted(async () => {
    uiStore.title = 'Account';
    uiStore.loading = true;
    user.value = await userService.getUserByUuid(userStore.getUiid);
    uiStore.loading = false;
});
</script>

<style scoped>
.account-page .user-field {
    text-decoration: none;
    color: inherit;
    cursor: default;
    flex: 1;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
    -webkit-text-decoration: none;
    text-decoration-skip-ink: none;
}

.account-page .user-info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.25rem 0;
    min-width: 0;
}

.account-page .user-info-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: rgb(75 85 99);
}
</style>
