<template>
  <div class="container py-20">
    <div class="flex items-start gap-10">
      <DynamicForm
        v-model="formModel"
        :form-rules="formRules"
        :key="isDragging ? 'dragging' : 'not-dragging'"
        :form-data="typedFormData"
        @dragOver="handleDragOver"
      />
      <div>
        <FormPreview :form-model="formModel" />
        <DraggableFields
          :is-dragging="isDragging"
          :dragged-element="draggedElement"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as formData from "../data/index.json"

import DynamicForm from "../components/dynamic-form/DynamicForm.vue"
import FormPreview from "../components/dynamic-form/FormPreview.vue"
import DraggableFields from "../components/dynamic-form/DraggableFields.vue"
import { useDraggable } from "../composables/useDraggable"
import { useState } from "../composables/useState"

const { formModel, formRules, typedFormData } = useState(formData)

const {
  isDragging,
  draggedElement,
  handleDragOver,
  handleDragStart,
  handleDragEnd,
} = useDraggable(typedFormData.form.form_data)
</script>
<style scoped>
.cursor-move {
  cursor: move;
}
</style>
