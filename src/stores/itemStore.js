import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useItemStore = defineStore('items', () => {
    // State
    const items = ref(JSON.parse(localStorage.getItem('item-tracker-items') || '[]'));
    const searchQuery = ref('');

    // Getters (computed)
    const filteredItems = computed(() => {
        if (!searchQuery.value) return items.value;
        const query = searchQuery.value.toLowerCase();
        return items.value.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.room.toLowerCase().includes(query)
        );
    });

    // Actions (functions)
    function addItem(newItem) {
        const item = {
            id: Date.now(),
            ...newItem,
            date: new Date().toISOString()
        };
        items.value.unshift(item);
    }

    function deleteItem(id) {
        items.value = items.value.filter(i => i.id !== id);
    }

    // Persistence (watch equivalent of saveToLocal)
    watch(items, (newItems) => {
        localStorage.setItem('item-tracker-items', JSON.stringify(newItems));
    }, { deep: true });

    return {
        items,
        searchQuery,
        filteredItems,
        addItem,
        deleteItem
    };
});
