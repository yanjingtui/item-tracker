<script setup>
import { MapPin } from 'lucide-vue-next';
defineProps(['item']);
defineEmits(['click']);
</script>

<template lang="pug">
.item-card.glass(@click="$emit('click')")
  .item-image(:style="{ backgroundImage: `url(${item.image})` }")
  .item-info
    h3 {{ item.name }}
    .item-meta
      MapPin(:size="14")
      span {{ item.room }}
    p.item-desc {{ item.description }}
</template>

<style scoped>
.item-card {
  display: flex;
  overflow: hidden;
  height: 120px;
  cursor: pointer;
  transition: transform 0.2s;
}
.item-card:active {
  transform: scale(0.98);
}
.item-image {
  width: 120px;
  background-size: cover;
  background-position: center;
}
.item-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-info h3 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 8px;
}
.item-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
