<template>
    <div class="flex flex-col gap-2">
        <canvas class="bg-white rounded-2xl border-0 shadow-xl" ref="signatureCanvas" @mousedown="startDrawing"
            @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing" @touchstart.prevent="startDrawing"
            @touchmove.prevent="draw" @touchend="stopDrawing" :width="width" :height="height"></canvas>
    </div>
</template>

<script setup>
import Button from '@shared/components/ui/button/button.vue';
import { ref, onMounted, defineEmits } from 'vue';

// Definisci le proprietà (props) per larghezza e altezza del canvas
const props = defineProps({
    width: {
        type: Number,
        default: 300,
    },
    height: {
        type: Number,
        default: 150,
    },
    lineColor: {
        type: String,
        default: '#000000',
    },
    lineWidth: {
        type: Number,
        default: 2,
    },
});

// Definisci l'evento che esporrà i dati della firma
const emit = defineEmits(['signature-saved']);

// Riferimenti reattivi
const signatureCanvas = ref(null);
let ctx = null; // Il contesto del canvas 2D
let isDrawing = false;
const isSigned = ref(false); // Stato per abilitare/disabilitare i pulsanti

onMounted(() => {
    // 1. Inizializza il contesto 2D del canvas
    ctx = signatureCanvas.value.getContext('2d');

    // 2. Configura le proprietà del tratto
    ctx.strokeStyle = props.lineColor;
    ctx.lineWidth = props.lineWidth;
    ctx.lineCap = 'round'; // Linee più arrotondate e naturali
});

/**
 * Funzione per ottenere le coordinate (Mouse o Touch)
 * @param {Event} event - L'evento del mouse o del touch
 * @returns {{x: number, y: number}} - Le coordinate x e y relative al canvas
 */
const getCoords = (event) => {
    const rect = signatureCanvas.value.getBoundingClientRect();
    let clientX, clientY;

    // Gestione specifica per gli eventi touch
    if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        // Gestione per gli eventi mouse
        clientX = event.clientX;
        clientY = event.clientY;
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};

/** Inizia la fase di disegno */
const startDrawing = (event) => {
    const { x, y } = getCoords(event);
    isDrawing = true;
    isSigned.value = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
};

/** Disegna la linea */
const draw = (event) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(event);
    ctx.lineTo(x, y);
    ctx.stroke();
};

/** Termina la fase di disegno */
const stopDrawing = () => {
    isDrawing = false;
    ctx.closePath();
};

/** Pulisce l'intero canvas */
const clearSignature = () => {
    ctx.clearRect(0, 0, props.width, props.height);
    isSigned.value = false;
};

/** Salva l'immagine e la invia tramite evento */
const saveSignature = () => {
    if (!isSigned.value) return;
    const imageDataURL = signatureCanvas.value.toDataURL('image/png');
    return imageDataURL;
    // emit('signature-saved', imageDataURL);
};

defineExpose({
  saveSignature,
  isSigned,
});

</script>