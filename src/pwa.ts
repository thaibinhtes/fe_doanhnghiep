import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    setInterval(() => {
      registration.update().catch(() => {
        // Ignore periodic update failures.
      })
    }, 60 * 60 * 1000)
  },
})

