import Layout from '@/components/appLayout/index.vue';

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/fireDetails',
    children: [
      {
        path: '/fireDetails',
        name: '火点详情',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/fireDetailsView/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/test',
        name: '火点详情1',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/test/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/fireSpread',
        name: '火灾蔓延',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/mapView/index.vue'),
        meta: { keepAlive: true },
      }
    ]
  }
  
];
