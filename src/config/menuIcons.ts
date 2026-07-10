import type { Component } from 'vue'
import {
  TableIcon,
  UserGroupIcon,
  SettingsIcon,
  PieChartIcon,
  LayoutDashboardIcon,
  BoxCubeIcon,
  GridIcon,
  ArchiveIcon,
  MenuIcon,
  PageIcon,
  FolderIcon,
  ListIcon,
} from '@/icons'

const iconMap: Record<string, Component> = {
  LayoutDashboardIcon,
  TableIcon,
  BoxCubeIcon,
  GridIcon,
  PieChartIcon,
  SettingsIcon,
  UserGroupIcon,
  ArchiveIcon,
  MenuIcon,
  PageIcon,
  FolderIcon,
  ListIcon,
}

export function resolveMenuIcon(icon?: string | null): Component {
  if (!icon) return PageIcon
  return iconMap[icon] ?? PageIcon
}

export const MENU_ICON_OPTIONS = Object.keys(iconMap)
