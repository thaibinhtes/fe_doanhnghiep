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
  let inflight: Promise<void> | null = null

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

  async function fetchMenu(force = false) {
    if (loaded.value && !force) {
      return
    }
    if (inflight && !force) {
      return inflight
    }

    loading.value = true
    inflight = (async () => {
      try {
        items.value = await navMenuService.getMenu()
        loaded.value = true
      } catch {
        items.value = []
        loaded.value = false
      } finally {
        loading.value = false
        inflight = null
      }
    })()

    return inflight
  }

  function reset() {
    items.value = []
    loaded.value = false
    inflight = null
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
