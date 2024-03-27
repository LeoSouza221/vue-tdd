<script setup lang="ts">
defineProps<{
  id: string;
  help: string;
  label: string;
  modelValue: string;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="mb-3">
    <label
      class="form-label"
      :for="id"
    >
      {{ label }}
    </label>
    <input
      class="form-control"
      :class="{ 'is-invalid': help }"
      type="text"
      id="username"
      @input="$emit('update:modelValue', $event.target?.value)"
    />
    <span class="invalid-feedback">{{ help }}</span>
  </div>
</template>
