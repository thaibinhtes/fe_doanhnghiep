import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { memberService } from '@/services/memberService'
import type { Member } from '@/types/company'

export const useMembersStore = defineStore('members', () => {
  // State
  const members = ref<Member[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref({
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [] as any[],
    path: '',
    per_page: 15,
    to: 1,
    total: 0,
  })

  // Getters
  const page = computed(() => meta.value.current_page)
  const totalPages = computed(() => meta.value.last_page)

  // Actions
  async function fetchMembers(filters?: { search?: string; page?: number; per_page?: number }) {
    loading.value = true
    error.value = null
    try {
      const response = await memberService.getAll(filters)
      members.value = response.data.map((m) => ({
        ...m,
        cccd: m.cccd || '',
        fullName: m.fullName || '',
        birthday: m.birthday || null,
        gender: m.gender || null,
        status: m.status ?? true,
      }))
      // meta.value = response.meta
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể tải danh sách thành viên'
      console.error('fetchMembers error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createMember(memberData: Partial<Member>) {
    loading.value = true
    error.value = null
    try {
      const newMember = await memberService.create(memberData)
      members.value.unshift(newMember)
      meta.value.total += 1
      return newMember
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể tạo thành viên'
      console.error('createMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMember(id: number, memberData: Partial<Member>) {
    loading.value = true
    error.value = null
    try {
      const updated = await memberService.update(id, memberData)
      const index = members.value.findIndex((m) => m.fullName === updated.fullName && m.birthday === updated.birthday)
      if (index !== -1) {
        members.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể cập nhật thành viên'
      console.error('updateMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteMember(id: number) {
    loading.value = true
    error.value = null
    try {
      await memberService.delete(id)
      members.value = members.value.filter((m: any) => m.id !== id)
      meta.value.total -= 1
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không thể xóa thành viên'
      console.error('deleteMember error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(newPage: number) {
    meta.value.current_page = newPage
  }

  function resetError() {
    error.value = null
  }

  return {
    members,
    loading,
    error,
    meta,
    page,
    totalPages,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
    setPage,
    resetError,
  }
})
