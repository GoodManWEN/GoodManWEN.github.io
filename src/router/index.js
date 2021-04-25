import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import HelloWorld from '../components/HelloWorld'
import Blank from '../components/Blank'

Vue.use(VueRouter)

// 由本路由跳转到本路由会报错，这里添加了一个拦截console输出的指令
const originalPush = VueRouter.prototype.push 
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {window.console.log(err)})
}

const routes = [
  {
    path: '/',
    name: "Index",
    component: HelloWorld,
    meta : {
      title:"MY TITLE"
    }
  },
  {
    path:"*",
    name: "404",
    component: Blank,
    meta : {
      title:"404 NOT FOUND"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  to;from;next;
  console.log('[router triggered] auth status:',store.state.authed)
  console.log('[router triggered] mode:',store.state.theme)
  if (!store.state.authed) {
    if (to.name == 'Index') {
      next()
    } else {
      next({name: 'Index'})
    }
  }
})

export default router
