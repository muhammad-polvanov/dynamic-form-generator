<template>
  <div>
    <el-form label-position="top">
      <el-form-item label="Field Label">
        <el-input v-model="formField.label" placeholder="Enter field label" />
      </el-form-item>

      <el-form-item label="Field Placeholder">
        <el-input
          v-model="formField.placeholder"
          placeholder="Enter field placeholder"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveChanges">Save Changes</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

// Define proper types for the form field
interface BaseField {
  key: string
  type: string
  label: string
  name: string
  placeholder?: string
  editable?: boolean
  rules?: Array<{
    required?: boolean
    message: string
    type?: string
    min?: number
  }>
}

// Define props with proper typing
const props = defineProps<{
  field: BaseField
}>()

// Define emits with proper typing
const emit = defineEmits<{
  (e: "update:field", field: BaseField): void
  (e: "save", field: BaseField): void
}>()

// Create a reactive copy of the field to edit
const formField = ref<BaseField>({
  key: "",
  type: "",
  label: "",
  name: "",
  placeholder: "",
  editable: true,
})

// Initialize the form field when props change
watch(
  () => props.field,
  (newField) => {
    if (newField) {
      // Create a deep copy to avoid direct mutation
      formField.value = JSON.parse(JSON.stringify(newField))
    }
  },
  { immediate: true }
)

// Function to save changes
const saveChanges = () => {
  // Emit the updated field for parent component to handle
  emit("update:field", formField.value)
  emit("save", formField.value)
}
</script>
