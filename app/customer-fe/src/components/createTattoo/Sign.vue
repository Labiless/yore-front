<template>

    <div class="flex flex-col gap-2 relative">

        <canvas class="bg-white rounded-2xl border-0 shadow-xl" ref="signatureCanvas" @mousedown="startDrawing"

            @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing" @touchstart.prevent="startDrawing"

            @touchmove.prevent="draw" @touchend="stopDrawing" :width="width" :height="height"></canvas>

        <RotateCcw @click="clearSignature" class="absolute right-2 top-2 bg-red-500 rounded-full p-2 w-8 h-8"

            color="white" />

    </div>

</template>



<script setup lang="ts">

import { RotateCcw } from 'lucide-vue-next';

import { ref, onMounted } from 'vue';



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



const signatureCanvas = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;

let isDrawing = false;

const isSigned = ref(false);



onMounted(() => {

    if (!signatureCanvas.value) return;

    ctx = signatureCanvas.value.getContext('2d');

    if (!ctx) return;

    ctx.strokeStyle = props.lineColor;

    ctx.lineWidth = props.lineWidth;

    ctx.lineCap = 'round';

});



const getCoords = (event: MouseEvent | TouchEvent) => {

    const canvas = signatureCanvas.value;

    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();



    const touch = 'touches' in event ? event.touches[0] : undefined;

    const clientX = touch?.clientX ?? (event as MouseEvent).clientX;

    const clientY = touch?.clientY ?? (event as MouseEvent).clientY;



    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;



    return {

        x: (clientX - rect.left) * scaleX,

        y: (clientY - rect.top) * scaleY,

    };

};



const startDrawing = (event: MouseEvent | TouchEvent) => {

    if (!ctx) return;

    const { x, y } = getCoords(event);

    isDrawing = true;

    isSigned.value = true;

    ctx.beginPath();

    ctx.moveTo(x, y);

};



const draw = (event: MouseEvent | TouchEvent) => {

    if (!isDrawing || !ctx) return;

    const { x, y } = getCoords(event);

    ctx.lineTo(x, y);

    ctx.stroke();

};



const stopDrawing = () => {

    isDrawing = false;

    ctx?.closePath();

};



const clearSignature = () => {

    if (!ctx) return;

    ctx.clearRect(0, 0, props.width, props.height);

    isSigned.value = false;

};



const saveSignature = () => {

    if (!isSigned.value || !signatureCanvas.value) return;

    return signatureCanvas.value.toDataURL('image/png');

};



defineExpose({

    saveSignature,

    isSigned,

});



</script>

