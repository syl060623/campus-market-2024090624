import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref<number[]>([1, 5, 8])

  const favoriteCount = computed(() => favoriteIds.value.length)

  function isFavorited(id: number): boolean {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id: number) {
    const idx = favoriteIds.value.indexOf(id)
    if (idx > -1) {
      favoriteIds.value.splice(idx, 1)
    } else {
      favoriteIds.value.push(id)
    }
  }

  function addFavorite(id: number) {
    if (!favoriteIds.value.includes(id)) {
      favoriteIds.value.push(id)
    }
  }

  function removeFavorite(id: number) {
    const idx = favoriteIds.value.indexOf(id)
    if (idx > -1) {
      favoriteIds.value.splice(idx, 1)
    }
  }

  return { favoriteIds, favoriteCount, isFavorited, toggleFavorite, addFavorite, removeFavorite }
})
