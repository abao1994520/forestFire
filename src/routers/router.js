import { createRouter, createWebHistory } from 'vue-router'
import PageRouter from './page';

// import routes from '~pages'

// console.log('routes', routes);
let routes = [
  ...PageRouter
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

router.beforeEach(async (to) => {
  proxy.$loading.start();
  //不需要验证登录的
  if (to.path == '/404' || to.path == '/login' || to.path == '/mapView') {
    return true;
  }

  //没有匹配上的
  if (to.matched.length == 0) {
    return '/mapView';
  }

  return true;
});

router.afterEach(() => {
  proxy.$loading.finish();
})

export default router