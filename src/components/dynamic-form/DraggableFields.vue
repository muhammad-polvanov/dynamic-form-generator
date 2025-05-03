<template>
  <div class="mt-10">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium">Draggable Elements</h3>
    </div>
    <div
      v-for="element in draggableElements"
      :key="element.key"
      class="p-3 mb-2 border rounded-md bg-white cursor-move transition-all"
      :class="{
        'opacity-50': isDragging && draggedElement?.key === element.key,
      }"
      draggable="true"
      @dragstart="handleDragStart(element)"
      @dragend="handleDragEnd"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">{{ element.label }}</span>
        <span class="text-xs text-gray-500">{{ element.type }}</span>
      </div>
      <el-input
        v-if="element.type === 'input'"
        :placeholder="element.placeholder"
        type="text"
        disabled
        class="mt-2"
      />
      <el-input
        v-if="element.type === 'textarea'"
        :placeholder="element.placeholder"
        type="textarea"
        disabled
        class="mt-2"
      />
      <el-date-picker
        v-if="element.type === 'datepicker'"
        :placeholder="element.placeholder"
        disabled
        class="mt-2"
      />
      <el-select
        v-if="element.type === 'select'"
        disabled
        class="mt-2"
      ></el-select>
      <el-radio-group
        v-if="element.type === 'radioGroup'"
        disabled
        class="mt-2"
      >
        <el-radio
          v-for="option in element.options"
          :key="option.value"
          :label="option.label"
        ></el-radio>
      </el-radio-group>
      <el-checkbox
        v-if="element.type === 'checkbox' && !element.multiple"
        :label="element.label"
      />
      <el-checkbox-group v-if="element.type === 'checkbox' && element.multiple">
        <el-checkbox
          v-for="option in element.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import { draggableElements } from "../../data/fields"
import type { FormField } from "../../types/form-schema"
interface Props {
  isDragging: boolean
  draggedElement: FormField | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: "dragStart", element: FormField): void
  (e: "dragEnd"): void
}>()

const handleDragStart = (element: FormField) => {
  emit("dragStart", element)
}

const handleDragEnd = () => {
  emit("dragEnd")
}
</script>
