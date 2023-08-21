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
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/mapView/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/roadView',
        name: '日常养护2',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/roadView/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/fireSpread',
        name: '火灾蔓延',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/exportView/index.vue'),
        meta: { keepAlive: true },
      }
    ]
  }
  
];
