<template>
  <AdminLayout>
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
          <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <button
              @click="handleSearch"
              class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Tìm
            </button>
            <router-link
              to="/members/create"
              class="h-11 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-success-500 px-5 text-sm font-medium text-white transition hover:bg-success-600"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 4.16669V15.8334M4.16669 10H15.8334" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Thêm mới
            </router-link>
          </div>
        </div>

        <TableSkeleton v-if="membersStore.loading" variant="cards" :rows="6" />

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

        <TablePagination
          :page="membersStore.meta.current_page"
          :last-page="membersStore.meta.last_page"
          :total="membersStore.meta.total"
          :from="membersStore.meta.from"
          :to="membersStore.meta.to"
          hide-when-single-page
          @update:page="changePage"
        />
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import TablePagination from '@/components/common/TablePagination.vue'
import TableSkeleton from '@/components/common/TableSkeleton.vue'
import MemberItem from '@/components/members/MemberItem.vue'
import { useMembersStore } from '@/stores/members'

const membersStore = useMembersStore()
const search = ref('')

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
