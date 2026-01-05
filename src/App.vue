<script setup>
import { ref } from 'vue';
import { Search, Plus, Package } from 'lucide-vue-next';
import { useItemStore } from './stores/itemStore';
import ItemCard from './components/items/ItemCard.vue';
import ItemDetailModal from './components/items/ItemDetailModal.vue';
import CaptureModal from './components/capture/CaptureModal.vue';

const store = useItemStore();
const showCapture = ref(false);
const selectedItem = ref(null);
</script>

<template lang="pug">
.app-container
  header.glass.header
    h1 物品管家
    .search-bar
      Search.search-icon(:size="18")
      input(v-model="store.searchQuery" placeholder="查找物品或房间...")

  main.content
    .empty-state(v-if="store.filteredItems.length === 0")
      Package.empty-icon(:size="64")
      p 还没有记录任何物品
      span 点击下方的 + 号开始添加

    .item-list(v-else)
      ItemCard(
        v-for="item in store.filteredItems"
        :key="item.id"
        :item="item"
        @click="selectedItem = item"
      )

  button.fab.btn-primary(@click="showCapture = true")
    Plus(:size="28")

  // Modals
  ItemDetailModal(
    v-if="selectedItem"
    :item="selectedItem"
    @close="selectedItem = null"
  )
  
  Transition(name="slide-up")
    CaptureModal(
      v-if="showCapture"
      @close="showCapture = false"
    )
</template>

<style scoped>
.app-container { display: flex; flex-direction: column; height: 100vh; padding: 16px; }
.header { padding: 20px; margin-bottom: 20px; }
h1 {
  font-size: 1.5rem; margin-bottom: 15px;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.search-bar { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; color: var(--text-muted); }
.search-bar input { padding-left: 40px; }
.content { flex: 1; overflow-y: auto; padding-bottom: 80px; }
.item-list { display: grid; gap: 16px; }
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; color: var(--text-muted);
}
.empty-icon { margin-bottom: 16px; opacity: 0.5; }
.fab {
  position: fixed; right: 20px; bottom: 30px;
  width: 60px; height: 60px; border-radius: 30px; z-index: 10;
}
</style>
