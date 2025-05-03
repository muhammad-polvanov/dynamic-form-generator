import type { FormSection, FormField } from "../types/form-schema"
import { ElMessage } from "element-plus"
import { ref, computed } from "vue"

export const useDraggable = (formData: FormSection[]) => {
  // Drag state
  const draggableSection = ref<number | null>(null)
  const isDragging = ref(false)
  const draggedElement = ref<FormField | null>(null)

  // Computed property to get the current section
  const currentSection = computed(() => {
    if (draggableSection.value === null) return null
    return formData.find((section) => section.id === draggableSection.value)
  })
  const handleDragOver = (sectionId: number) => {
    draggableSection.value = sectionId
  }

  const handleDragStart = (element: FormField) => {
    isDragging.value = true
    draggedElement.value = { ...element }
  }

  const handleDragEnd = () => {
    if (!currentSection.value || !draggedElement.value) {
      isDragging.value = false
      draggedElement.value = null
      return
    }

    try {
      // Create a deep copy of the element with a unique key
      const elementCopy = JSON.parse(
        JSON.stringify(draggedElement.value)
      ) as FormField
      elementCopy.key = `${elementCopy.key}_${Date.now()}`
      elementCopy.name = `${elementCopy.name}_${Date.now()}`
      elementCopy.id = Date.now() // Ensure we have a unique ID

      // Find the section and create a new array to trigger reactivity
      const sectionIndex = formData.findIndex(
        (section) => section.id === draggableSection.value
      )

      if (sectionIndex >= 0) {
        // Create a new fields array to ensure reactivity
        const updatedFields = [...formData[sectionIndex].fields, elementCopy]

        // Update the section's fields with the new array
        formData[sectionIndex].fields = updatedFields
        // Show success message
        ElMessage({
          message: `Added ${elementCopy.label} to the form`,
          type: "success",
          duration: 2000,
        })
      }
    } catch (error) {
      ElMessage.error("Error adding field to form")
      console.error(error)
    } finally {
      // Reset drag state
      isDragging.value = false
      draggedElement.value = null
      draggableSection.value = null
    }
  }
  return {
    draggedElement,
    isDragging,
    currentSection,
    handleDragOver,
    handleDragStart,
    handleDragEnd,
  }
}
