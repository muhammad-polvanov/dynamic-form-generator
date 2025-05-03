<template>
  <div class="w-full max-w-md p-4 bg-gray-50 border rounded-lg shadow-sm">
    <h2 class="text-lg font-medium mb-3">Form Preview</h2>
    <div class="bg-white p-3 rounded border overflow-auto max-h-[500px]">
      <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{
        JSON.stringify(formModel, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formModel: Record<string, string[]>
}>()
</script>
