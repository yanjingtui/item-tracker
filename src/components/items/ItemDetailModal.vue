<script setup>
import { MapPin, Trash2, X } from 'lucide-vue-next';
import { useItemStore } from '../../stores/itemStore';

defineProps(['item']);
const emit = defineEmits(['close']);
const store = useItemStore();

const handleDelete = (id) => {
  if (confirm('确定要删除这个项目吗？')) {
    store.deleteItem(id);
    emit('close');
  }
};
</script>

<template lang="pug">
Transition(name="fade")
  .modal-overlay(@click.self="$emit('close')")
    .modal-content.glass
      button.close-btn(@click="$emit('close')")
        X
      .detail-image-container
        img(:src="item.image")
        .annotation-overlay(
          v-if="item.coordinates"
          :style="{ \
            left: item.coordinates.x + '%', \
            top: item.coordinates.y + '%', \
            width: item.coordinates.w + '%', \
            height: item.coordinates.h + '%' \
          }"
        )
      .detail-info
        h2 {{ item.name }}
        .detail-meta
          MapPin(:size="16")
          span 房间: {{ item.room }}
        .detail-description
          h4 位置描述
          p {{ item.description }}
        button.btn.delete-btn(@click="handleDelete(item.id)")
          Trash2(:size="18")
          |  删除记录
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.detail-image-container {
  position: relative;
  width: 100%;
}
.detail-image-container img {
  width: 100%;
  display: block;
}
.annotation-overlay {
  position: absolute;
  border: 2px solid var(--secondary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--secondary-glow);
  pointer-events: none;
}
.detail-info {
  padding: 24px;
}
.detail-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  margin: 8px 0 20px 0;
}
.detail-description h4 {
  margin-bottom: 10px;
  color: var(--primary);
}
.detail-description p {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 24px;
}
.delete-btn {
  width: 100%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
