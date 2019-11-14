export default {
  path: '/admin/setting',
  redirect: '/admin/setting/basic-setting',
  meta: {
    nav: '设置',
    icon: 'icon-changyonggongju2',
    auth: true
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/setting/basic-setting',
      redirect: '/admin/setting/basic-setting/account-info',
      meta: {
        title: '基础设置',
        nav: '基础设置',
        icon: 'icon-msnui-sys-set',
        auth: true,
        breadcrumb: []
      },
      component: r => require(['@/views/admin/setting/basic-setting/BasicSettingLayout'], r),
      children: [
        {
          path: '/admin/setting/basic-setting/account-info',
          meta: {
            title: '账户信息',
            nav: '账户信息',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/basic-setting/AccountInfo'], r)
        },
        {
          path: '/admin/setting/basic-setting/account-security',
          meta: {
            title: '账户安全',
            nav: '账户安全',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/basic-setting/AccountSecurity'], r)
        },
        {
          path: '/admin/setting/basic-setting/edit-service-and-agreement/:contentId',
          component: r => require(['@/views/admin/setting/basic-setting/EditServiceAndAgreement'], r)
        },
        {
          path: '/admin/setting/basic-setting/advertising-setting',
          component: r => require(['@/views/admin/setting/basic-setting/AdvertisingSetting'], r)
        },
        {
          path: '/admin/setting/basic-setting/edit-advertising',
          component: r => require(['@/views/admin/setting/basic-setting/EditAdvertising'], r)
        }
      ]
    },
    {
      path: '/admin/setting/attribute-setting',
      redirect: '/admin/setting/attribute-setting/attribute-management',
      meta: {
        title: '属性设置',
        nav: '属性设置',
        icon: 'icon-kuozhanshuxing',
        auth: true,
        breadcrumb: []
      },
      component: r => require(['@/views/admin/setting/attribute-setting/AttributeSettingLayout'], r),
      children: [
        {
          path: '/admin/setting/attribute-setting/attribute-management',
          meta: {
            title: '属性管理',
            nav: '属性管理',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/AttributeList'], r)
        },
        {
          path: '/admin/setting/attribute-setting/add-attribute',
          meta: {
            title: '添加属性',
            nav: '添加属性',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/AddAttribute'], r)
        },
        {
          path: '/admin/setting/attribute-setting/edit-attribute/:attributeId',
          meta: {
            title: '编辑属性',
            nav: '编辑属性',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/EditAttribute'], r)
        },
        {
          path: '/admin/setting/attribute-setting/attribute-classification',
          meta: {
            title: '属性分类',
            nav: '属性分类',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/ClassificationList'], r)
        },
        {
          path: '/admin/setting/attribute-setting/add-classification',
          meta: {
            title: '添加分类',
            nav: '添加分类',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/AddClassification'], r)
        },
        {
          path: '/admin/setting/attribute-setting/edit-classification',
          meta: {
            title: '编辑分类',
            nav: '编辑分类',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/attribute-setting/EditClassification'], r)
        }
      ]
    },
    {
      path: '/admin/setting/logistics-setting',
      redirect: '/admin/setting/logistics-setting/logistics-list',
      meta: {
        title: '物流设置',
        nav: '物流设置',
        icon: 'icon-cangkucangchu-xianxing',
        auth: true,
        breadcrumb: []
      },
      component: r => require(['@/views/admin/setting/logistics-setting/LogisticsSettingLayout'], r),
      children: [
        {
          path: '/admin/setting/logistics-setting/logistics-list',
          meta: {
            title: '物流列表',
            nav: '物流列表',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/logistics-setting/LogisticsList'], r)
        },
        {
          path: '/admin/setting/logistics-setting/add-logistics',
          meta: {
            title: '添加物流',
            nav: '添加物流',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/logistics-setting/AddLogistics'], r)
        },
        {
          path: '/admin/setting/logistics-setting/edit-logistics/:logisticsId',
          meta: {
            title: '编辑物流',
            nav: '编辑物流',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/logistics-setting/EditLogistics'], r)
        }
      ]
    },
    {
      path: '/admin/setting/shop-setting',
      redirect: '/admin/setting/shop-setting/shop-info',
      meta: {
        title: '网店设置',
        nav: '网店设置',
        icon: 'icon-dianpu',
        auth: true,
        breadcrumb: []
      },
      component: r => require(['@/views/admin/setting/shop-setting/ShopSettingLayout'], r),
      children: [
        {
          path: '/admin/setting/shop-setting/shop-info',
          meta: {
            title: '网店信息',
            nav: '网店信息',
            auth: true,
            breadcrumb: []
          },
          component: r => require(['@/views/admin/setting/shop-setting/ShopInfo'], r)
        }
      ]
    }
  ]
}
