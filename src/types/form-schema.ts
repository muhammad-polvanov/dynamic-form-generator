export interface FormOption {
  id?: number
  label: string
  value: string
  options?: FormOption[]
}

export interface BaseFormField {
  id: number
  key: string
  type: string
  label: string
  name: string
  placeholder?: string
  rules?: FormRule[]
  editable?: boolean
}

export interface FormRule {
  required?: boolean
  message: string
  type?: string
  min?: number
}

export interface InputField extends BaseFormField {
  type: "input"
  variant: string
}

export interface TextAreaField extends BaseFormField {
  type: "textarea"
}

export interface DateField extends BaseFormField {
  type: "datepicker"
}

export interface SelectField extends BaseFormField {
  type: "select"
  childIncluded: boolean
  childLabel: string
  childPlaceholder: string
  childName: string
  options: FormOption[]
}

export interface RadioField extends BaseFormField {
  type: "radioGroup"
  options: FormOption[]
}

export interface CheckboxField extends BaseFormField {
  type: "checkbox"
  multiple?: boolean
  options?: FormOption[]
}

export type FormField =
  | InputField
  | DateField
  | SelectField
  | RadioField
  | CheckboxField
  | TextAreaField

export interface FormSection {
  id: number
  columns: number // Number of form elements in one row
  fields: FormField[]
}

export interface FormData {
  title: string
  form: {
    form_data: FormSection[]
  }
}

export interface FormModel {
  [key: string]: string | string[] | boolean
}

export interface FormRules {
  [key: string]: Array<{
    required?: boolean
    message: string
    type?: string
    min?: number
    trigger: string[]
  }>
}
