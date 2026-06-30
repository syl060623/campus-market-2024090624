<template>
  <div class="form-field" :class="{ 'has-error': error }">
    <label v-if="label" class="form-field__label">
      {{ label }}
      <span v-if="required" class="form-field__required">*</span>
    </label>
    <div class="form-field__content">
      <slot />
    </div>
    <p v-if="error" class="form-field__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
  error?: string
}>()
</script>

<style scoped>
.form-field {
  margin-bottom: 20px;
}

.form-field__label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
}

.form-field__required {
  color: #EF4444;
  margin-left: 2px;
}

.form-field__content {
  width: 100%;
}

.form-field__error {
  margin: 4px 0 0;
  font-size: 12px;
  color: #EF4444;
  line-height: 1.4;
}

.has-error :deep(.el-input__wrapper),
.has-error :deep(.el-select__wrapper),
.has-error :deep(.el-textarea__wrapper) {
  box-shadow: 0 0 0 1px #EF4444 inset;
}
</style>
