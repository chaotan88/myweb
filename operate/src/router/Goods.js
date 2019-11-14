export default {
  path: '/admin/goods',
  redirect: '/admin/goods/classify',
  meta: {
    nav: '商品',
    icon: 'icon-goods-copy',
    auth: true,
    authCode: 501020
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 商品管理
    {
      path: '/admin/goods/goods-manage',
      redirect: '/admin/goods/goods-manage/all',
      meta: {
        nav: '商品管理',
        icon: 'icon-goods-copy',
        auth: true,
        visible: true,
        authCode: 501028
      },
      component: r => require(['@/views/admin/goods/goods-manage/ManageLayout'], r),
      children: [
        {
          path: '/admin/goods/goods-manage/all',
          meta: {
            title: '商品管理-全部',
            nav: '商品管理',
            auth: true,
            authCode: 501028,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '商品管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManageList'], r)
        },

        {
          path: '/admin/goods/goods-manage/unsubmit',
          meta: {
            title: '商品管理-未提交审核',
            nav: '商品管理',
            auth: true,
            authCode: 501028,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '未提交审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManageList'], r)
        },

        {
          path: '/admin/goods/goods-manage/wait',
          meta: {
            title: '商品管理-待审核',
            nav: '商品管理',
            auth: true,
            authCode: 501028,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManageList'], r)
        },

        {
          path: '/admin/goods/goods-manage/import-data',
          meta: {
            title: '导入商品基础资料',
            auth: true,
            authCode: 501028,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '导入商品基础资料', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ImportData'], r)
        },

        {
          path: '/admin/goods/goods-manage/import-img',
          meta: {
            title: '导入商品图片',
            auth: true,
            authCode: 501028,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '导入商品图片', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ImportImg'], r)
        },

        {
          path: '/admin/goods/goods-manage/pass',
          meta: {
            title: '商品管理-审核通过',
            nav: '商品管理',
            auth: true,
            authCode: 501028,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManageList'], r)
        },

        {
          path: '/admin/goods/goods-manage/reject',
          meta: {
            title: '商品管理-审核不通过',
            nav: '商品管理',
            auth: true,
            authCode: 501028,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManageList'], r)
        },

        // ----------- 商品管理新增
        {
          path: '/admin/goods/goods-manage/add',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 501028,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManagePublicSku'], r)
        },

        // ----------- 商品管理新增
        {
          path: '/admin/goods/goods-manage/add-sku',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 501028,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManagePublicSku'], r)
        },

        // ----------- 商品管理编辑
        {
          path: '/admin/goods/goods-manage/edit',
          meta: {
            title: '编辑商品',
            auth: true,
            authCode: 501028,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '编辑商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/ManagePublicSku'], r)
        },

        // ----------- 商品管理详情
        {
          path: '/admin/goods/goods-manage/details',
          meta: {
            title: '商品详情',
            nav: '分类',
            auth: true,
            authCode: 501028,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品', path: '/admin/goods' },
              { title: '商品管理', path: '/admin/goods/goods-manage' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-manage/PublicDetails'], r)
        }
      ]
    },

    // 商品审核
    {
      path: '/admin/goods/manage',
      redirect: '/admin/goods/manage/all',
      meta: {
        nav: '商品审核',
        icon: 'icon-fenxiaoshangpinliebiao',
        auth: true,
        authCode: 501021
      },
      component: r => require(['@/views/admin/goods/goods-list/ManageLayout'], r),
      children: [

        // 商品审核-全部
        {
          path: '/admin/goods/manage/all',
          meta: {
            title: '商品审核-全部',
            nav: '商品审核',
            auth: true,
            authCode: 501021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/wait',
          meta: {
            title: '商品审核-全部',
            nav: '商品审核',
            auth: true,
            authCode: 501021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManageList'], r)
        },

        // 商品审核-待审核
        {
          path: '/admin/goods/manage/index',
          meta: {
            title: '商品审核-待审核',
            nav: '商品审核',
            auth: true,
            authCode: 501021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/import-data',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 501021,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ImportData'], r)
        },

        {
          path: '/admin/goods/manage/import-img',
          meta: {
            title: '导入商品图片',
            auth: true,
            authCode: 501021,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '导入商品图片', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ImportImg'], r)
        },

        {
          path: '/admin/goods/manage/pass',
          meta: {
            title: '商品审核-审核通过',
            nav: '商品审核',
            auth: true,
            authCode: 501021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManageList'], r)
        },

        {
          path: '/admin/goods/manage/reject',
          meta: {
            title: '商品审核-审核不通过',
            nav: '商品审核',
            auth: true,
            authCode: 501021,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManageList'], r)
        },

        // 商品审核新增
        {
          path: '/admin/goods/manage/examine',
          meta: {
            title: '审核商品',
            nav: '分类',
            auth: true,
            authCode: 501021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '审核商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManagePublicSku'], r)
        },

        // 商品审核新增
        {
          path: '/admin/goods/manage/add',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 501021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManagePublicSku'], r)
        },

        // 商品审核新增
        {
          path: '/admin/goods/manage/add-sku',
          meta: {
            title: '新增商品',
            nav: '分类',
            auth: true,
            authCode: 501021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '新增商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManagePublicSku'], r)
        },

        // 商品审核编辑
        {
          path: '/admin/goods/manage/edit',
          meta: {
            title: '商品分类首页',
            nav: '分类',
            auth: true,
            authCode: 501021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '编辑商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/ManagePublicSku'], r)
        },

        // 商品审核详情
        {
          path: '/admin/goods/manage/details',
          meta: {
            title: '商品详情',
            nav: '分类',
            auth: true,
            authCode: 501021,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '商品审核', path: '/admin/goods/manage' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 栏目列表
    {
      path: '/admin/goods/column/manage',
      redirect: '/admin/goods/column/manage/index',
      meta: {
        nav: '栏目列表',
        icon: 'icon-lanmu',
        auth: true,
        authCode: 501022,
        visible: false
      },
      component: r => require(['@/views/admin/goods/column/ManageLayout'], r),
      children: [

        // 栏目首页
        {
          path: '/admin/goods/column/manage/index',
          meta: {
            title: '栏目列表',
            pageBack: true,
            auth: true,
            authCode: 501022,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '栏目列表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/column/ManageList'], r)
        },

        // 添加栏目
        {
          path: '/admin/goods/column/manage/add',
          meta: {
            title: '栏目新增',
            auth: true,
            authCode: 501022,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '栏目列表', path: '/admin/goods/column/manage/index' },
              { title: '添加栏目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/column/ManagePublic'], r)
        },

        // 编辑栏目
        {
          path: '/admin/goods/column/manage/edit',
          meta: {
            title: '编辑栏目',
            auth: true,
            authCode: 501022,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '栏目列表', path: '/admin/goods/column/manage/index' },
              { title: '编辑栏目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/column/ManagePublic'], r)
        }
      ]
    },

    // 栏目管理
    {
      path: '/admin/goods/column-new',
      redirect: '/admin/goods/column-new/index',
      meta: {
        nav: '栏目管理',
        icon: 'icon-lanmu',
        auth: true,
        authCode: 501022,
        visible: true
      },
      component: r => require(['@/views/admin/goods/column-new/Layout'], r),
      children: [

        // 栏目首页
        {
          path: '/admin/goods/column-new/index',
          meta: {
            title: '栏目管理',
            pageBack: true,
            auth: true,
            authCode: 501022,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '栏目管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/column-new/index'], r)
        },

        // 栏目管理详情
        {
          path: '/admin/goods/column-new/details',
          meta: {
            title: '栏目新增',
            auth: true,
            authCode: 501022,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '栏目列表', path: '/admin/goods/column-new/index' },
              { title: '添加栏目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 商品类目
    {
      path: '/admin/goods/classify',
      redirect: '/admin/goods/classify/index',
      meta: {
        nav: '商品类目',
        icon: 'icon-31leimu',
        auth: true,
        authCode: 501023
      },
      component: r => require(['@/views/admin/goods/classify/IndexLayout'], r),
      children: [

        // 商品分类首页
        {
          path: '/admin/goods/classify/index',
          meta: {
            title: '商品类目',
            nav: '',
            auth: true,
            authCode: 501023,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品类目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyClassify'], r)
        },

        // 商品分类新增
        {
          path: '/admin/goods/classify/add',
          meta: {
            title: '',
            nav: '',
            auth: true,
            authCode: 501023,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品类目', path: '/admin/goods/classify' },
              { title: '新增分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyClassifyPublic'], r)
        },

        // 商品分类编辑
        {
          path: '/admin/goods/classify/edit',
          meta: {
            title: '',
            nav: '',
            auth: true,
            authCode: 501023,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品类目', path: '/admin/goods/classify' },
              { title: '编辑分类', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyClassifyPublic'], r)
        }
      ]
    },

    // 商品参数
    {
      path: '/admin/goods/property',
      redirect: '/admin/goods/property/index',
      meta: {
        nav: '商品参数',
        icon: 'icon-xitongcanshushezhi',
        auth: true,
        authCode: 501024
      },
      component: r => require(['@/views/admin/goods/attribute/PropertyLayout'], r),
      children: [
        {
          path: '/admin/goods/property/index',
          meta: {
            title: '商品参数',
            auth: true,
            authCode: 501024,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品参数', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyIndex'], r)
        },

        // {
        //   path: '/admin/goods/property/classify',
        //   meta: {
        //     title: '关联类目',
        //     auth: true,
        //     authCode: 501024,
        //     breadcrumb: [
        //       { title: '首页', path: '/admin/console' },
        //       { title: '商品管理', path: '/admin/goods/manage/all' },
        //       { title: '商品参数', path: '/admin/goods/property' },
        //       { title: '关联类目', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/goods/attribute/PropertyClassify'], r)
        // },

        {
          path: '/admin/goods/property/add',
          meta: {
            title: '',
            auth: true,
            authCode: 501024,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品参数', path: '/admin/goods/property' },
              { title: '新增参数', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyPublic'], r)
        },

        {
          path: '/admin/goods/property/edit',
          meta: {
            title: '',
            auth: true,
            authCode: 501024,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品参数', path: '/admin/goods/property' },
              { title: '编辑参数', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyPublic'], r)
        },

        {
          path: '/admin/goods/property/classifyAdd',
          meta: {
            title: '',
            auth: true,
            authCode: 501024,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品参数', path: '/admin/goods/property' },
              { title: '关联类目', path: '/admin/goods/property/classify' },
              { title: '新增类目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyClassifyPublic'], r)
        },

        {
          path: '/admin/goods/property/classifyEdit',
          meta: {
            title: '',
            auth: true,
            authCode: 501024,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '商品参数', path: '/admin/goods/property' },
              { title: '关联类目', path: '/admin/goods/property/classify' },
              { title: '编辑类目', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/attribute/PropertyClassifyPublic'], r)
        }
      ]
    },

    // NFC商品
    {
      path: '/admin/goods/NFC',
      meta: {
        nav: 'NFC商品',
        icon: 'icon-nfc',
        auth: true,
        authCode: 501025
      },
      component: r => require(['@/views/admin/goods/nfc/NFCLayout'], r),
      children: [
        {
          path: '',
          meta: {
            title: '',
            nav: '',
            auth: true,
            authCode: 501025,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: 'NFC商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/nfc/NFCIndex'], r)
        },
        {
          path: '/admin/goods/NFC/detail',
          meta: {
            title: '',
            nav: '',
            auth: true,
            authCode: 501025,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: 'NFC商品', path: '/admin/goods/NFC' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/nfc/NFCDetail'], r)
        }
      ]
    },

    // 品牌管理
    {
      path: '/admin/goods/brand',
      meta: {
        nav: '品牌管理',
        icon: 'icon-pinpai',
        auth: true,
        authCode: 501026
      },
      component: r => require(['@/views/admin/goods/brand/brandLayout'], r),
      children: [
        {
          path: '',
          meta: {
            title: '',
            nav: '',
            auth: true,
            authCode: 501026,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage/all' },
              { title: '品牌商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/brand/brandIndex'], r)
        }
      ]
    },

    // 新增品牌
    {
      path: '/admin/goods/brand/add',
      meta: {
        visible: false,
        title: '',
        nav: '',
        auth: true,
        authCode: 501026,
        breadcrumb: [
          { title: '首页', path: '/admin/console' },
          { title: '商品管理', path: '/admin/goods/manage/all' },
          { title: '品牌商品', path: '/admin/goods/brand' },
          { title: '新增', path: '' }
        ]
      },
      component: r => require(['@/views/admin/goods/brand/brandDetail'], r)
    },

    // 编辑品牌
    {
      path: '/admin/goods/brand/edit',
      meta: {
        title: '',
        visible: false,
        nav: '',
        auth: true,
        authCode: 501026,
        breadcrumb: [
          { title: '首页', path: '/admin/console' },
          { title: '商品管理', path: '/admin/goods/manage/all' },
          { title: '品牌商品', path: '/admin/goods/brand' },
          { title: '编辑', path: '' }
        ]
      },
      component: r => require(['@/views/admin/goods/brand/brandDetail'], r)
    },

    // 活动专区
    {
      path: '/admin/goods/activity',
      redirect: '/admin/goods/activity/index',
      meta: {
        nav: '活动专区',
        icon: 'icon-activity',
        auth: true,
        authCode: 501027,
        visible: true
      },
      component: r => require(['@/views/admin/goods/activity/Layout'], r),
      children: [
        {
          path: '/admin/goods/activity/index',
          meta: {
            title: '活动专区',
            auth: true,
            authCode: 501027,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '活动专区', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/activity/Index'], r)
        },

        {
          path: '/admin/goods/activity/details',
          meta: {
            title: '活动专区',
            auth: true,
            authCode: 501027,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/manage' },
              { title: '活动专区', path: '/admin/goods/activity' },
              { title: '商品详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 溯源管理
    {
      path: '/admin/goods/traceability',
      redirect: '/admin/goods/traceability/list',
      meta: {
        nav: '溯源管理',
        icon: 'icon-goods-copy',
        auth: true,
        visible: false,
        authCode: 501029
      },
      component: r => require(['@/views/admin/goods/traceability/layout'], r),
      children: [
        {
          path: '/admin/goods/traceability/list',
          meta: {
            title: '溯源管理',
            nav: '溯源管理',
            auth: true,
            authCode: 501029,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods/traceability' },
              { title: '溯源管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/traceability/list'], r)
        },

        // ----------- 溯源管理新增
        {
          path: '/admin/goods/traceability/add',
          meta: {
            title: '新增溯源',
            nav: '分类',
            auth: true,
            authCode: 501029,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods' },
              { title: '溯源管理', path: '/admin/goods/traceability' },
              { title: '新增溯源', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/traceability/traceabilityPublic'], r)
        },
        // ----------- 编辑管理编辑
        {
          path: '/admin/goods/traceability/edit',
          meta: {
            title: '编辑溯源',
            auth: true,
            authCode: 501029,
            thirdMenu: false,       // 三级菜单
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商品管理', path: '/admin/goods' },
              { title: '溯源管理', path: '/admin/goods/traceability' },
              { title: '编辑溯源', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/traceability/traceabilityPublic'], r)
        }
      ]
    }
  ]
}
