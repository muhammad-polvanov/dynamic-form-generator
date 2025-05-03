<template>
  <div class="w-full">
    <!-- Text Input -->
    <el-input
      v-if="isInputField(field)"
      v-model="form[field.name]"
      :placeholder="field.placeholder"
      :type="field.variant"
      :rules="field.rules"
    />

    <!-- Text Area -->
    <el-input
      v-else-if="isTextAreaField(field)"
      v-model="form[field.name]"
      :placeholder="field.placeholder"
      type="textarea"
    />
    <!-- Date Picker -->
    <el-date-picker
      v-else-if="isDateField(field)"
      v-model="form[field.name]"
      type="date"
      :placeholder="field.placeholder"
    />

    <!-- Select with Child -->
    <template v-else-if="isSelectField(field) && field.childIncluded">
      <el-select
        v-model="form[field.name]"
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
        v-model="form[field.childName]"
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
    <template v-else-if="isSelectField(field) && !field.childIncluded">
      <el-select v-model="form[field.name]" :placeholder="field.placeholder">
        <el-option
          v-for="option in field.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </template>

    <!-- Radio Group -->
    <el-radio-group v-else-if="isRadioField(field)" v-model="form[field.name]">
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
        v-model="form[field.name]"
        :label="field.label"
      />
      <el-checkbox-group v-else v-model="form[field.name]">
        <el-checkbox
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
    
  </div>
</template>
<script setup lang="ts">
import type {
  InputField,
  TextAreaField,
  DateField,
  SelectField,
  RadioField,
  CheckboxField,
  FormField,
  FormModel,
  FormOption,
  FormSection,
} from "../../types/form-schema"

const { field, formData } = defineProps<{
  field: FormField
  formData: FormSection[]
}>()

const form = defineModel<FormModel>({ default: {} })

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

// Handle parent select change to update child options
const handleParentSelectChange = () => {
  const field = formData
    .flatMap((section) => section.fields)
    .find((f) => isSelectField(f) && f.childIncluded) as SelectField

  if (field && field.childName) {
    form.value[field.childName] = ""
  }
}

// Get child options based on parent selection
const getChildOptions = (field: SelectField): FormOption[] => {
  const parentValue = form.value[field.name] as string
  const parentOption = field.options.find(
    (opt: FormOption) => opt.value === parentValue
  )
  return parentOption?.options || []
}
</script>
<style scoped></style>
