import Layout from '@/components/appLayout/index.vue';

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/fireDetails',
    children: [
      {
        path: '/fireDetails',
        name: '火点态势',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/fireDetailsView/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/postDisasterAssess',
        name: '灾后评估',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/postDisasterAssess/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/fireSpread',
        name: '火灾蔓延',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/mapView/index.vue'),
        meta: { keepAlive: true },
      },
      {
        path: '/strategyView',
        name: '打火策略',
        component: () => import(/* webpackChunkName: "maintain" */ '@/pages/strategyView/index.vue'),
        meta: { keepAlive: true },
      },
      
    ]
  }
  
];
