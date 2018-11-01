const Config = require('webpack-chain');
const config = new Config();
export default {
  history: 'hash',
  publicPath: './',
  plugins: [
    ['umi-plugin-react', {
      antd: true
    }],
  ],
  routes: [{
    path: '/login',
    component: 'system/login'
  }, {
      path: '/404',
      component: '404'
    },  {
    path: '/',
    component: '../layout',
    routes: [
      {
        path: '/',
        exact: true,
        component: 'index',
      },
      {
        path: '/cpAdmainPlatform',
        routes: [
          { path: '/cpAdmainPlatform/cpCompany', component: 'cpAdmainPlatform/cpCompany' },
          { path: '/cpAdmainPlatform/cpList', component: 'cpAdmainPlatform/cpList' },
          { path: '/cpAdmainPlatform/everyDayCounts', component: 'cpAdmainPlatform/everyDayCounts' },
          { path: '/cpAdmainPlatform/everyMonthCounts', component: 'cpAdmainPlatform/everyMonthCounts' },
          { path: '/cpAdmainPlatform/setAdvertisement', component: 'cpAdmainPlatform/setAdvertisement' },
          { path: '/cpAdmainPlatform/setMonthly', component: 'cpAdmainPlatform/setMonthly' },
          { path: '/cpAdmainPlatform/setWorks', component: 'cpAdmainPlatform/setWorks' }
        ]
      },
      {
        path: '/system/',
        routes: [
          { path: '/system/password', component: 'system/password' },
          { path: '/system/account', component: 'system/account' },
          { path: '/system/group', component: 'system/group' },
          { path: '/system/manager', component: 'system/manager' },
          { path: '/system/menu', component: 'system/menu' },
        ]
      },
    ]
  }],
  singular: true,
  chainWebpack(config, { webpack }) {
  }
};