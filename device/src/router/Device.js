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
        title: '位置管理',
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
            title: '设备管理',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'menu.deviceList', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/deviceList'], r)
        }
        // {
        //   path: '/admin/device/manage/homeUserManage',
        //   meta: {
        //     title: '家庭用户管理',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '家庭用户管理', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/homeUserManage'], r)
        // },
        // {
        //   path: '/admin/device/manage/updateHomeUser/:id',
        //   meta: {
        //     title: '家庭用户编辑',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '家庭用户管理', path: '' },
        //       { title: '编辑家庭用户', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/updateHomeUser'], r)
        // },
        // {
        //   path: '/admin/device/manage/addHomeUser',
        //   meta: {
        //     title: '新增家庭用户',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '家庭用户管理', path: '' },
        //       { title: '新增家庭用户', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/updateHomeUser'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage',
        //   meta: {
        //     title: '访客管理',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '访客管理', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/vistorManage'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage/addpermanentVisitors',
        //   meta: {
        //     title: '新增永久访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增永久访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addPermanent'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage/addlimitVisitors',
        //   meta: {
        //     title: '新增限时访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增限时访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addLimitVisitors'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage/addtemporaryVistors',
        //   meta: {
        //     title: '新增临时访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增临时访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addTemporaryVistors'], r)
        // },
        // {
        //   path: '/admin/device/manage/deviceSetting',
        //   meta: {
        //     title: '设备设置',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '设备设置', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/deviceSetting'], r)
        // }
      ]
    },
    {
      path: '/admin/device/application',
      redirect: '/admin/device/application/deviceInbound',
      meta: {
        title: '设备入库',
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
            title: '设备入库',
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
        title: '设备列表',
        nav: 'menu.deviceList',
        icon: 'terminal-icon1',
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
            title: '设备列表',
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
            title: '设备设置',
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
    // {
    //   path: '/admin/device/deviceAssign',
    //   redirect: '/admin/device/deviceAssign/assignList/all',
    //   meta: {
    //     title: '设备分配',
    //     nav: '设备分配',
    //     icon: 'terminal-icon1',
    //     auth: true,
    //     authId: 10,
    //     menuCode: '201031',
    //     breadcrumb: [
    //       { title: '设备管理', path: '' },
    //       { title: '设备分配', path: '' }
    //     ]
    //   },
    //   component: r => require(['@/views/admin/terminal/application/AssignLayout'], r),
    //   children: [
    //     {
    //       path: '/admin/device/deviceAssign/assignList/all',
    //       name: 'all',
    //       meta: {
    //         title: '设备分配',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '设备管理', path: '' },
    //           { title: '设备分配', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/terminal/application/DeviceAssign'], r)
    //     },
    //     {
    //       path: '/admin/device/deviceAssign/assignList/notAssign',
    //       name: 'notAssign',
    //       meta: {
    //         title: '设备分配',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '设备管理', path: '' },
    //           { title: '设备分配', path: '' },
    //           { title: '未分配', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/terminal/application/DeviceAssign'], r)
    //     },
    //     {
    //       path: '/admin/device/deviceAssign/assignList/assigned',
    //       name: 'assigned',
    //       meta: {
    //         title: '设备分配',
    //         auth: true,
    //         breadcrumb: [
    //           { title: '设备管理', path: '' },
    //           { title: '设备分配', path: '' },
    //           { title: '已分配', path: '' }
    //         ]
    //       },
    //       component: r => require(['@/views/admin/terminal/application/DeviceAssign'], r)
    //     }
    //   ]
    // },
    {
      path: '/admin/device/manage',
      redirect: '/admin/device/manage/homeUserManage',
      meta: {
        title: '设备管理',
        nav: '设备管理',
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
            title: '家庭用户管理',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.homeUserManage', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/homeUserManage'], r)
        },
        // {
        //   path: '/admin/device/manage/updateHomeUser/:id',
        //   meta: {
        //     title: '家庭用户编辑',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '家庭用户管理', path: '' },
        //       { title: '编辑家庭用户', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/updateHomeUser'], r)
        // },
        // {
        //   path: '/admin/device/manage/addHomeUser',
        //   meta: {
        //     title: '新增家庭用户',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '家庭用户管理', path: '' },
        //       { title: '新增家庭用户', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/procurement/updateHomeUser'], r)
        // },
        {
          path: '/admin/device/manage/vistorManage/:id',
          meta: {
            title: '访客管理',
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
            title: '设备设置',
            auth: true,
            breadcrumb: [
              { title: 'common.deviceManage', path: '' },
              { title: 'device.diviceSetting', path: '' }
            ]
          },
          component: r => require(['@/views/admin/terminal/procurement/deviceSetting'], r)
        }
        // {
        //   path: '/admin/device/manage/vistorManage/addpermanentVisitors',
        //   meta: {
        //     title: '新增永久访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增永久访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addPermanent'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage/addlimitVisitors',
        //   meta: {
        //     title: '新增限时访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增限时访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addLimitVisitors'], r)
        // },
        // {
        //   path: '/admin/device/manage/vistorManage/addtemporaryVistors',
        //   meta: {
        //     title: '新增临时访客',
        //     auth: true,
        //     breadcrumb: [
        //       { title: '设备管理', path: '' },
        //       { title: '新增临时访客', path: '' }
        //     ]
        //   },
        //   component: r => require(['@/views/admin/terminal/add/addTemporaryVistors'], r)
        // },
      ]
    }
  ]
}
