<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Danh sách thành viên" className="overflow-hidden">
        <!-- Filters -->
        <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div class="w-full sm:w-[280px]">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Tìm kiếm
            </label>
            <input
              type="text"
              v-model="search"
              placeholder="Họ tên, CCCD..."
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            />
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="handleSearch"
              class="h-11 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Tìm
            </button>
            <router-link
              to="/members/create"
              class="h-11 inline-flex items-center gap-2 rounded-lg bg-success-500 px-5 text-sm font-medium text-white transition hover:bg-success-600"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Thêm mới
            </router-link>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="membersStore.loading" class="py-10 text-center text-sm text-gray-500">
          Đang tải...
        </div>

        <!-- Error -->
        <div v-else-if="membersStore.error" class="py-10 text-center text-sm text-error-500">
          {{ membersStore.error }}
        </div>

        <!-- Empty -->
        <div v-else-if="membersStore.members.length === 0" class="py-10 text-center text-sm text-gray-400">
          Chưa có thành viên nào
        </div>

        <!-- Member list -->
        <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MemberItem
            v-for="member in membersStore.members"
            :key="member.id"
            :member="member"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="membersStore.meta.last_page > 1"
          class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {{ membersStore.meta.from }}–{{ membersStore.meta.to }} / {{ membersStore.meta.total }} bản ghi
          </span>
          <div class="flex items-center gap-1">
            <button
              :disabled="membersStore.meta.current_page === 1"
              @click="changePage(membersStore.meta.current_page - 1)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              ‹
            </button>
            <button
              v-for="p in membersStore.meta.last_page"
              :key="p"
              @click="changePage(p)"
              :class="[
                'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition',
                p === membersStore.meta.current_page
                  ? 'bg-brand-500 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800',
              ]"
            >
              {{ p }}
            </button>
            <button
              :disabled="membersStore.meta.current_page === membersStore.meta.last_page"
              @click="changePage(membersStore.meta.current_page + 1)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              ›
            </button>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import MemberItem from '@/components/members/MemberItem.vue'
import { useMembersStore } from '@/stores/members'

const membersStore = useMembersStore()
const search = ref('')

const currentPageTitle = computed(() => 'Danh sách thành viên')

onMounted(() => {
  membersStore.fetchMembers()
})

const handleSearch = () => {
  membersStore.fetchMembers({
    search: search.value,
    page: 1,
    per_page: 15,
  })
}

const changePage = (p: number) => {
  membersStore.fetchMembers({
    search: search.value,
    page: p,
    per_page: 15,
  })
}
</script>
