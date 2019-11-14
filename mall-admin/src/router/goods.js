export default {
  path: '/admin/goods',
  redirect: '/admin/goods/manage',
  meta: {
    nav: '商品',
    icon: 'icon-gouwuche',
    auth: true,
    authCode: 401020
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ----------------商品分类
    {
      path: '/admin/goods/classify',
      redirect: '/admin/goods/classify/index',
      meta: {
        nav: '商品分类',
        icon: 'icon-fenlei',
        visible: false,
        auth: true,
        authCode: 401021
      },

      // ----------------商品分类首页
      component: r => require(['@/views/admin/goods/IndexLayout'], r),
      children: [
        {
          path: '/admin/goods/classify/index',
          meta: {
            title: '商品分类首页',
            nav: '分类',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/Classify'], r)
        },

        // ----------------商品分类新增
        {
          path: '/admin/goods/classify/add',
          meta: {
            title: '新增分类',
            nav: '分类',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品分类', path: '/admin/goods/classify/index' },
              { title: '新增分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ClassifyPublic'], r)
        },

        // ----------------商品分类编辑
        {
          path: '/admin/goods/classify/edit',
          meta: {
            title: '编辑分类',
            nav: '分类',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品分类', path: '/admin/goods/classify/index' },
              { title: '编辑分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ClassifyPublic'], r)
        }
      ]
    },

    // 商品管理
    {
      path: '/admin/goods/manage',
      redirect: '/admin/goods/manage/all',
      meta: {
        nav: '商品管理',
        icon: 'icon-25guanli',
        auth: true,
        authCode: 401021
      },
      component: r => require(['@/views/admin/goods/ManageLayout'], r),
      children: [
        {
          path: '/admin/goods/manage/all',
          meta: {
            title: '商品管理-全部',
            nav: '商品管理',
            auth: true,
            authCode: 401021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/unsubmit',
          meta: {
            title: '商品管理-全部',
            nav: '商品管理',
            auth: true,
            authCode: 401021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '未提交审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/wait',
          meta: {
            title: '商品管理-待审核',
            nav: '商品管理',
            auth: true,
            authCode: 401021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/import-data',
          meta: {
            title: '导入商品基础资料',
            auth: true,
            authCode: 401021,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '导入商品基础资料', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ImportData'], r)
        },

        {
          path: '/admin/goods/manage/import-img',
          meta: {
            title: '导入商品图片',
            auth: true,
            authCode: 401021,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '导入商品图片', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ImportImg'], r)
        },

        {
          path: '/admin/goods/manage/pass',
          meta: {
            title: '商品管理-审核通过',
            nav: '商品管理',
            auth: true,
            authCode: 401021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/reject',
          meta: {
            title: '商品管理-审核不通过',
            nav: '商品管理',
            auth: true,
            authCode: 401021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        // ----------- 商品管理新增
        {
          path: '/admin/goods/manage/add',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 401021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManagePublicSku'], r)
        },

        // ----------- 商品管理新增
        {
          path: '/admin/goods/manage/add-sku',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 401021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManagePublicSku'], r)
        },

        // ----------- 商品管理编辑
        {
          path: '/admin/goods/manage/edit',
          meta: {
            title: '编辑商品',
            auth: true,
            authCode: 401021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '编辑商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManagePublicSku'], r)
        },

        // ----------- 商品管理详情
        {
          path: '/admin/goods/manage/details',
          meta: {
            title: '商品详情',
            nav: '分类',
            auth: true,
            authCode: 401021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/PublicDetails'], r)
        }
      ]
    },

    // ----------------商品审核
    {
      path: '/admin/goods/examine',
      redirect: '/admin/goods/examine/index',
      meta: {
        nav: '商品审核',
        icon: 'icon-shenhe',
        visible: false,
        auth: true,
        authCode: 401023
      },
      component: r => require(['@/views/admin/goods/ExamineLayout'], r),
      children: [
        {
          path: '/admin/goods/examine/index',
          meta: {
            title: '商品审核-待审核',
            // refresh: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/examine/pass',
          meta: {
            title: '商品审核-审核通过',
            // refresh: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品审核', path: '/admin/goods/examine' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/examine/reject',
          meta: {
            title: '商品审核-审核不通过',
            // refresh: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品审核', path: '/admin/goods/examine' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/ManageList'], r)
        },

        {
          path: '/admin/goods/examine/details',
          meta: {
            title: '商品审核-详情',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品审核', path: '/admin/goods/examine' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/PublicDetails'], r)
        }
      ]
    }
  ]
}
