<template>
  <div class="container py-20">
    <h1 class="text-2xl font-bold mb-10">Dynamic Form Generator</h1>
    <div class="grid grid-cols-2 gap-10">
      <div class="space-y-4">
        <div v-for="field in formData.form.form_data" :key="field.id">
          <div v-for="(formElement, idx) in field.fields" :key="idx">
            <label :for="formElement.id" class="block text-sm font-medium mb-1">
              {{ formElement.label }}
            </label>
            <component
              :name="formElement.name"
              :placeholder="formElement.placeholder"
              :label="formElement.label"
              :required="formElement.required"
              :is="componentMap[formElement.type]"
            >
              <template v-if="formElement.options">
                <component
                  v-for="option in formElement.options"
                  :key="option.id"
                  :value="option.value"
                  :label="option.label"
                  :is="optionMap[formElement.type]"
                >
                </component>
              </template>
              <template v-else-if="formElement.multiple === 'single'">
                {{ formElement.label }}
              </template>
            </component>
            <!-- Special handling for select with child relationship -->
            <div v-if="formElement.type === 'select'">
              <!-- <ElSelect
                :id="formElement.id"
                :name="formElement.name"
                :label="formElement.label"
                :placeholder="formElement.placeholder"
              >
                <ElOption
                  v-for="option in formElement.options"
                  :key="option.id"
                  :label="option.label"
                  :value="option.value"
                />
              </ElSelect> -->

              <!-- Child Select when parent has a child relationship -->
              <!-- <div v-if="formElement.childIncluded" class="mt-2"> -->
              <!-- <label class="block mb-2" :for="formElement.childKey">
                  {{ formElement.childLabel }}
                </label>

                <ElSelect
                  :name="formElement.childName"
                  :placeholder="formElement.childPlaceholder"
                  :disabled="!values[formElement.key]"
                >
                  <ElOption
                    v-for="option in formElement.childOptions"
                    :key="option.id"
                    :label="option.label"
                    :value="option.id"
                  />
                </ElSelect> -->
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div class="inline-flex gap-4 mt-10">
      <el-button type="primary">Save</el-button>
      <el-button type="default">Reset</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as formData from "../data/index.json"

const componentMap = {
  text: "ElInput",
  select: "ElSelect",
  datepicker: "ElDatePicker",
  checkbox: "ElCheckbox",
  checkboxGroup: "ElCheckboxGroup",
  radio: "ElRadio",
  radioGroup: "ElRadioGroup",
}
const optionMap = {
  select: "ElOption",
  checkboxGroup: "ElCheckbox",
  radioGroup: "ElRadio",
}
</script>
<style scoped></style>
