<template>
  <div class="container py-20">
    <div class="flex items-start gap-10">
      <DynamicForm v-model="formModel" />
      <FormPreview :form-model="formModel" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import DynamicForm from "../components/dynamic-form/DynamicForm.vue"
import FormPreview from "../components/dynamic-form/FormPreview.vue"
defineOptions({
  name: "IndexPage",
})

const formModel = ref({})
</script>
<style scoped></style>
