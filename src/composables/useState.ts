import { ref, reactive } from "vue"
import type {
  FormSection,
  FormField,
  FormData,
  FormRules,
} from "../types/form-schema"

export const useState = (formData: any) => {
  const formModel = ref<Record<string, string | string[] | boolean>>({})
  const formRules = ref<FormRules>({})
  const typedFormData = reactive<FormData>({
    title: formData.form.title,
    form: {
      form_data: formData.form.form_data as FormSection[],
    },
  })

  // Initialize form model with empty values and rules
  const initializeFormModel = () => {
    typedFormData.form.form_data.forEach((section: FormSection) => {
      section.fields.forEach((field: FormField) => {
        if (field.type === "checkbox" && (field as any).multiple) {
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
  initializeFormModel()

  return {
    formModel,
    formRules,
    typedFormData,
    initializeFormModel,
  }
}
