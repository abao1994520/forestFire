export default [
  {
    path: '/mapView',
    name: '日常养护1',
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
    path: '/exportView',
    name: '日常养护3',
    component: () => import(/* webpackChunkName: "maintain" */ '@/pages/exportView/index.vue'),
    meta: { keepAlive: true },
  }
];
