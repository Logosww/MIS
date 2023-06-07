interface BreadcrumbItem {
  path: string;
  breadcrumbName: string;
  title?: string;
  subTitle?: string;
};

export const breadcrumbPathMap: Record<string, BreadcrumbItem> = {
  '': {
    path: '/admin',
    breadcrumbName: '首页',
    title: 'Dashboard',
    subTitle: '仪表盘'
  },
  'users': {
    path: '/admin/users',
    breadcrumbName: '用户管理',
    title: '用户管理'
  },
  'setting': {
    path: '/admin/setting',
    breadcrumbName: '系统设置',
    title: '系统设置'
  },
  'blogs': {
    path: '/admim/blogs',
    breadcrumbName: '博客管理',
    title: '博客管理'
  }
};