<template>
  <el-form
    class="w-full"
    :model="formModel"
    :rules="formRules"
    ref="formRef"
    label-position="top"
    @submit.prevent="handleSubmit"
  >
    <h1 class="text-2xl font-bold mb-2">{{ typedFormData.form.title }}</h1>
    <template v-for="section in typedFormData.form.form_data" :key="section.id">
      <el-row :gutter="20">
        <template v-for="(field, index) in section.fields" :key="field.key">
          <el-col :span="24 / (section.columns || 1)">
            <el-form-item :label="field.label" :prop="field.name">
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
                :form-data="typedFormData.form.form_data"
              />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
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
import { ref, reactive } from "vue"
import * as formData from "../../data/index.json"
import { ElMessage } from "element-plus"
import { Edit } from "@element-plus/icons-vue"
import EditDynamicField from "./EditDynamicField.vue"
import DynamicField from "./DynamicField.vue"
import type {
  FormField,
  InputField,
  FormSection,
  FormModel,
  FormRules,
  BaseFormField,
} from "../../types/form-schema"

// Type assertion for the imported JSON data
const typedFormData = reactive(
  formData as {
    form: {
      title: string
      form_data: FormSection[]
    }
  }
)

const formRef = ref()
const formModel = defineModel<FormModel>({ required: true })
const formRules = ref<FormRules>({})

// Initialize form model with empty values and rules
const initializeFormModel = () => {
  typedFormData.form.form_data.forEach((section: FormSection) => {
    section.fields.forEach((field: FormField) => {
      if (field.type === "checkbox" && field.multiple) {
        formModel.value[field.name] = []
      } else {
        formModel.value[field.name] = ""
      }

      // Initialize form rules
      if (field.rules) {
        formRules.value[field.name] = field.rules.map((rule) => ({
          required: rule.required,
          message: rule.message,
          type: rule.type,
          min: rule.min,
          trigger: ["blur", "change"],
        }))
      }
    })
  })
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
  const sections = typedFormData.form.form_data
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

      // Handle special case for input fields with variant
      if (
        newField.type === "input" &&
        updatedField.type === "input" &&
        "variant" in updatedField
      ) {
        ;(newField as InputField).variant = (updatedField as InputField).variant
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

// Initialize form on component mount
initializeFormModel()
</script>

<style scoped></style>
