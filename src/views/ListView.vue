<template>
  <div>
    <h1>列表页</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        <router-link :to="`/detail/${item.id}`">
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const items = [
  { id: 1, name: '商品一' },
  { id: 2, name: '商品二' },
  { id: 3, name: '商品三' },
]
</script>

