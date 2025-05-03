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
    <template v-for="(section, i) in typedFormData.form.form_data" :key="i">
      <div class="section-wrapper">
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
                <!-- Text Input -->
                <el-input
                  v-if="isInputField(field)"
                  v-model="formModel[field.name]"
                  :placeholder="field.placeholder"
                  :type="field.variant"
                  :rules="field.rules"
                />

                <!-- Text Area -->
                <el-input
                  v-else-if="isTextAreaField(field)"
                  v-model="formModel[field.name]"
                  :placeholder="field.placeholder"
                  type="textarea"
                />
                <!-- Date Picker -->
                <el-date-picker
                  v-else-if="isDateField(field)"
                  v-model="formModel[field.name]"
                  type="date"
                  :placeholder="field.placeholder"
                />

                <!-- Select with Child -->
                <template
                  v-else-if="isSelectField(field) && field.childIncluded"
                >
                  <el-select
                    v-model="formModel[field.name]"
                    :placeholder="field.placeholder"
                    @change="handleParentSelectChange"
                  >
                    <el-option
                      v-for="option in field.options"
                      :key="option.id"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-select>
                  <el-select
                    v-model="formModel[field.childName]"
                    :placeholder="field.childPlaceholder"
                    class="mt-2"
                  >
                    <el-option
                      v-for="childOption in getChildOptions(field)"
                      :key="childOption.id"
                      :label="childOption.label"
                      :value="childOption.value"
                    />
                  </el-select>
                </template>

                <!-- Radio Group -->
                <el-radio-group
                  v-else-if="isRadioField(field)"
                  v-model="formModel[field.name]"
                >
                  <el-radio
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </el-radio>
                </el-radio-group>

                <!-- Checkbox -->
                <template v-else-if="isCheckboxField(field)">
                  <el-checkbox
                    v-if="!field.multiple"
                    v-model="formModel[field.name]"
                    :label="field.label"
                  />
                  <el-checkbox-group v-else v-model="formModel[field.name]">
                    <el-checkbox
                      v-for="option in field.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-form-item>
            </el-col>
            <!-- Add a new row after reaching the column count -->
            <el-col
              v-if="
                (index + 1) % section.columns === 0 &&
                index !== section.fields.length - 1
              "
              :span="24"
              class="row-separator"
            ></el-col>
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
      <DynamicField
        v-if="editingField"
        :field="editingField"
        @save="saveFieldChanges"
      />
    </el-dialog>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import * as formData from "../../data/index.json"
import { ElMessage } from "element-plus"
import { Edit } from "@element-plus/icons-vue"
import DynamicField from "./DynamicField.vue"

interface FormOption {
  id?: number
  label: string
  value: string
  options?: FormOption[]
}

interface BaseFormField {
  key: string
  type: string
  label: string
  name: string
  placeholder?: string
  rules?: FormRule[]
  editable?: boolean
}

interface FormRule {
  required?: boolean
  message: string
  type?: string
  min?: number
}

interface InputField extends BaseFormField {
  type: "input"
  variant: string
}

interface TextAreaField extends BaseFormField {
  type: "textarea"
}

interface DateField extends BaseFormField {
  type: "datepicker"
}

interface SelectField extends BaseFormField {
  type: "select"
  childIncluded: boolean
  childLabel: string
  childPlaceholder: string
  childName: string
  options: FormOption[]
}

interface RadioField extends BaseFormField {
  type: "radioGroup"
  options: FormOption[]
}

interface CheckboxField extends BaseFormField {
  type: "checkbox"
  multiple?: boolean
  options?: FormOption[]
}

type FormField =
  | InputField
  | DateField
  | SelectField
  | RadioField
  | CheckboxField
  | TextAreaField
interface FormSection {
  id: number
  columns: number // Number of form elements in one row
  fields: FormField[]
}

interface FormModel {
  [key: string]: string | string[] | boolean
}

interface FormRules {
  [key: string]: Array<{
    required?: boolean
    message: string
    type?: string
    min?: number
    trigger: string[]
  }>
}

// Type guards
const isInputField = (field: FormField): field is InputField =>
  field.type === "input"
const isTextAreaField = (field: FormField): field is TextAreaField =>
  field.type === "textarea"
const isDateField = (field: FormField): field is DateField =>
  field.type === "datepicker"
const isSelectField = (field: FormField): field is SelectField =>
  field.type === "select"
const isRadioField = (field: FormField): field is RadioField =>
  field.type === "radioGroup"
const isCheckboxField = (field: FormField): field is CheckboxField =>
  field.type === "checkbox"

// Type assertion for the imported JSON data
const typedFormData = formData as {
  form: {
    title: string
    form_data: FormSection[]
  }
}

const formRef = ref()
const formModel = defineModel<FormModel>({ required: true })
const formRules = ref<FormRules>({})

// Initialize form model with empty values and rules
const initializeFormModel = () => {
  typedFormData.form.form_data.forEach((section: FormSection) => {
    section.fields.forEach((field: FormField) => {
      if (isCheckboxField(field) && field.multiple) {
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
      // Update common properties
      section.fields[fieldIndex].label = updatedField.label
      if (updatedField.placeholder) {
        section.fields[fieldIndex].placeholder = updatedField.placeholder
      }

      // Handle special case for input fields with variant
      if (
        isInputField(section.fields[fieldIndex]) &&
        updatedField.type === "input" &&
        "variant" in updatedField
      ) {
        ;(section.fields[fieldIndex] as InputField).variant = (
          updatedField as InputField
        ).variant
      }

      break
    }
  }

  // Close the editor
  showFieldEditor.value = false
  editingField.value = null

  // Optional: Show success message
  ElMessage.success("Field updated successfully")
}

// Handle parent select change to update child options
const handleParentSelectChange = () => {
  const field = typedFormData.form.form_data
    .flatMap((section) => section.fields)
    .find((f) => isSelectField(f) && f.childIncluded) as SelectField

  if (field && field.childName) {
    formModel.value[field.childName] = ""
  }
}

// Get child options based on parent selection
const getChildOptions = (field: SelectField): FormOption[] => {
  const parentValue = formModel.value[field.name] as string
  const parentOption = field.options.find(
    (opt: FormOption) => opt.value === parentValue
  )
  return parentOption?.options || []
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

<style scoped>
.section-wrapper {
  margin-bottom: 20px;
}

.row-separator {
  height: 0;
  margin: 10px 0;
}
</style>
