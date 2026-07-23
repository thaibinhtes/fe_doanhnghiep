<template>
  <div class="recaptcha-wrap">
    <div ref="hostRef" />
    <p v-if="loadError" class="mt-2 text-sm font-medium text-error-600">
      {{ loadError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  siteKey: string
}>()

const emit = defineEmits<{
  verify: [token: string]
  expire: []
  error: []
}>()

const hostRef = ref<HTMLElement | null>(null)
const loadError = ref('')
let widgetId: number | null = null
let scriptPromise: Promise<void> | null = null

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark'
        },
      ) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
  }
}

function loadScript(): Promise<void> {
  if (window.grecaptcha) {
    return Promise.resolve()
  }
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="v2"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Không tải được reCAPTCHA')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.recaptcha = 'v2'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Không tải được reCAPTCHA'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

async function renderWidget() {
  if (!hostRef.value || !props.siteKey) return

  loadError.value = ''
  try {
    await loadScript()
    await new Promise<void>((resolve) => {
      window.grecaptcha?.ready(() => resolve())
    })

    if (widgetId !== null) {
      window.grecaptcha?.reset(widgetId)
      return
    }

    hostRef.value.innerHTML = ''
    widgetId = window.grecaptcha!.render(hostRef.value, {
      sitekey: props.siteKey,
      callback: (token: string) => emit('verify', token),
      'expired-callback': () => emit('expire'),
      'error-callback': () => emit('error'),
      theme: 'light',
    })
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Không hiển thị được captcha'
  }
}

function reset() {
  if (widgetId !== null) {
    window.grecaptcha?.reset(widgetId)
  }
  emit('expire')
}

defineExpose({ reset })

onMounted(() => {
  void renderWidget()
})

watch(() => props.siteKey, () => {
  widgetId = null
  void renderWidget()
})

onBeforeUnmount(() => {
  widgetId = null
})
</script>
