import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  {
    path: '/system',
    component: Layout,
    meta: { perm: 'm:sys', title: '系统', icon: 'chart' },
    children: [
      {
        path: 'org_manage',
        name: 'org_manage',
        component: _import('_system/org/index'),
        meta: { perm: 'm:sys:role', title: '机构管理', icon: 'chart', noCache: true }
      },
      {
        path: 'user_manage',
        name: 'user_manage',
        component: _import('_system/user/index'),
        meta: { perm: 'm:sys:user', title: '用户管理', icon: 'chart', noCache: true }
      },
      {
        path: 'role_manage',
        name: 'role_manage',
        component: _import('_system/role/index'),
        meta: { perm: 'm:sys:role', title: '角色管理', icon: 'chart', noCache: true }
      },
      {
        hidden: true,
        path: 'role_manage/:roleId/assign_perm',
        name: 'role_manage_assign_perm',
        component: _import('_system/role/assign_perm'),
        meta: { hiddenTag: true, title: '角色授权' }
      },
      {
        path: 'perm_manage',
        name: 'perm_manage',
        component: _import('_system/perm/index'),
        meta: { perm: 'm:sys:perm', title: '权限管理', icon: 'chart', noCache: true }

      }
    ]
  },
  {
    path: '/menu1',
    component: Layout,
    meta: { perm: 'm:menu1', title: '信息发布', icon: 'icon' },
    children: [
      {
        path: 'index11',
        name: 'menu11',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '概要信息', icon: 'icon' }
      },
      {
        path: 'index12',
        name: 'menu12',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '机构职能', icon: 'icon' }
      },
      {
        path: 'index13',
        name: 'menu13',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '负责人信息', icon: 'icon' }
      },
      {
        path: 'index14',
        name: 'menu14',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '文件资料', icon: 'icon' }
      },
      {
        path: 'index15',
        name: 'menu15',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '政务信息', icon: 'icon' }
      },
      {
        path: 'index16',
        name: 'menu16',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '信息公开', icon: 'icon' }
      },
      {
        path: 'index17',
        name: 'menu17',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '数据发布', icon: 'icon' }
      },
      {
        path: 'index18',
        name: 'menu18',
        component: _import('menu/menu1'),
        meta: { perm: 'm:menu1', title: '数据开放', icon: 'icon' }
      }
    ]
  },

  {
    path: '/menu2',
    component: Layout,
    meta: { perm: 'm:menu2', title: '解读回应', icon: 'icon' },
    children: [
      {
        path: 'index21',
        name: 'menu21',
        component: _import('menu/menu2'),
        meta: { perm: 'm:menu2', title: '解读回应专访', icon: 'icon' }
      },
      {
        path: 'index22',
        name: 'menu22',
        component: _import('menu/menu2'),
        meta: { perm: 'm:menu2', title: '分类提炼精简', icon: 'icon' }
      },
      {
        path: 'index23',
        name: 'menu23',
        component: _import('menu/menu2'),
        meta: { perm: 'm:menu2', title: '转载传播增强', icon: 'icon' }
      },
      {
        path: 'index24',
        name: 'menu24',
        component: _import('menu/menu2'),
        meta: { perm: 'm:menu2', title: '及时准确主动', icon: 'icon' }
      }
    ]
  },

  {
    path: '/menu3',
    component: Layout,
    meta: { perm: 'm:menu3', title: '办事服务', icon: 'chart' },
    children: [
      {
        path: 'menu3_1',
        component: _import('menu/menu3_1'),
        name: 'menu3_1',
        meta: { perm: 'm:menu3:1', title: '服务事项目录', icon: 'chart', noCache: true }
      },
      {
        path: 'menu3_2',
        component: _import('menu/menu3_2'),
        name: 'menu3_2',
        meta: { perm: 'm:menu3:2', title: '关联信息资源', icon: 'chart', noCache: true }
      },
      {
        path: 'menu3_3',
        component: _import('menu/menu3_3'),
        name: 'menu3_3',
        meta: { perm: 'm:menu3:3', title: '统一在线服务', icon: 'chart', noCache: true }
      },
      {
        path: 'menu3_4',
        component: _import('menu/menu3_4'),
        name: 'menu3_4',
        meta: { perm: 'm:menu3:3', title: '精细化办事指南', icon: 'chart', noCache: true }
      },
      {
        path: 'menu3_5',
        component: _import('menu/menu3_5'),
        name: 'menu3_5',
        meta: { perm: 'm:menu3:3', title: '记录办事过程', icon: 'chart', noCache: true }
      }
    ]
  },

  {
    path: '/menu4',
    name: 'menu4',
    component: Layout,
    meta: { perm: 'm:menu4', title: '互动交流', icon: 'example' },
    children: [
      {
        path: 'menu4_1',
        name: 'menu4_1',
        icon: 'tab',
        component: _import('menu/menu4_1/index'),
        meta: { perm: 'm:menu4:2', title: '统一建设互动交流', icon: 'table' }
      },
      {
        path: 'menu4_2',
        name: 'menu4_2',
        icon: 'tab',
        component: _import('menu/menu4_2/index'),
        meta: { perm: 'm:menu4:2', title: '数据汇聚统一处理', icon: 'table' }
      },
      {
        path: 'menu4_3',
        name: 'menu4_3',
        icon: 'tab',
        component: _import('menu/menu4_3/index'),
        meta: { perm: 'm:menu4:2', title: '审核把关有序处理', icon: 'table' }
      },
      {
        path: 'menu4_4',
        name: 'menu4_4',
        icon: 'tab',
        component: _import('menu/menu4_4/index'),
        meta: { perm: 'm:menu4:2', title: '认真客观处理回复', icon: 'table' }
      },
      {
        path: 'menu4_5',
        name: 'menu4_5',
        icon: 'tab',
        component: _import('menu/menu4_5/index'),
        meta: { perm: 'm:menu4:2', title: '意见受理公开公布', icon: 'table' }
      },
      {
        path: 'menu4_6',
        name: 'menu4_6',
        icon: 'tab',
        component: _import('menu/menu4_6/index'),
        meta: { perm: 'm:menu4:2', title: '形成更新知识库', icon: 'table' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
