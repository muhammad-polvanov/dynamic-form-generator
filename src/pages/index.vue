<template>
  <div class="container py-20">
    <div class="flex items-start gap-10">
      <DynamicForm v-model="formModel" />
      <div class="w-full max-w-md p-4 bg-gray-50 border rounded-lg shadow-sm">
        <h2 class="text-lg font-medium mb-3">Form Preview</h2>
        <div
          v-if="Object.keys(formModel).length"
          class="bg-white p-3 rounded border overflow-auto max-h-[500px]"
        >
          <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{
            JSON.stringify(formModel, null, 2)
          }}</pre>
        </div>
        <div v-else class="bg-white p-3 rounded border text-gray-500 text-sm">
          No data yet. Fill the form to see values here.
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import DynamicForm from "../components/dynamic-form/DynamicForm.vue"

defineOptions({
  name: "IndexPage",
})

const formModel = ref({})
</script>
<style scoped></style>
