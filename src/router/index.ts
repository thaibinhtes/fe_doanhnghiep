import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRoutePermission, getFirstAccessibleRoute } from '@/config/menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { title: 'Dashboard', requiresAuth: true },
    },
    {
      path: '/companies',
      name: 'Companies',
      component: () => import('../views/Companies.vue'),
      meta: { title: 'Danh sách doanh nghiệp', requiresAuth: true, fillViewport: true },
    },
    {
      path: '/companies/create',
      name: 'Create Company',
      component: () => import('../views/Companies/CreateCompany.vue'),
      meta: { title: 'Tạo doanh nghiệp', requiresAuth: true },
    },
    {
      path: '/companies/identity',
      name: 'Identity Companies',
      component: () => import('../views/Companies/IdentityCompanies.vue'),
      meta: { title: 'Định danh doanh nghiệp', requiresAuth: true },
    },
    {
      path: '/companies/map',
      name: 'Company Map',
      component: () => import('../views/Companies/CompanyMap.vue'),
      meta: { title: 'Bản đồ doanh nghiệp', requiresAuth: true },
    },
    {
      path: '/companies/:id/map',
      name: 'Company Map Update',
      component: () => import('../views/Companies/CompanyMapUpdate.vue'),
      meta: { title: 'Cập nhật tọa độ', requiresAuth: true },
    },
    {
      path: '/members',
      name: 'Members',
      component: () => import('../views/Members.vue'),
      meta: { title: 'Danh sách thành viên', requiresAuth: true },
    },
    {
      path: '/members/create',
      name: 'Create Member',
      component: () => import('../views/Members/CreateMember.vue'),
      meta: { title: 'Tạo thành viên', requiresAuth: true },
    },
    {
      path: '/admin/roles',
      name: 'Role Permissions',
      component: () => import('../views/Admin/RolePermissions.vue'),
      meta: { title: 'Phân quyền', requiresAuth: true },
    },
    {
      path: '/admin/cadastral',
      name: 'Cadastral Management',
      component: () => import('../views/Admin/CadastralManagement.vue'),
      meta: { title: 'Quản lý địa chính', requiresAuth: true },
    },
    {
      path: '/admin/business-types',
      name: 'Company Business Types',
      component: () => import('../views/Admin/CompanyBusinessTypes.vue'),
      meta: { title: 'Loại hình doanh nghiệp', requiresAuth: true },
    },
    {
      path: '/admin/industry-categories',
      name: 'Industry Categories',
      component: () => import('../views/Admin/IndustryCategories.vue'),
      meta: { title: 'Danh mục ngành nghề', requiresAuth: true },
    },
    {
      path: '/admin/org-units',
      name: 'Org Units',
      component: () => import('../views/Admin/OrgUnits.vue'),
      meta: { title: 'Quản lý đơn vị', requiresAuth: true },
    },
    {
      path: '/admin/users',
      name: 'User Management',
      component: () => import('../views/Admin/UserManagement.vue'),
      meta: { title: 'Quản lý người dùng', requiresAuth: true },
    },
    {
      path: '/companies/statuses',
      name: 'Company Statuses',
      component: () => import('../views/Admin/CompanyStatuses.vue'),
      meta: { title: 'Trạng thái doanh nghiệp', requiresAuth: true },
    },
    {
      path: '/admin/statuses',
      redirect: '/companies/statuses',
    },
    {
      path: '/reports/summary',
      name: 'Summary Report',
      component: () => import('../views/Reports/SummaryReport.vue'),
      meta: { title: 'Báo cáo tổng hợp', requiresAuth: true },
    },
    {
      path: '/reports/progress',
      name: 'Progress Report',
      component: () => import('../views/Reports/ProgressReport.vue'),
      meta: { title: 'Báo cáo tiến độ định danh', requiresAuth: true },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Đăng nhập', guestOnly: true },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Đăng ký', guestOnly: true },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error-404',
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  document.title = `${to.meta.title ?? 'HTQLDN'} | Hệ Thống Quản Lý Doanh Nghiệp (HTQLDN)`

  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.init()
  }

  const homePath = () => getFirstAccessibleRoute((key) => auth.hasPermission(key))

  if (to.meta.guestOnly && auth.isAuthenticated) {
    if (to.query.error === 'no-permission') {
      return next()
    }
    return next({ path: homePath() })
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ path: '/signin', query: { redirect: to.fullPath } })
  }

  const requiredPermission = getRoutePermission(to.path)
  if (requiredPermission && auth.isAuthenticated && !auth.hasPermission(requiredPermission)) {
    const fallback = homePath()
    if (fallback !== to.path) {
      return next({ path: fallback })
    }
    await auth.logout()
    return next({ path: '/signin', query: { error: 'no-permission' } })
  }

  next()
})

export default router
