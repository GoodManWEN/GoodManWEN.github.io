import Vue from 'vue'
import Vuex from 'vuex'
import {cget} from '../plugins/cookies'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authed:JSON.parse(cget('auth')||'false'),
    fullHeight:0,
    fullWidth:0,
    scrollHeight:0,
    scrollWidth:0,
    theme:'light',
  },
  mutations: {
    refresh_sizes(state){
      state.fullHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight
      state.fullWidth = document.documentElement.clientWidth || document.body.clientHeight || window.innerWidth
    },
    refresh_scroll(state){
      state.scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      state.scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth
    },
    get_auth_status(state){
      if (Vue.prototype.$cookies.get('auth') == 'true'){
        state.authed = true
      } else {
        state.authed = false
      }
    },
    set_auth_status(state , data){
      if (data == true) {
        Vue.prototype.$cookies.set('auth',"true",'10m')
        this.commit('get_login_status')
      }
    },
    set_darkmode(state) {
      state.theme='dark'
      Vue.prototype.$cookies.set('theme',state.theme,'720d')
    },
    set_lightmode(state) {
      state.theme='light'
      Vue.prototype.$cookies.set('theme',state.theme,'720d')
    },
  },
})

export default store