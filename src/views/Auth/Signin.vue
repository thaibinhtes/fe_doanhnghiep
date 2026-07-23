<template>
  <FullScreenLayout>
    <div class="signin-page relative flex min-h-full w-full items-center justify-center overflow-hidden px-4 py-8 sm:py-10">
      <div class="signin-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div class="relative z-10 w-full max-w-[440px]">
        <div class="rounded-2xl bg-white px-6 py-8 shadow-2xl sm:px-8 sm:py-9">
          <div class="mb-6 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-gold-500 bg-brand-600 shadow-md">
              <svg viewBox="0 0 48 48" class="h-9 w-9" aria-hidden="true">
                <polygon
                  points="24,8 28.5,19 40,19 30.5,26.5 34,38 24,30.5 14,38 17.5,26.5 8,19 19.5,19"
                  fill="#d4af37"
                />
              </svg>
            </div>
            <p class="text-sm font-bold uppercase tracking-[0.12em] text-gold-500 sm:text-base">
              {{ APP_ORG }}
            </p>
            <h1 class="mt-2 text-xl font-bold leading-snug text-brand-600 sm:text-2xl">
              {{ APP_NAME }}
            </h1>
          </div>

          <div class="mb-6 flex gap-3 rounded-lg border border-gold-300 bg-gold-50 px-3.5 py-3 text-left">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-white">
              i
            </span>
            <p class="text-sm leading-relaxed text-brand-800">
              Hệ thống phục vụ quản lý định danh tổ chức. Vui lòng đăng nhập bằng tài khoản được cấp.
            </p>
          </div>

          <div
            v-if="formError || auth.error || route.query.error === 'no-permission'"
            class="mb-4 rounded-lg border border-error-200 bg-error-50 p-3 text-sm font-medium text-error-700"
          >
            {{
              route.query.error === 'no-permission'
                ? 'Tài khoản không có quyền truy cập hệ thống.'
                : (formError || auth.error)
            }}
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-5">
              <div>
                <label for="email" class="mb-2 block text-sm font-semibold text-gray-800">
                  Email / Tên đăng nhập <span class="text-brand-600">*</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  required
                  autocomplete="username"
                  placeholder="vd: admin@example.com"
                  class="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-900 shadow-theme-xs placeholder:text-gray-400 outline-none transition focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15"
                />
              </div>

              <div>
                <label for="password" class="mb-2 block text-sm font-semibold text-gray-800">
                  Mật khẩu <span class="text-brand-600">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    required
                    autocomplete="current-password"
                    placeholder="Nhập mật khẩu"
                    class="h-12 w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-16 text-base text-gray-900 shadow-theme-xs placeholder:text-gray-400 outline-none transition focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    @click="togglePasswordVisibility"
                  >
                    {{ showPassword ? 'Ẩn' : 'Hiện' }}
                  </button>
                </div>
              </div>

              <div v-if="captchaEnabled && captchaSiteKey">
                <p class="mb-2 text-sm font-semibold text-gray-800">
                  Xác minh bảo mật <span class="text-brand-600">*</span>
                </p>
                <RecaptchaEnterprise
                  ref="captchaRef"
                  :site-key="captchaSiteKey"
                  :action="captchaAction"
                  @verify="onCaptchaVerify"
                  @expire="onCaptchaExpire"
                  @error="onCaptchaError"
                />
              </div>
              <p v-else-if="captchaLoading" class="text-sm text-gray-500">
                Đang tải captcha...
              </p>

              <button
                type="submit"
                :disabled="auth.loading || captchaLoading || (captchaEnabled && !captchaToken)"
                class="flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white shadow-theme-sm transition hover:bg-brand-700 active:translate-y-px disabled:opacity-60"
              >
                {{ auth.loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </div>
          </form>

          <p class="mt-5 text-center text-sm text-gray-500">
            {{ APP_TAGLINE }}
          </p>
        </div>

        <p class="mt-5 text-center text-sm text-white/80">
          {{ APP_FOOTER }}
        </p>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import RecaptchaEnterprise from '@/components/auth/RecaptchaEnterprise.vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { APP_FOOTER, APP_NAME, APP_ORG, APP_TAGLINE } from '@/config/app'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const formError = ref('')
const captchaLoading = ref(true)
const captchaEnabled = ref(false)
const captchaSiteKey = ref('')
const captchaAction = ref('LOGIN')
const captchaToken = ref('')
const captchaRef = ref<InstanceType<typeof RecaptchaEnterprise> | null>(null)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const onCaptchaVerify = (token: string) => {
  captchaToken.value = token
  formError.value = ''
}

const onCaptchaExpire = () => {
  captchaToken.value = ''
}

const onCaptchaError = () => {
  captchaToken.value = ''
  formError.value = 'Không xác minh được captcha. Vui lòng tải lại trang.'
}

const resetCaptcha = () => {
  captchaToken.value = ''
  captchaRef.value?.reset()
}

const handleSubmit = async () => {
  formError.value = ''

  if (captchaEnabled.value && !captchaToken.value) {
    formError.value = 'Vui lòng xác minh captcha trước khi đăng nhập.'
    return
  }

  try {
    await auth.login({
      email: email.value.trim(),
      password: password.value,
      captchaToken: captchaToken.value || undefined,
    })

    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/dashboard'
    router.push(redirect)
  } catch (err: unknown) {
    resetCaptcha()
    const axiosErr = err as { response?: { data?: { message?: string } } }
    if (axiosErr.response?.data?.message) {
      formError.value = axiosErr.response.data.message
    }
  }
}

onMounted(async () => {
  captchaLoading.value = true
  try {
    const config = await authService.getCaptchaConfig()
    captchaEnabled.value = config.enabled && !!config.siteKey
    captchaSiteKey.value = config.siteKey ?? ''
    captchaAction.value = config.action || 'LOGIN'
  } catch {
    captchaEnabled.value = false
    formError.value = 'Không tải được cấu hình captcha.'
  } finally {
    captchaLoading.value = false
  }
})
</script>

<style scoped>
.signin-bg {
  background:
    radial-gradient(ellipse 80% 60% at 50% 35%, rgba(139, 30, 30, 0.55) 0%, transparent 70%),
    linear-gradient(160deg, #3a0c0c 0%, #1a0505 45%, #2a0808 100%);
}
</style>
