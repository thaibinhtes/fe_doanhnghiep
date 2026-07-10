<template>
  <FullScreenLayout>
    <div class="signin-page relative flex h-full w-full items-center justify-center overflow-hidden px-4 py-6">
      <div
        class="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url('${backgroundUrl}')` }"
        aria-hidden="true"
      />
      <div class="pointer-events-none absolute inset-0 bg-brand-950/35" aria-hidden="true" />

      <div class="relative z-10 w-full max-w-md">
        <div class="mb-6 text-center sm:mb-8">
          <h2 class="text-base font-semibold leading-snug text-white drop-shadow-sm sm:text-lg">
            {{ APP_NAME }}
          </h2>
          <p class="mt-1.5 text-sm text-white/85 drop-shadow-sm">
            Hỗ trợ định danh và quản lý thông tin tổ chức
          </p>
        </div>

        <div class="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-theme-lg backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/95 sm:p-8">
          <div class="mb-5 sm:mb-6">
            <h1 class="mb-1.5 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Nhập email và mật khẩu để truy cập hệ thống
            </p>
          </div>

          <div
            v-if="auth.error || route.query.error === 'no-permission'"
            class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
          >
            {{
              route.query.error === 'no-permission'
                ? 'Tài khoản không có quyền truy cập hệ thống.'
                : auth.error
            }}
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-5">
              <div>
                <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Email <span class="text-error-500">*</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  required
                  placeholder="admin@htqldn.local"
                  class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Mật khẩu <span class="text-error-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    required
                    placeholder="Nhập mật khẩu"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400"
                  >
                    {{ showPassword ? 'Ẩn' : 'Hiện' }}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="auth.loading"
                class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
              >
                {{ auth.loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { APP_NAME } from '@/config/app'

const backgroundUrl = '/images/background.png'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  try {
    await auth.login({
      email: email.value.trim(),
      password: password.value,
    })

    const redirect =
      typeof route.query.redirect === 'string' && route.query.redirect
        ? route.query.redirect
        : '/dashboard'
    router.push(redirect)
  } catch {
    // error shown via auth.error
  }
}
</script>
