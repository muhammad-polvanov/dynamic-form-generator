<template>
  <el-form
    class="w-full"
    :model="formModel"
    :rules="formRules"
    ref="formRef"
    label-position="top"
    @submit.prevent="handleSubmit"
  >
    <h1 class="text-2xl font-bold mb-2">{{ formData.form.title }}</h1>
    <template v-for="section in formData.form.form_data" :key="section.id">
      <div
        class="form-section border border-transparent rounded-md transition-all"
        :class="{ 'drop-target': isDragTarget(section.id) }"
        @dragover.prevent="handleSectionDragOver($event, section.id)"
        @dragleave="handleSectionDragLeave(section.id)"
        @drop.prevent="handleSectionDrop"
      >
        <el-row :gutter="20">
          <template v-for="field in section.fields" :key="field.id">
            <el-col :span="24 / (section.columns || 1)">
              <el-form-item
                :label="field.label"
                :prop="field.name"
                @dragover="handleDragOver(section.id)"
              >
                <template #label>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ field.label }}</span>
                    <ElIcon
                      v-if="field.editable"
                      class="cursor-pointer hover:text-blue-500"
                      @click.prevent.stop="handleEditField(field)"
                    >
                      <Edit />
                    </ElIcon>
                  </div>
                </template>
                <DynamicField
                  v-model="formModel"
                  :field="field"
                  :form-data="formData.form.form_data"
                />
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </div>
    </template>
    <el-button type="primary" @click="handleSubmit">Submit</el-button>

    <!-- Field Editor Dialog -->
    <el-dialog
      v-model="showFieldEditor"
      title="Edit Field"
      width="500px"
      :close-on-click-modal="false"
    >
      <EditDynamicField
        v-if="editingField"
        :field="editingField"
        @save="saveFieldChanges"
      />
    </el-dialog>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { Edit } from "@element-plus/icons-vue"
import EditDynamicField from "./EditDynamicField.vue"
import DynamicField from "./DynamicField.vue"
import type {
  FormField,
  InputField,
  FormModel,
  BaseFormField,
  FormData,
  FormRule,
} from "../../types/form-schema"

const props = defineProps<{
  formData: FormData
  formRules: FormRule
}>()

const emit = defineEmits<{
  (e: "dragOver", sectionId: number): void
}>()

// Type assertion for the imported JSON data

const formRef = ref()
const formModel = defineModel<FormModel>({ required: true })

// Dragging state
const currentDragTarget = ref<number | null>(null)

// Check if section is current drag target
const isDragTarget = (sectionId: number): boolean => {
  return currentDragTarget.value === sectionId
}

// Handle dragover event
const handleSectionDragOver = (event: DragEvent, sectionId: number) => {
  event.preventDefault()
  currentDragTarget.value = sectionId
  emit("dragOver", sectionId)
}

// Handle dragleave event
const handleSectionDragLeave = (sectionId: number) => {
  if (currentDragTarget.value === sectionId) {
    currentDragTarget.value = null
  }
}

// Handle drop event
const handleSectionDrop = () => {
  // Reset drag target
  currentDragTarget.value = null
}

// Legacy handler kept for compatibility with existing calls
const handleDragOver = (sectionId: number) => {
  currentDragTarget.value = sectionId
  emit("dragOver", sectionId)
}

// Field editing functionality
const showFieldEditor = ref(false)
const editingField = ref<FormField | null>(null)

const handleEditField = (field: FormField) => {
  editingField.value = field
  showFieldEditor.value = true
}

const saveFieldChanges = (updatedField: BaseFormField | InputField) => {
  if (!editingField.value) return
  // Find the field in the form data and update it
  const sections = props.formData.form.form_data
  for (const section of sections) {
    const fieldIndex = section.fields.findIndex(
      (f) => f.key === updatedField.key
    )
    if (fieldIndex !== -1) {
      // Create a new field object to trigger reactivity
      const newField = { ...section.fields[fieldIndex] }
      // Update common properties
      newField.label = updatedField.label
      if (updatedField.placeholder) {
        newField.placeholder = updatedField.placeholder
      }

      // Replace the old field with the new one
      section.fields[fieldIndex] = newField
      break
    }
  }

  // Close the editor
  showFieldEditor.value = false
  editingField.value = null

  // Optional: Show success message
  ElMessage.success("Field updated successfully")
}

// Handle form submission
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    console.log("Form submitted:", formModel.value)
    ElMessage.success("Form submitted successfully!")
  } catch (error: unknown) {
    console.error("Form validation failed:", error)
    ElMessage.error("Please fill in all required fields correctly")
  }
}
</script>

<style scoped>
.form-section {
  background-color: white;
}

.drop-target {
  background-color: #ecf5ff;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
