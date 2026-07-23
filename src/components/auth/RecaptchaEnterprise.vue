<template>
  <div class="recaptcha-wrap">
    <div ref="hostRef" class="g-recaptcha" />
    <p v-if="loadError" class="mt-2 text-sm font-medium text-error-600">
      {{ loadError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    siteKey: string
    action?: string
  }>(),
  {
    action: 'LOGIN',
  },
)

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
      enterprise?: {
        ready: (cb: () => void) => void
        render: (
          container: HTMLElement,
          parameters: {
            sitekey: string
            action?: string
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
}

function loadScript(): Promise<void> {
  if (window.grecaptcha?.enterprise) {
    return Promise.resolve()
  }
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="enterprise"]')
    if (existing) {
      if (window.grecaptcha?.enterprise) {
        resolve()
        return
      }
      existing.addEventListener('load', () => waitForEnterprise().then(resolve).catch(reject))
      existing.addEventListener('error', () => reject(new Error('Không tải được reCAPTCHA')))
      return
    }

    const script = document.createElement('script')
    // Match Google demo: enterprise.js without render=explicit works for checkbox;
    // keep explicit so we control mount timing in Vue.
    script.src = 'https://www.google.com/recaptcha/enterprise.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.recaptcha = 'enterprise'
    script.onload = () => {
      waitForEnterprise().then(resolve).catch(reject)
    }
    script.onerror = () => reject(new Error('Không tải được reCAPTCHA'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

function waitForEnterprise(timeoutMs = 8000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (window.grecaptcha?.enterprise) {
        resolve()
        return
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('reCAPTCHA Enterprise chưa sẵn sàng'))
        return
      }
      window.setTimeout(tick, 50)
    }
    tick()
  })
}

async function renderWidget() {
  if (!hostRef.value || !props.siteKey) return

  loadError.value = ''
  try {
    await loadScript()
    await new Promise<void>((resolve, reject) => {
      if (!window.grecaptcha?.enterprise) {
        reject(new Error('reCAPTCHA Enterprise chưa sẵn sàng'))
        return
      }
      window.grecaptcha.enterprise.ready(() => resolve())
    })

    if (widgetId !== null) {
      window.grecaptcha?.enterprise?.reset(widgetId)
      return
    }

    hostRef.value.innerHTML = ''
    widgetId = window.grecaptcha!.enterprise!.render(hostRef.value, {
      sitekey: props.siteKey,
      action: props.action || 'LOGIN',
      callback: (token: string) => emit('verify', token),
      'expired-callback': () => emit('expire'),
      'error-callback': () => emit('error'),
      theme: 'light',
    })
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Không hiển thị được captcha'
    emit('error')
  }
}

function reset() {
  if (widgetId !== null) {
    window.grecaptcha?.enterprise?.reset(widgetId)
  }
  emit('expire')
}

function getResponse(): string {
  if (widgetId === null) return ''
  return window.grecaptcha?.enterprise?.getResponse(widgetId) ?? ''
}

defineExpose({ reset, getResponse })

onMounted(() => {
  void renderWidget()
})

watch(
  () => [props.siteKey, props.action] as const,
  () => {
    widgetId = null
    void renderWidget()
  },
)

onBeforeUnmount(() => {
  widgetId = null
})
</script>
