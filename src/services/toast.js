import { ref } from 'vue'

export const message = ref('')
export const type = ref('')
export const visible = ref(false)

export function showToast(msg, toastType = 'info') {
  message.value = msg
  type.value = toastType
  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, 2500)
}
