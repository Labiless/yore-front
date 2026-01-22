<template>
    <div class="flex flex-col gap-2 relative">
        <canvas class="bg-white rounded-2xl border-0 shadow-xl" ref="signatureCanvas" @mousedown="startDrawing"
            @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing" @touchstart.prevent="startDrawing"
            @touchmove.prevent="draw" @touchend="stopDrawing" :width="width" :height="height"></canvas>
        <RotateCcw @click="clearSignature" class="absolute right-2 top-2 bg-red-500 rounded-full p-2 w-8 h-8"
            color="white" />
    </div>
</template>

<script setup>
import Button from '@shared/components/ui/button/Button.vue';
import { RotateCcw } from 'lucide-vue-next';
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

const emit = defineEmits(['signature-saved']);

const signatureCanvas = ref(null);
let ctx = null;
let isDrawing = false;
const isSigned = ref(false);
onMounted(() => {
    ctx = signatureCanvas.value.getContext('2d');
    ctx.strokeStyle = props.lineColor;
    ctx.lineWidth = props.lineWidth;
    ctx.lineCap = 'round';
});

const getCoords = (event) => {
    const canvas = signatureCanvas.value;
    const rect = canvas.getBoundingClientRect();

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    // rapporto tra coordinate canvas interne e dimensioni CSS
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
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