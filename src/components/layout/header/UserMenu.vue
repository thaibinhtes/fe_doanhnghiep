<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400"
      @click.prevent="toggleDropdown"
    >
      <span class="mr-3 overflow-hidden rounded-full h-11 w-11">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
          {{ userInitials }}
        </div>
      </span>
      <span v-if="auth.user" class="mr-2 hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
        {{ auth.user.name }}
      </span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/signin"
        @click.prevent="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Đăng xuất
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserCircleIcon, ChevronDownIcon, LogoutIcon } from '@/icons'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const menuItems = computed(() => {
  const items = []
  if (auth.hasPermission('menu.admin.roles')) {
    items.push({ href: '/admin/roles', icon: UserCircleIcon, text: 'Phân quyền' })
  }
  if (auth.hasPermission('menu.companies.statuses')) {
    items.push({ href: '/companies/statuses', icon: UserCircleIcon, text: 'Trạng thái DN' })
  }
  return items
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = async () => {
  await auth.logout()
  closeDropdown()
  router.push('/signin')
}

const userInitials = computed(() => {
  const name = auth.user?.name?.trim() ?? ''
  if (!name) return 'U'
  const parts = name.split(/\s+/)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('')
})

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
