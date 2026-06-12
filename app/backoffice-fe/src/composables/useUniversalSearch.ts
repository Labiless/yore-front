import { useRouter } from 'vue-router';

export const UUID_REGEX = /^([a-z]{2,4}_)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getUuidPrefix(uuid: string): string {
    const match = uuid.match(/^([a-z]{2,4})_/);
    return match ? match[1] : '';
}

export function useUniversalSearch() {
    const router = useRouter();

    /**
     * Routes to the correct section based on UUID prefix.
     * lbl_ → /labels?label=uuid   (Labels.vue opens label detail inline)
     * lbt_ → /labels/:uuid        (Labels.vue opens batch inline)
     * ink_ → /warehouse?ink=uuid  (Warehouse.vue opens batch inline)
     * ibt_ → /warehouse/:uuid     (Warehouse.vue opens batch inline)
     * usr_ → /users/:uuid         (Users.vue opens user inline)
     * Returns true if navigation was triggered.
     */
    const navigateByUuid = (uuid: string): boolean => {
        const prefix = getUuidPrefix(uuid);
        switch (prefix) {
            case 'lbl':
                router.push({ path: '/labels', query: { label: uuid } });
                return true;
            case 'lbt':
                router.push(`/labels/${uuid}`);
                return true;
            case 'ink':
                router.push({ path: '/warehouse', query: { ink: uuid } });
                return true;
            case 'ibt':
                router.push(`/warehouse/${uuid}`);
                return true;
            case 'usr':
                router.push(`/users/${uuid}`);
                return true;
        }
        return false;
    };

    return { navigateByUuid, getUuidPrefix, UUID_REGEX };
}
