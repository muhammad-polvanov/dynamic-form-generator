<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef">
    <el-row :gutter="20">
      <el-col
        v-for="(field, idx) in formData.form.form_data"
        :key="idx"
        :span="field.layout.colSpan"
      >
        <FieldWrapper :field="field">
          <DynamicField :field="field" :formModel="formModel" />
        </FieldWrapper>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import * as formData from "../../data/index.json"
import { ref } from "vue"

const formModel = ref({})
const formRules = ref({})
const formRef = ref()
</script>
<style scoped></style>
