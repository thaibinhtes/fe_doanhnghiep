<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/" class="flex items-center gap-2.5">
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-brand-600"
          aria-hidden="true"
        >
          <svg viewBox="0 0 48 48" class="h-5 w-5">
            <polygon
              points="24,8 28.5,19 40,19 30.5,26.5 34,38 24,30.5 14,38 17.5,26.5 8,19 19.5,19"
              fill="#d4af37"
            />
          </svg>
        </span>
        <span
          v-if="isExpanded || isHovered || isMobileOpen"
          class="min-w-0"
        >
          <span class="block text-[11px] font-bold uppercase tracking-wide text-gold-600 dark:text-gold-400">
            {{ APP_ORG }}
          </span>
          <span class="mt-0.5 block text-sm font-bold leading-snug text-brand-700 dark:text-brand-300">
            {{ APP_SHORT_NAME }}
          </span>
        </span>
        <span
          v-else
          class="sr-only"
        >
          {{ APP_SHORT_NAME }}
        </span>
      </router-link>
    </div>
    <div
      class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar"
    >
      <nav class="mb-6">
        <div v-if="menuStore.loading && !menuStore.loaded" class="px-2 py-4 text-center text-sm text-gray-400">
          Đang tải menu...
        </div>
        <div v-else class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              v-if="menuGroup.title"
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4" :class="{ 'mt-0': !menuGroup.title }">
              <li v-for="(item, index) in menuGroup.items" :key="item.id">
                <button
                  v-if="item.children?.length"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index, item),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index, item),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index, item)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="resolveMenuIcon(item.icon)" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.label }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index,
                          item,
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="resolveMenuIcon(item.icon)" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.label }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      item.children?.length &&
                      isSubmenuOpen(groupIndex, index, item) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-5">
                      <li
                        v-for="(subItem, subIndex) in item.children"
                        :key="subItem.id"
                      >
                        <template v-if="subItem.children?.length">
                          <button
                            type="button"
                            class="menu-dropdown-item menu-dropdown-item-inactive w-full text-left"
                            :class="{
                              'menu-dropdown-item-active': isNestedSubmenuOpen(
                                groupIndex,
                                index,
                                subIndex,
                                subItem,
                              ),
                            }"
                            @click="toggleNestedSubmenu(groupIndex, index, subIndex)"
                          >
                            <span class="min-w-0 flex-1">{{ subItem.label }}</span>
                            <ChevronDownIcon
                              :class="[
                                'ml-auto h-4 w-4 shrink-0 transition-transform duration-200',
                                {
                                  'rotate-180': isNestedSubmenuOpen(
                                    groupIndex,
                                    index,
                                    subIndex,
                                    subItem,
                                  ),
                                },
                              ]"
                            />
                          </button>
                          <ul
                            v-show="isNestedSubmenuOpen(groupIndex, index, subIndex, subItem)"
                            class="mt-1 space-y-1 border-l border-gray-200 pl-2 dark:border-gray-700"
                          >
                            <li
                              v-for="nestedItem in subItem.children"
                              :key="nestedItem.id"
                            >
                              <router-link
                                v-if="nestedItem.path"
                                :to="nestedItem.path"
                                :class="[
                                  'menu-dropdown-item text-sm',
                                  {
                                    'menu-dropdown-item-active': isActive(nestedItem.path),
                                    'menu-dropdown-item-inactive': !isActive(nestedItem.path),
                                  },
                                ]"
                              >
                                {{ nestedItem.label }}
                              </router-link>
                            </li>
                          </ul>
                        </template>
                        <router-link
                          v-else-if="subItem.path"
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.label }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  ChevronDownIcon,
  HorizontalDots,
} from "../../icons";
import { useSidebar } from "@/composables/useSidebar";
import { collectNavPaths } from "@/config/menu";
import { resolveMenuIcon } from "@/config/menuIcons";
import { useAuthStore } from "@/stores/auth";
import { useMenuStore } from "@/stores/menu";
import { APP_ORG, APP_SHORT_NAME } from "@/config/app";

const route = useRoute();
const auth = useAuthStore();
const menuStore = useMenuStore();
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();
const openNestedSubmenu = ref(null);

const menuGroups = computed(() => menuStore.menuGroups);

onMounted(async () => {
  if (auth.isAuthenticated && !menuStore.loaded) {
    await menuStore.fetchMenu();
  }
});

const isActive = (path) => {
  if (!path) return false;

  const [pathname, queryString] = path.split("?");
  if (route.path !== pathname) return false;

  if (!queryString) {
    if (pathname === "/admin/cadastral") {
      return !route.query.tab || route.query.tab === "new" || route.query.tab === "lookup";
    }
    return true;
  }

  const expected = new URLSearchParams(queryString);
  for (const [key, value] of expected.entries()) {
    if (key === 'tab' && value === 'legacy') {
      const current = String(route.query.tab ?? '')
      if (current !== 'legacy' && current !== 'import') return false
      continue
    }
    if (String(route.query[key] ?? "") !== value) return false;
  }
  return true;
};

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const nestedSubmenuKey = (groupIndex, itemIndex, subIndex) =>
  `${groupIndex}-${itemIndex}-${subIndex}`;

const toggleNestedSubmenu = (groupIndex, itemIndex, subIndex) => {
  const key = nestedSubmenuKey(groupIndex, itemIndex, subIndex);
  openNestedSubmenu.value = openNestedSubmenu.value === key ? null : key;
};

const isNestedSubmenuOpen = (groupIndex, itemIndex, subIndex, subItem) => {
  const key = nestedSubmenuKey(groupIndex, itemIndex, subIndex);
  return (
    openNestedSubmenu.value === key ||
    collectNavPaths(subItem.children ?? []).some((path) => isActive(path))
  );
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.children?.length &&
        collectNavPaths(item.children).some((path) => isActive(path)),
    ),
  );
});

const isSubmenuOpen = (groupIndex, itemIndex, item) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      item?.children &&
      collectNavPaths(item.children).some((path) => isActive(path)))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight;
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>
