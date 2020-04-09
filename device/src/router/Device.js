// 终端
export default {
  path: '/admin/device',
  redirect: '/admin/device/application',
  meta: {
    nav: 'menu.deviceManage',
    auth: true,
    authId: 2,
    menuCode: '101020'
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/device/manage',
      redirect: '/admin/device/manage/deviceList',
      meta: {
        title: 'Intercoms',
        nav: 'menu.addressManage',
        icon: 'terminal-icon2',
        auth: true,
        authId: 11,
        menuCode: '101022',
        breadcrumb: []
      },
      component: r => require(['@/views/admin/terminal/procurement/ProcurementLayout'], r),
      children: [
        {
          path: '/admin/device/manage/deviceList',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'menu.deviceList', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/deviceList'], r)
        }
      ]
    },
    {
      path: '/admin/device/application',
      redirect: '/admin/device/application/deviceInbound',
      meta: {
        title: 'Intercoms',
        nav: 'menu.deviceInbound',
        icon: 'terminal-icon1',
        auth: true,
        authId: 10,
        menuCode: '101021',
        breadcrumb: [
          { title: 'common.deviceManage', path: '' },
          { title: 'menu.deviceInbound', path: '' }
        ]
      },
      component: r => require(['@/views/admin/terminal/application/ApplicationLayout'], r),
      children: [
        {
          path: '/admin/device/application/deviceInbound',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'menu.deviceInbound', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/application/DeviceInbound'], r)
        }
      ]
    },
    {
      path: '/admin/device/deviceList',
      redirect: '/admin/device/deviceList/all',
      meta: {
        title: 'Intercoms',
        nav: 'menu.deviceList',
        icon: 'seting-icon2',
        auth: true,
        authId: 10,
        menuCode: '101023',
        breadcrumb: [
          { title: 'common.deviceManage', path: '' },
          { title: 'menu.deviceList', path: '' }
        ]
      },
      component: r => require(['@/views/admin/device/DeviceListLayout'], r),
      children: [
        {
          path: '/admin/device/deviceList/all',
          name: 'all',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'menu.deviceList', path: '' }
            ]
          },
          component: r => require(['@/views/admin/device/DeviceList'], r)
        },
        {
          path: '/admin/device/deviceList/deviceSetting/:id',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.diviceSetting', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/deviceSetting'], r)
        }
      ]
    },
    {
      path: '/admin/device/manage',
      redirect: '/admin/device/manage/homeUserManage',
      meta: {
        title: 'Intercoms',
        nav: 'Intercoms',
        icon: 'terminal-icon2',
        auth: true,
        authId: 11,
        menuCode: '201033',
        breadcrumb: []
      },
      component: r => require(['@/views/admin/terminal/procurement/DeviceManageLayout'], r),
      children: [
        {
          path: '/admin/device/manage/homeUserManage/:id',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.homeUserManage', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/homeUserManage'], r)
        },
        {
          path: '/admin/device/manage/vistorManage/:id',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.visitorManage', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/vistorManage'], r)
        },
        {
          path: '/admin/device/manage/deviceSetting/:id',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.diviceSetting', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/deviceSetting'], r)
        }
      ]
    },
    {
      path: '/admin/device/defaultSettings',
      redirect: '/admin/device/defaultSettings/index',
      meta: {
        title: 'Intercoms',
        nav: 'common.defaultSettings',
        icon: 'seting-icon1',
        auth: true,
        authId: 11,
        menuCode: '101024',
        breadcrumb: []
      },
      component: r => require(['@/views/admin/terminal/procurement/DefaultSettingsLayout'], r),
      children: [
        {
          path: '/admin/device/defaultSettings/index',
          meta: {
            title: 'Intercoms',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'common.defaultSettings', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/defaultSettings'], r)
        }
      ]
    }
  ]
}
