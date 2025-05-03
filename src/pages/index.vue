<template>
  <div class="container py-20">
    <!-- <h1 class="text-2xl font-bold mb-10">Dynamic Form Generator</h1>
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
          </div>
        </div>
      </div>
      <div></div>
    </div>

    <div class="inline-flex gap-4 mt-10">
      <el-button type="primary">Save</el-button>
      <el-button type="default">Reset</el-button>
    </div> -->
    <div class="flex items-start gap-10">
      <DynamicForm v-model="formModel" />
      <div class="w-full max-w-[300px]">
        <h1>Preview</h1>
        <pre>{{ formModel }}</pre>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import DynamicForm from "../components/dynamic-form/DynamicForm.vue"
const formModel = ref({})
</script>
<style scoped></style>
