<template>
  <div class="tw-absolute tw-bottom-0 tw-p-3 tw-w-full tw-select-none" style="min-width:600px;z-index:1001">
    <div class="tw-h-12 tw-w-fulltw-rounded-xl" style="backdrop-filter: blur(30px); box-shadow:0 4px 10px rgba(16,16,16,.3)">
      <div class="tw-h-full tw-w-full tw-rounded-xl tw-flex tw-items-center tw-justify-center" style="background-color:rgba(235,235,235,.42)">
        <div class=" tw-absolute tw-h-full  tw-flex tw-items-center tw-justify-center" style="left:0">
          <div class="tw-w-full tw-h-full  tw-hidden sm:tw-block">
            <div class=" tw-w-full tw-h-full tw-flex tw-items-center  tw-px-2">
              <Icon :srcc="'menu'" mode="large" @button_clicked="{}" :noamine="true" :tagcont="'Starter'"/>
              <Icon :srcc="'desktop'" mode="large" class=" tw-ml-3" @button_clicked="{}" :noamine="true" :tagcont="'Show Desktop'" @click.native="showdesktop_clicked"/>
              <Icon :srcc="'tasks'" mode="large" class=" tw-ml-3" @button_clicked="{}" :noamine="true" :tagcont="'Multitasking View'" @click.native="exit_full_screen"/>
              <div class="vl tw-mx-2"></div>
            </div>
          </div>
        </div>
        <div class="tw-flex-none tw-w-100 tw-h-full tw-hidden lg:tw-block">
          <div class=" tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
            <Icon :srcc="'explorer'" mode="large" class=" tw-ml-3" @button_clicked="explorer_clicked" :tagcont="'File Manager'" :cfocus="$store.state.current_focus_type==='explorer'" :fshow="has_explorer" v-if="has_explorer" @contextmenu.prevent.native="mr_clicked($event, 'explorer', has_explorer)"/>
            <Icon :srcc="'doc'" mode="large" class=" tw-ml-3" @button_clicked="text_clicked" :tagcont="'Text Editor'" :cfocus="$store.state.current_focus_type==='text'" :fshow="has_text" v-if="has_text" @contextmenu.prevent.native="mr_clicked($event, 'text', has_text)"/>
            <Icon :srcc="'browser'" mode="large"  class=" tw-ml-3" @button_clicked="browser_clicked" :tagcont="'Browser'" :cfocus="$store.state.current_focus_type==='browser'" :fshow="has_browser" @contextmenu.prevent.native="mr_clicked($event, 'browser', has_browser)"/>
            <Icon :srcc="'music'" mode="large"  class=" tw-ml-3" @button_clicked="music_clicked" :tagcont="'Music'" :cfocus="$store.state.current_focus_type==='music'" :fshow="has_music" @contextmenu.prevent.native="mr_clicked($event, 'music', has_music)"/>
            <Icon :srcc="'vscode'" mode="large"  class=" tw-ml-3" @button_clicked="vscode_clicked" :tagcont="'vscode'" :cfocus="$store.state.current_focus_type==='vscode'" :fshow="has_vscode" @contextmenu.prevent.native="mr_clicked($event, 'vscode', has_vscode)"/>
            <Icon :srcc="'settings'" mode="large"  class=" tw-ml-3" @button_clicked="settings_clicked" :tagcont="'Settings'" :cfocus="$store.state.current_focus_type==='settings'" :fshow="has_settings" @contextmenu.prevent.native="mr_clicked($event, 'settings', has_settings)"/>
            <Icon :srcc="'shell'" mode="large"  class=" tw-ml-3" @button_clicked="terminal_clicked" :tagcont="'Terminal'" :cfocus="$store.state.current_focus_type==='terminal'" :fshow="has_terminal" @contextmenu.prevent.native="mr_clicked($event, 'terminal', has_terminal)"/>
          </div>
        </div>
        <div class=" tw-absolute tw-h-full tw-flex tw-items-center tw-justify-center tw-flex-row-reverse tw-pr-2" style="right:0">
            <Icon  :mode="'small'" :iconn="'bell'" :smalltrue="false" @button_clicked="bell_clicked" :tagcont="display_article_num+' Messages'"/>
            <div class="tw-w-2"></div>
            <Icon :srcc="'recycle'" mode="large" :tagcont="'Recycle Bin'"/>
            <div class="tw-w-20 tw-h-full tw-flex tw-flex-col tw-justify-start tw-items-center tw-py-1 ">
              <div class="tw-flex-none tw-py-0 tw-my-0 tw-font-bold tw-text-xl">{{PrefixZero(date_hour,2)}}:{{PrefixZero(date_minute,2)}}</div>
              <div class=" tw-absolute tw-text-xs tw-font-bold" style="top:52%">{{date_year}}/{{date_month}}/{{date_date}}</div>
            </div>
            <Icon  :mode="'small'" :iconn="'power-standby'" :smalltrue="false" :tagcont="'Power'" @click.native="halt_clicked"/>
            <div class="tw-w-2"></div>
            <Icon  :mode="'small'" :iconn="'keyboard'" :smalltrue="false" :tagcont="'On-Screen Keyboard'" @click.native = "keyboard_clicked"/>
            <div class="vl tw-mx-2"></div>
            <Icon  :mode="'small'" :iconn="show_drawer?'chevron-right':'chevron-left'" style="z-index:20" @button_clicked="arrow_clicked" :tagcont="'Folder'"/>
            <div class="tw-w-2"></div>
            <Icon  :mode="'small'" :iconn="'battery-70'" class="hide_when_needed transform-drawer-1-normal" :highertag="true" :tagcont="'Battery'"/>
            <div class="tw-w-2"></div>
            <Icon  :mode="'small'" :iconn="'wifi-arrow-up-down'" class="hide_when_needed transform-drawer-2-normal" :highertag="true" :tagcont="'Network'"/>
            <div class="tw-w-2"></div>
            <Icon  :mode="'small'" :iconn="'volume-high'" class="hide_when_needed transform-drawer-3-normal" :highertag="true" :tagcont="'Volume'"/>
            <div class="vl tw-mx-2 hide_when_needed transform-drawer-4-normal"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from './Icon.vue'
export default {
  name: 'BottomBar',
  components: {
    Icon
  },
  data(){
    return {
      date_hour:0,
      date_minute:0,
      date_year:1970,
      date_month:1,
      date_date:1,
      date_weekday:0,
      show_drawer:true,
      has_text:false,
      has_explorer:false,
      has_music:false,
      has_browser:false,
      has_settings:false,
      has_terminal:false,
      has_vscode:false
    }
  },
  created(){
    this.refresh_time()
    window.setInterval(() => {
      this.refresh_time()
    }, 1000);
  },
  mounted(){
    if (this.fullWidth < 1124) {
      this.arrow_clicked()
    }
  },
  watch:{
    fullWidth(){
      this.show_drawer = false
      let r = document.getElementsByClassName('hide_when_needed')
      let count = 1
      for (let item of r) {
        item.classList.add('transform-drawer-'+count)
        count += 1
      }
    },
    global_window_list(){
      let status = {
        explorer:false,
        text:false,
        browser:false,
        music:false,
        settings:false,
        terminal:false,
        vscode:false,
      }
      let keys = Object.keys(status)
      for (let item of this.$store.state.window_list) {
        if (keys.indexOf(item.type) >= 0) {
          status[item.type] = true
        }
      }
      for (let key of keys) {
        this['has_'+key] = status[key]
      }
    },
  },
  computed:{
    fullWidth(){
      return this.$store.state.fullWidth
    },
    global_window_list(){
      return this.$store.state.window_list
    },
    display_article_num(){
      return this.$store.state.display_article_num
    },
  },
  methods:{
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    bell_clicked(){
      this.$store.commit('change_side_bar_status')
    },
    arrow_clicked(){
      if (this.show_drawer) {
        this.show_drawer = false
        let r = document.getElementsByClassName('hide_when_needed')
        let count = 1
        for (let item of r) {
          item.classList.add('transform-drawer-'+count)
          count += 1
        }
      } else {
        this.show_drawer = true
        let r = document.getElementsByClassName('hide_when_needed')
        let count = 1
        for (let item of r) {
          item.classList.remove('transform-drawer-'+count)
          count += 1
        }
      }
    },
    refresh_time(){
      let date = new Date();
      this.date_year = date.getFullYear();
      this.date_month = date.getMonth() + 1;
      this.date_date = date.getDate();
      this.date_weekday = date.getDay() - 1;
      this.date_hour = date.getHours();
      this.date_minute = date.getMinutes();
    },
    browser_clicked(){
      if (this.has_browser) {
        if (this.window_type_all_hide_or_at_the_top({'type':'browser'})) {
          this.$store.commit('switch_global_window_show_status', {'type':'browser'})
        }
      } else {
        this.$store.commit('open_new_window', {'type':'browser'})
      }
      this.$store.commit('refresh_window_focus', {'type':'browser'})
    },
    music_clicked(){
      if (this.has_music) {
        if (this.window_type_all_hide_or_at_the_top({'type':'music'})) {
          this.$store.commit('switch_global_window_show_status', {'type':'music'})
        }
      } else {
        this.$store.commit('open_new_window', {'type':'music'})
      }
      this.$store.commit('refresh_window_focus', {'type':'music'})
    },
    settings_clicked(){
      if (this.has_settings) {
        if (this.window_type_all_hide_or_at_the_top({'type':'settings'})) {
          this.$store.commit('switch_global_window_show_status', {'type':'settings'})
        }
      } else {
        this.$store.commit('open_new_window', {'type':'settings'})
      }
      this.$store.commit('refresh_window_focus', {'type':'settings'})
    },
    terminal_clicked() {
      if (this.has_terminal) {
        if (this.window_type_all_hide_or_at_the_top({'type':'terminal'})) {
          this.$store.commit('switch_global_window_show_status', {'type':'terminal'})
        }
      } else {
        this.$store.commit('open_new_window', {'type':'terminal'})
      }
      this.$store.commit('refresh_window_focus', {'type':'terminal'})
    },
    vscode_clicked(){
      if (this.has_vscode) {
        if (this.window_type_all_hide_or_at_the_top({'type':'vscode'})) {
          this.$store.commit('switch_global_window_show_status', {'type':'vscode'})
        }
      } else {
        this.$store.commit('open_new_window', {'type':'vscode'})
      }
      this.$store.commit('refresh_window_focus', {'type':'vscode'})
    },
    text_clicked() {
      if (this.window_type_all_hide_or_at_the_top({'type':'text'})) {
        this.$store.commit('switch_global_window_show_status', {'type':'text'})
      }
      this.$store.commit('refresh_window_focus', {'type':'text'})
    },
    explorer_clicked() {
      if (this.window_type_all_hide_or_at_the_top({'type':'explorer'})) {
        this.$store.commit('switch_global_window_show_status', {'type':'explorer'})
      }
      this.$store.commit('refresh_window_focus', {'type':'explorer'})
    },
    keyboard_clicked() {
      this.$store.commit('switch_keyboard_status')
    },
    halt_clicked() {
      document.body.style.cursor='progress'
      window.setTimeout(()=>{
        document.body.style.cursor='default'
        this.$router.push({
          name: 'LoginPage',
        })
      },800)
    },
    window_type_all_hide_or_at_the_top(payload){
      let max_index = 0;
      let max_type_name = '';
      let allHide = true;
      for (let item of this.$store.state.window_list) {
        if (item.zindex > max_index && !item.minimized) {
          max_type_name = item.type
          max_index = item.zindex
        }
        if (item.type === payload.type) {
          allHide &&= item.minimized;
        }
      }
      return max_type_name === payload.type || allHide
    },
    showdesktop_clicked(){
      this.$store.commit('switch_show_desktop')
    },
    exit_full_screen(){
      if (document.exitFullscreen) {
        // catch if it's not a programatical fullscreen
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },
    mr_clicked(event, target, mode){
      event.stopPropagation()
      this.$store.commit('show_context_menu_bottom_bar' , {'target':target, 'mode':mode})
    }
  }
}
</script>

<style scoped>
.vl {
  border-left: 2.5px solid rgba(55,55,55);
  height: 30px;
  left: 50%;
}

.transform-drawer-1-normal {
  transform: translateX(0);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-1 {
  transform: translateX(44px);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-2-normal {
  transform: translateX(0);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-2 {
  transform: translateX(88px);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-3-normal {
  transform: translateX(0);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-3 {
  transform: translateX(132px);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-4-normal {
  transform: translateX(0);
  transition: transform 0.2s linear 0s;
}

.transform-drawer-4 {
  transform: translateX(132px);
  transition: transform 0.2s linear 0s;
}

</style>