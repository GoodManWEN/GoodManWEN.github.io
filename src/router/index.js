import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import LoginPage from '../components/LoginPage/LoginPage'
import Desktop from '../components/Desktop/Desktop'
import Down from '../components/Down'

Vue.use(VueRouter)

const routes = [
  {
    path: '/terminated',
    name: "Down",
    component: Down,
    meta : {
      title:"No signal"
    }
  },
  {
    path: '/login',
    name: "LoginPage",
    component: LoginPage,
    meta : {
      title:"Deepin"
    }
  },
  {
    path: '/desktop/post/:postfilename',
    name: "DesktopWithPost",
    component: Desktop,
    meta : {
      title:"Welcom to WEN's blog"
    }
  },
  {
    path: '/desktop',
    name: "Desktop",
    component: Desktop,
    meta : {
      title:"Welcom to WEN's blog"
    }
  },
  {
    path:"*",
    redirect:'/login',
  },
]


const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  store.commit('show_interlude')
  next()
})

export default router
