export default {
  path: '/setup',
  redirect: '/setup/index',
  meta: {
    nav: '设置'
  },
  component: r => require(['views/setup/Layout'], r),
  children: [
    {
      path: '/setup/index',
      meta: {
        nav: '设置'
      },
      component: r => require(['views/setup/Index'], r)
    },

    {
      path: '/setup/sendCode',
      meta: {
        nav: '发送验证码'
      },
      component: r => require(['views/setup/sendCode'], r)
    },

    {
      path: '/setup/setPayPassword',
      meta: {
        nav: '设置支付密码'
      },
      component: r => require(['views/setup/setPayPassword'], r)
    },

    {
      path: '/setup/phone',
      meta: {
        nav: '手机号'
      },
      component: r => require(['views/setup/Phone'], r)
    },

    {
      path: '/setup/phone/update',
      meta: {
        nav: '更换手机号'
      },
      component: r => require(['views/setup/PhoneUpdate'], r)
    },

    {
      path: '/setup/password',
      meta: {
        nav: '密码设置'
      },
      component: r => require(['views/setup/Password'], r)
    },

    {
      path: '/setup/password/payment',
      meta: {
        nav: '重置支付密码'
      },
      component: r => require(['views/setup/PasswordPayment'], r)
    },

    {
      path: '/setup/password/login',
      meta: {
        nav: '重置登录密码'
      },
      component: r => require(['views/setup/PasswordLogin'], r)
    }
  ]
}
