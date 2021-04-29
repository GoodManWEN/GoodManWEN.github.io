import Vue from 'vue'
import Vuex from 'vuex'
import {cget} from '../plugins/cookies'
import {get_uuid} from '../plugins/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    authed:JSON.parse(cget('auth')||'false'),
    fullHeight:0,
    fullWidth:0,
    scrollHeight:0,
    scrollWidth:0,
    theme:'light',
    show_sidebar:true,
    clean_messages:false,
    n_spx:60,
    n_spy:60,
    spx_step:40,
    spy_step:40,
    window_list:[
    ],
    current_focus:"",
    current_focus_type:"",
    desktop_keyboard_show:false,
    filemap:[],
    show_loading_page:true,
    start_load_time:0,
    context_menu_show:false,
    context_menu_x:0,
    context_menu_y:0,
    context_menu_bottom_bar_display_mode:false,
    context_menu_bottom_bar_show_target:'terminal',
    display_article_num:0,
  },
  mutations: {
    open_new_window(state, payload){
      let new_uuid = get_uuid()
      let obj = {
        uuid: new_uuid,
        spx:state.n_spx,
        spy:state.n_spy,
        zindex: 999,
        minimized: false,
      }
      if (payload.type === 'explorer') {
        obj.type = 'explorer'
        obj.openpath = payload.openpath
      } else if (payload.type === 'text') {
        obj.type='text'
        obj.filesrc=payload.filesrc
        obj.filename=payload.filename
        obj.size=payload.size
      } else if (payload.type === 'browser') {
        obj.type='browser'
        obj.default_width= Math.min(state.fullWidth * 0.8 , 1580)
      } else if (payload.type === 'music') {
        obj.type="music"
        obj.default_width=400
        obj.default_width=400
        obj.fixedsize=true
      } else if (payload.type === 'settings') {
        obj.type="settings"
      } else if (payload.type === 'terminal') {
        obj.type="terminal"
      } else if (payload.type === 'vscode') {
        obj.type="vscode"
      }
      state.window_list.push(obj)
      this.commit('refresh_window_focus', {uuid:new_uuid})

      // refresh initialize position
      let init_width = Math.min(state.fullWidth * 0.6 , 1000);
      let init_height = 600;
      let padding_y = 100
      if ((state.fullHeight - state.n_spy - padding_y) < init_height) {
        state.n_spy = (state.n_spy + state.spy_step + init_height + padding_y) % state.fullHeight
      } else {
        state.n_spy = state.n_spy + state.spy_step
      }
      if ((state.fullWidth - state.n_spx) < init_width) {
        state.n_spx = (state.n_spx + state.spx_step + init_width) % state.fullWidth 
      } else {
        state.n_spx = state.n_spx + state.spx_step
      }
    },
    close_window_with_uuid(state, payload){
      for (let i = 0;i < state.window_list.length;i++) {
        if (state.window_list[i].uuid === payload.uuid) {
          state.window_list.splice(i,1)
          break
        }
      }
    },
    minimize_window_with_uuid(state,payload){
      for (let window of state.window_list) {
        if (window.uuid === payload.uuid) {
          window.minimized = true
          break
        }
      }
    },
    refresh_window_focus(state, payload) {
      let target_uuid = ""
      if (payload.type!=undefined) {
        for (let window of state.window_list) {
          if (window.type === payload.type) {
            target_uuid = window.uuid
          }
        }
      } else {
        target_uuid = payload.uuid
      }
      state.current_focus = target_uuid
      let tmp = []
      let count = 0
      let finded = false
      for (let window of state.window_list) {
        if (window.uuid === target_uuid) {
          state.current_focus_type = window.type
          window.focus = true 
          tmp.push({id:count, zindex:1000})
          finded = true
        } else {
          tmp.push({id:count, zindex:window.zindex})
        }
        count += 1
      }
      if (!finded) {
        state.current_focus_type = ""
        return
      }
      let sortFunc = (a,b) => {
        if (a.zindex===b.zindex) {
          return 0
        } else if (a.zindex > b.zindex) {
          return -1
        } else {
          return 1
        }
      }
      tmp.sort(sortFunc)
      count = 999
      for (let t of tmp) {
        state.window_list[t.id].zindex = count 
        count -= 1 
      }
    },
    refresh_sizes(state){
      state.fullHeight = document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight
      state.fullWidth = document.documentElement.clientWidth || document.body.clientHeight || window.innerWidth
      if (state.n_spx > state.fullWidth) {
        state.n_spx = Math.max(state.fullWidth - 600,0)
      }
      if (state.n_spy > state.fullHeight) {
        state.n_spy = Math.max(state.fullHeight - 600,0)
      }
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
    change_side_bar_status(state){
      state.show_sidebar = !state.show_sidebar
    },
    close_side_bar(state){
      state.show_sidebar = false
    },
    clean_all_messages(state){
      if (state.clean_messages === false) {
        state.clean_messages = true
        window.setTimeout(()=>{
          state.clean_messages = false 
        },100)
      }
      
    },
    switch_keyboard_status(state) {
      state.desktop_keyboard_show = !state.desktop_keyboard_show
    },
    commit_filemap(state, data) {
      state.filemap = data
    },
    show_interlude(state){
      state.start_load_time = (new Date()).getTime()
      state.show_loading_page = true
    },
    hide_interlude(state){
      state.show_loading_page = false
    },
    switch_global_window_show_status(state, payload) {
      let target_type = payload.type 
      let tmp_list = []
      let count = 0
      let all_minimized = true
      for (let window of state.window_list) {
        if (window.type === target_type) {
          tmp_list.push(count)
          if (window.minimized === false) {
            all_minimized = false
          }
        }
        count += 1
      }
      if (all_minimized) {
        for (let index of tmp_list) {
          state.window_list[index].minimized = false
        }
      } else {
        for (let index of tmp_list) {
          state.window_list[index].minimized = true
        }
      }
    },
    close_global_window_same_type(state, payload) {
      let target_type = payload.type 
      let i = 0
      while (i < state.window_list.length) {
        if (state.window_list[i].type === target_type) {
          state.window_list.splice(i,1)
        } else {
          i += 1
        }
      }
    },
    show_context_menu(state){
      this.commit('refresh_window_focus', {uuid:"ContextMenu"})
      let e = e || window.event || e.which;
      state.context_menu_x = e.clientX;
      state.context_menu_y = e.clientY;
      state.context_menu_show=true
    },
    show_context_menu_bottom_bar(state, payload){
      this.commit('refresh_window_focus', {uuid:"ContextMenuBottomBar"})
      let e = e || window.event || e.which;
      state.context_menu_x = e.clientX;
      state.context_menu_y = e.clientY;
      state.context_menu_show=true
      state.context_menu_bottom_bar_display_mode = payload.mode
      state.context_menu_bottom_bar_show_target = payload.target
    },
    hide_context_menu(state){
      this.commit('refresh_window_focus', {uuid:""})
      state.context_menu_show=false
    },
    switch_show_desktop(state){
      if (state.window_list.length === 0) {
        return 
      }
      let all_minimized = true
      for (let window of state.window_list) {
        if (window.minimized === true) {
          all_minimized = false
          break
        }
      }
      let result = false
      if (all_minimized) {
        result = true
      } else {
        result = false
        this.commit('refresh_window_focus', {uuid:""})
      }
      for (let window of state.window_list) {
        window.minimized = result
      }
    },
    display_article_num_changed(state, num) {
      state.display_article_num = num
    }
  },
})

export default store
