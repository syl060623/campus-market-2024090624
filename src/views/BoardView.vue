<template>
  <div class="board-container">
    <h1>看板页</h1>
    <div class="stat-wrapper">
      <div class="stat-card">
        <h3>总内容量</h3>
        <p>246</p>
      </div>
      <div class="stat-card">
        <h3>今日消息</h3>
        <p>32</p>
      </div>
      <div class="stat-card">
        <h3>活跃用户</h3>
        <p>89</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.board-container {
  padding: 20px;
}
.stat-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.stat-card {
  padding: 20px 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-card h3 {
  margin: 0 0 10px;
  color: #666;
}
.stat-card p {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #409eff;
}
</style>
