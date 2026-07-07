<template>
  <Modal v-if="open" @close="emit('close')">
    <template #body>
      <div
        class="no-scrollbar relative z-1 mx-auto w-full max-w-5xl max-h-[min(90vh,100dvh)] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:p-6 lg:p-8"
      >
        <CompanyImportHistoryPanel ref="panelRef" show-close @close="emit('close')" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/profile/Modal.vue'
import CompanyImportHistoryPanel from '@/components/companies/CompanyImportHistoryPanel.vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<InstanceType<typeof CompanyImportHistoryPanel> | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      panelRef.value?.resetAndLoad()
    }
  },
)
</script>
