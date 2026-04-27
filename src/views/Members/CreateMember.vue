<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="mx-auto w-full max-w-3xl">
      <ComponentCard title="Thêm thành viên mới">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <!-- CCCD -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                CCCD <span class="text-error-500">*</span>
              </label>
              <input
                v-model="form.cccd"
                type="text"
                required
                maxlength="12"
                placeholder="Nhập số CCCD"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <!-- Full Name -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Họ và tên <span class="text-error-500">*</span>
              </label>
              <input
                v-model="form.fullName"
                type="text"
                required
                placeholder="Nhập họ tên"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <!-- Birthday -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ngày sinh
              </label>
              <input
                v-model="form.birthday"
                type="text"
                placeholder="DD/MM/YYYY"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <!-- Gender -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Giới tính
              </label>
              <div class="relative z-20 bg-transparent">
                <select
                  v-model="form.gender"
                  class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option :value="null">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                  <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-end pb-2">
              <label class="inline-flex cursor-pointer items-center gap-3">
                <div class="relative">
                  <input v-model="form.status" type="checkbox" class="sr-only" />
                  <div
                    :class="[
                      'h-5 w-9 rounded-full transition-colors',
                      form.status ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600',
                    ]"
                  />
                  <div
                    :class="[
                      'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                      form.status ? 'translate-x-4.5' : 'translate-x-0.5',
                    ]"
                  />
                </div>
                <span class="text-sm text-gray-700 dark:text-gray-400">
                  {{ form.status ? 'Hoạt động' : 'Ngừng' }}
                </span>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <router-link
              to="/members"
              class="h-11 inline-flex items-center rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Hủy
            </router-link>
            <button
              type="submit"
              :disabled="membersStore.loading"
              class="h-11 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              <span v-if="membersStore.loading">Đang lưu...</span>
              <span v-else>Lưu</span>
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { useMembersStore } from '@/stores/members'
import { formatVND } from '@/utils/formatters'

const router = useRouter()
const membersStore = useMembersStore()

const currentPageTitle = computed(() => 'Thêm thành viên mới')

const form = reactive({
  cccd: '',
  fullName: '',
  birthday: null as string | null,
  gender: null as string | null,
  dateJoin: null as string | null,
  status: true,
  position: null as string | null,
  investmentAmount: null as number | null,
})

const handleSubmit = async () => {
  await membersStore.createMember({ ...form })
  router.push('/members')
}
</script>
