<template>
  <div
    class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-700 dark:bg-gray-900"
  >
    <!-- Avatar / Initial -->
    <div
      class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold uppercase text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
    >
      {{ initial }}
    </div>

    <!-- Info -->
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-gray-800 dark:text-white/90">
        {{ member.fullName || '—' }}
      </p>
      <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
        CCCD: {{ member.cccd || '—' }}
      </p>
    </div>

    <!-- Gender -->
    <Badge
      v-if="member.gender"
      :color="genderColor"
      size="sm"
      variant="light"
    >
      {{ member.gender }}
    </Badge>

    <!-- Status -->
    <Badge
      :color="member.status ? 'success' : 'error'"
      size="sm"
      variant="light"
    >
      {{ member.status ? 'Hoạt động' : 'Ngừng' }}
    </Badge>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import type { Member } from '@/types/company'

interface Props {
  member: Member
}

const props = defineProps<Props>()

const initial = computed(() => {
  return props.member.fullName?.charAt(0).toUpperCase() || '?'
})

const genderColor = computed(() => {
  const g = props.member.gender?.toLowerCase()
  if (g === 'nam') return 'primary'
  if (g === 'nữ' || g === 'nu') return 'error'
  return 'light'
})
</script>
