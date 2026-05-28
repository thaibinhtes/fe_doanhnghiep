<template>
  <button
    v-if="canInstall"
    type="button"
    @click="installApp"
    class="inline-flex h-10 items-center justify-center rounded-lg border border-brand-500 px-3 text-xs font-medium text-brand-600 transition hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-500/10 sm:text-sm"
  >
    Tải ứng dụng
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type DeferredInstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const deferredPrompt = ref<DeferredInstallPrompt | null>(null)
const canInstall = ref(false)

const checkInstalled = () => {
  if (typeof window === 'undefined') return false
  const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches
  // iOS Safari
  const navigatorStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  return displayModeStandalone || navigatorStandalone
}

const onBeforeInstallPrompt = (event: Event) => {
  event.preventDefault()
  deferredPrompt.value = event as DeferredInstallPrompt
  canInstall.value = !checkInstalled()
}

const onAppInstalled = () => {
  deferredPrompt.value = null
  canInstall.value = false
}

const installApp = async () => {
  if (!deferredPrompt.value) return
  await deferredPrompt.value.prompt()
  await deferredPrompt.value.userChoice
  deferredPrompt.value = null
  canInstall.value = false
}

onMounted(() => {
  if (checkInstalled()) {
    canInstall.value = false
    return
  }

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})
</script>

