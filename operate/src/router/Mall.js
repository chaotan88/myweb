export default {
  path: '/admin/mall',
  redirect: '/admin/mall/manage',
  meta: {
    nav: '商城',
    icon: '',
    auth: true,
    visible: false,
    authCode: 501020
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ----------------开店申请
    {
      path: '/admin/mall/manage',
      redirect: '/admin/mall/manage/index',
      meta: {
        nav: '开店申请',
        icon: '',
        auth: true,
        visible: false,
        authCode: 501021
      },
      component: r => require(['@/views/admin/mall/ManageLayout'], r),
      children: [
        {
          path: '/admin/mall/manage/index',
          meta: {
            title: '开店申请-全部',
            nav: '商品管理',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '全部', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManageIndex'], r)
        },

        {
          path: '/admin/mall/manage/wait',
          meta: {
            title: '开店申请-待审核',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManageIndex'], r)
        },

        {
          path: '/admin/mall/manage/pass',
          meta: {
            title: '开店申请-审核通过',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManageIndex'], r)
        },

        {
          path: '/admin/mall/manage/reject',
          meta: {
            title: '开店申请-审核驳回',
            nav: '商品管理',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManageIndex'], r)
        },

        // ----------- 商品管理审核
        {
          path: '/admin/mall/manage/check',
          meta: {
            title: '申请详情',
            auth: true,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManagePublicDetails'], r)
        },

        // ----------- 商品管理详情
        {
          path: '/admin/mall/manage/details',
          meta: {
            title: '申请详情',
            auth: true,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '开店申请', path: '/admin/mall/manage/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ManagePublicDetails'], r)
        }
      ]
    },

    // ----------------店铺管理
    {
      path: '/admin/mall/authentication',
      redirect: '/admin/mall/authentication/index',
      meta: {
        nav: '店铺管理',
        icon: '',
        auth: true,
        authCode: 501022
      },

      // ---------------- 店铺管理
      component: r => require(['@/views/admin/mall/ShopLayout'], r),
      children: [
        {
          path: '/admin/mall/authentication/index',
          meta: {
            title: '商品分类首页',
            nav: '分类',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '店铺管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ShopIndex'], r)
        },

        // ----------------创建店铺
        {
          path: '/admin/mall/authentication/add',
          meta: {
            title: '创建店铺',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '店铺管理', path: '/admin/mall/authentication/index' },
              { title: '创建店铺', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ShopPublic'], r)
        },

        // ----------------编辑店铺
        {
          path: '/admin/mall/authentication/edit',
          meta: {
            title: '编辑店铺',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '店铺管理', path: '/admin/mall/authentication/index' },
              { title: '编辑店铺', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/ShopPublic'], r)
        },

        // ----------------店铺统计
        {
          path: '/admin/mall/authentication/count',
          redirect: '/admin/mall/authentication/count/index',
          meta: {
            nav: '店铺统计',
            auth: true
          },
          component: r => require(['@/views/admin/mall/CountLayout'], r),
          children: [
            {
              path: '/admin/mall/authentication/count/index',
              meta: {
                title: '店铺统计',
                nav: '营收管理',
                auth: true,
                breadcrumb: [
                  { title: '首页', path: '/admin/console' },
                  { title: '商城', path: '/admin/mall' },
                  { title: '店铺管理', path: '/admin/mall/authentication/index' },
                  { title: '店铺统计', path: '/admin/mall/authentication/count' },
                  { title: '营收管理', path: '' }
                ]
              },
              component: r => require(['@/views/admin/mall/CountIndex'], r)
            }
          ]
        }
      ]
    },

    // ---------------- 商品属性
    {
      path: '/admin/mall/property',
      redirect: '/admin/mall/property/index',
      meta: {
        nav: '商品属性',
        icon: '',
        auth: true,
        authCode: 501023
      },
      component: r => require(['@/views/admin/mall/PropertyLayout'], r),
      children: [
        {
          path: '/admin/mall/property/index',
          meta: {
            title: '商品属性-属性设置',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property/index' },
              { title: '属性设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyIndex'], r)
        },

        {
          path: '/admin/mall/property/classify',
          meta: {
            title: '商品属性-属性分类',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property/index' },
              { title: '属性分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyClassify'], r)
        },

        {
          path: '/admin/mall/property/add',
          meta: {
            title: '商品属性-属性增加/设置',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property' },
              { title: '属性设置', path: '/admin/mall/property/index' },
              { title: '新增属性', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyPublic'], r)
        },

        {
          path: '/admin/mall/property/edit',
          meta: {
            title: '商品属性-属性增加/设置',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property' },
              { title: '属性设置', path: '/admin/mall/property/index' },
              { title: '编辑属性', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyPublic'], r)
        },

        {
          path: '/admin/mall/property/classifyAdd',
          meta: {
            title: '商品属性-属性分类',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property' },
              { title: '属性分类', path: '/admin/mall/property/classify' },
              { title: '新增分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyClassifyPublic'], r)
        },

        {
          path: '/admin/mall/property/classifyEdit',
          meta: {
            title: '商品属性-属性分类',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '商品属性', path: '/admin/mall/property' },
              { title: '属性分类', path: '/admin/mall/property/classify' },
              { title: '编辑分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/PropertyClassifyPublic'], r)
        }
      ]
    },

    // ---------------- 创客特权
    {
      path: '/admin/mall/vipLevel',
      redirect: '/admin/mall/vipLevel/index',
      meta: {
        nav: '创客特权',
        icon: '',
        visible: false,
        auth: true,
        authCode: 501024
      },

      // ----------------商品分类首页
      component: r => require(['@/views/admin/mall/LevelLayout'], r),
      children: [
        {
          path: '/admin/mall/vipLevel/index',
          meta: {
            title: '创客特权',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商城', path: '/admin/mall' },
              { title: '创客特权', path: '' }
            ]
          },
          component: r => require(['@/views/admin/mall/LevelReset'], r)
        }
      ]
    }
  ]
}
