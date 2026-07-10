import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { navMenuService } from '@/services/navMenuService'
import type { NavMenuGroup, NavMenuNode } from '@/types/navMenu'
import { routePermissions as staticRoutePermissions, type RoutePermission } from '@/config/menu'

function walkRoutePermissions(
  nodes: NavMenuNode[],
  map: Record<string, RoutePermission>,
): void {
  for (const node of nodes) {
    if (node.path && node.permissionKey) {
      const pathname = node.path.split('?')[0]
      const permission = node.permissionKeys?.length ? node.permissionKeys : node.permissionKey
      if (!map[pathname]) {
        map[pathname] = permission
      }
    }
    if (node.children?.length) {
      walkRoutePermissions(node.children, map)
    }
  }
}

export const useMenuStore = defineStore('menu', () => {
  const items = ref<NavMenuNode[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  const menuGroups = computed<NavMenuGroup[]>(() => [
    {
      title: '',
      items: items.value,
    },
  ])

  const routePermissionMap = computed<Record<string, RoutePermission>>(() => {
    const map: Record<string, RoutePermission> = { ...staticRoutePermissions }
    walkRoutePermissions(items.value, map)
    return map
  })

  async function fetchMenu() {
    loading.value = true
    try {
      items.value = await navMenuService.getMenu()
      loaded.value = true
    } catch {
      items.value = []
      loaded.value = false
    } finally {
      loading.value = false
    }
  }

  function reset() {
    items.value = []
    loaded.value = false
  }

  return {
    items,
    loading,
    loaded,
    menuGroups,
    routePermissionMap,
    fetchMenu,
    reset,
  }
})
