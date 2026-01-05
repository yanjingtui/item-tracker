<script setup>
import { ref } from 'vue';
import { Camera, X, Check, Loader2 } from 'lucide-vue-next';
import { useCanvas } from '../../hooks/useCanvas';
import { analyzeLocation } from '../../services/aiService';
import { useItemStore } from '../../stores/itemStore';

const emit = defineEmits(['close']);
const store = useItemStore();
const { canvasRef, coordinates, initCanvas, startDraw, draw, endDraw } = useCanvas();

const step = ref('photo');
const imageSrc = ref(null);
const fileInput = ref(null);
const roomName = ref('');
const itemName = ref('');
const isProcessing = ref(false);

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    imageSrc.value = event.target.result;
    step.value = 'annotate';
  };
  reader.readAsDataURL(file);
};

const triggerFileInput = () => fileInput.value.click();

const handleProcess = async () => {
  if (!roomName.value || !itemName.value) return;
  isProcessing.value = true;
  step.value = 'loading';
  try {
    const description = await analyzeLocation(imageSrc.value, itemName.value, roomName.value);
    store.addItem({
      name: itemName.value,
      room: roomName.value,
      image: imageSrc.value,
      coordinates: coordinates.value,
      description
    });
    emit('close');
  } catch (error) {
    alert('AI 分析失败');
    step.value = 'annotate';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template lang="pug">
.capture-overlay
  .capture-container.glass
    .capture-header
      h2 {{ step === 'photo' ? '拍摄/上传' : step === 'annotate' ? '圈出物品' : 'AI 处理中' }}
      button.close-icon(@click="$emit('close')")
        X

    .photo-step(v-if="step === 'photo'")
      .upload-area(@click="triggerFileInput")
        Camera(:size="48")
        p 拍摄或从相册选择
        input(type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" capture="environment" hidden)

    .annotate-step(v-if="step === 'annotate'")
      p.instruction 在照片上拖动，圈出你想记录的物品
      .canvas-container
        canvas(
          ref="canvasRef"
          @mousedown="e => startDraw(e)"
          @mousemove="e => draw(e, imageSrc)"
          @mouseup="endDraw"
          @touchstart="e => startDraw(e)"
          @touchmove="e => draw(e, imageSrc)"
          @touchend="endDraw"
          v-mounted="() => initCanvas(imageSrc)"
        )
      .form-overlay.glass
        .input-group
          label 物品名称
          input(v-model="itemName" placeholder="例如：吹风机")
        .input-group
          label 所在房间
          input(v-model="roomName" placeholder="例如：主卧浴室")
        button.btn.btn-primary.full-width(:disabled="!itemName || !roomName || !coordinates" @click="handleProcess")
          Check(:size="18")
          |  生成位置并保存

    .loading-step(v-if="step === 'loading'")
      Loader2.spin(:size="48")
      p Gemini 正在分析位置...
</template>

<style scoped>
.capture-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.capture-container {
  width: 100%; height: 100%; max-width: 500px;
  display: flex; flex-direction: column; overflow: hidden;
}
.capture-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; }
.close-icon { background: none; border: none; color: var(--text-muted); }
.photo-step { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; }
.upload-area {
  width: 200px; height: 200px; border: 2px dashed var(--glass-border);
  border-radius: 20px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; color: var(--text-muted);
}
.annotate-step { flex: 1; display: flex; flex-direction: column; position: relative; }
.canvas-container { flex: 1; background: black; display: flex; align-items: center; overflow: hidden; }
canvas { width: 100%; touch-action: none; }
.form-overlay { padding: 20px; border-radius: 20px 20px 0 0; }
.instruction { text-align: center; padding: 10px; color: var(--primary); font-size: 0.9rem; }
.loading-step { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
.spin { animation: spin 2s linear infinite; color: var(--primary); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.full-width { width: 100%; }
</style>
