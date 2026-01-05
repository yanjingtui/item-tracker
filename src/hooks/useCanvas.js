import { ref } from 'vue';

export function useCanvas() {
    const canvasRef = ref(null);
    const isDrawing = ref(false);
    const coordinates = ref(null);
    let startX, startY;

    const initCanvas = (imageSrc) => {
        if (!canvasRef.value) return;
        const ctx = canvasRef.value.getContext('2d');
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            canvasRef.value.width = canvasRef.value.offsetWidth;
            canvasRef.value.height = (img.height / img.width) * canvasRef.value.width;
            ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height);
        };
    };

    const startDraw = (e, imageSrc) => {
        isDrawing.value = true;
        const rect = canvasRef.value.getBoundingClientRect();
        startX = (e.clientX || e.touches[0].clientX) - rect.left;
        startY = (e.clientY || e.touches[0].clientY) - rect.top;
    };

    const draw = (e, imageSrc) => {
        if (!isDrawing.value) return;
        const ctx = canvasRef.value.getContext('2d');
        const rect = canvasRef.value.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        const img = new Image();
        img.src = imageSrc;
        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        ctx.drawImage(img, 0, 0, canvasRef.value.width, canvasRef.value.height);

        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.stroke();

        coordinates.value = {
            x: ((startX - radius) / canvasRef.value.width) * 100,
            y: ((startY - radius) / canvasRef.value.height) * 100,
            w: (radius * 2 / canvasRef.value.width) * 100,
            h: (radius * 2 / canvasRef.value.height) * 100
        };
    };

    const endDraw = () => {
        isDrawing.value = false;
    };

    return {
        canvasRef,
        coordinates,
        initCanvas,
        startDraw,
        draw,
        endDraw
    };
}
