<template>
  <div class=" tw-antialiased tw-w-screen tw-h-screen tw-overflow-hidden tw-flex tw-justify-center tw-items-center" style="min-height:600px;min-width:800px" >
    <div class="tw-w-full tw-h-full tw-relative"  >
      <div ref="background" class="tw-relative tw-pb-9/16 tw-h-full tw-select-none">
        <img src="../../assets/images/desktop_1.jpg" alt="" class="tw-absolute tw-h-full tw-object-cover" @load="bgloaded"/>
      </div>
    </div>
    <div ref="frontground" class="tw-absolute tw-w-full tw-h-full tw-z-10 tw-overflow-hidden" style="top:0;left:0;pointer-events:none">
      
      <WindowMusic v-if="false"/>
      <div v-for="item in window_list" :key="item.uuid"> 
        <WindowFolder v-if="item.type==='explorer'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :filemap="map" :openpath="item.openpath" :zindex="item.zindex" :minimized="item.minimized"/>
        <WindowText v-if="item.type==='text'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :filesrc="item.filesrc" :filename="item.filename" :size="item.size" :zindex="item.zindex" :minimized="item.minimized"/>
        <WindowBrowser v-if="item.type==='browser'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :zindex="item.zindex" :default_width="item.default_width" :minimized="item.minimized"/>
        <WindowVSCode v-if="item.type==='vscode'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :zindex="item.zindex" :minimized="item.minimized"/>
        <WindowMusic v-if="item.type==='music'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :zindex="item.zindex" :default_width="item.default_width" :default_height="item.default_height" :fixedsize="item.fixedsize" :minimized="item.minimized"/>
        <WindowSetting v-if="item.type==='settings'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :zindex="item.zindex" :minimized="item.minimized"/>
        <WindowTerminal v-if="item.type==='terminal'" :uuid='item.uuid' :startpos_x="item.spx" :startpos_y="item.spy" :zindex="item.zindex" :minimized="item.minimized"/>
      </div>
    </div>
    <div ref="realbackground" class="tw-absolute tw-w-full tw-h-full realbackground" style="top:0;left:0" @contextmenu.prevent="bg_mr_clicked">
      <div class="tw-absolute tw-w-full " @click="background_clicked" style="pointer-events:auto;height: calc(100% - 100px)">
        <div ref="keyboard_div" class="tw-absolute " style="z-index:1001;width:600px;height:200px;top:0px;left:0px" v-if="desktop_keyboard_show">
          <KeyBoardMoveIcon @mousedown.native="keyboard_move_down"/>
          <KeyBoard  :mode="'desktop'" @vkey_pressed="vkey_pressed" />
        </div>
        <!-- <div v-for="item in window_list" :key="item.uuid"> {{item}} </div> -->
        <ContextMenu v-if="context_menu_show&&($store.state.current_focus==='ContextMenu')"/>
        <ContextMenuBottomBar v-if="context_menu_show&&($store.state.current_focus==='ContextMenuBottomBar')" :mode="$store.state.context_menu_bottom_bar_display_mode" :target="$store.state.context_menu_bottom_bar_show_target"/>
      </div>
      <div class="tw-absolute tw-w-1" style="height: calc(100% - 20px)">
        <DesktopFileArray :filemap="map"/>
      </div>
      <BottomBar v-if="true"/>
      <SideBar/>
    </div>
  </div>
</template>

<script>
import BottomBar from './BottomBar.vue'
import DesktopFileArray from './DesktopFileArray.vue'
import SideBar from './SideBar.vue'
import WindowFolder from '../WindowChildren/WindowFolder.vue'
import WindowMusic from '../WindowChildren/WindowMusic.vue'
import WindowVSCode from '../WindowChildren/WindowVSCode.vue'
import WindowText from '../WindowChildren/WindowText.vue'
import WindowTerminal from '../WindowChildren/WindowTerminal.vue'
import WindowBrowser from '../WindowChildren/WindowBrowser.vue'
import WindowSetting from '../WindowChildren/WindowSetting.vue'
import KeyBoard from '../Keyboard/KeyBoard.vue'
import KeyBoardMoveIcon from '../Keyboard/KeyBoardMoveIcon.vue'
import ContextMenu from '../ContextMenu/ContextMenu.vue'
import ContextMenuBottomBar from '../ContextMenu/ContextMenuBottomBar.vue'

export default {
  name: 'Desktop',
  components: {
    BottomBar,
    SideBar,
    WindowText,
    WindowMusic,
    DesktopFileArray,
    WindowFolder,
    WindowVSCode,
    WindowBrowser,
    WindowSetting,
    KeyBoard,
    KeyBoardMoveIcon,
    WindowTerminal,
    ContextMenu,
    ContextMenuBottomBar
  },
  data(){
    return {
      map:[],
    }
  },
  created(){
    this.$axios.raw('map.json')
    .then((res) => {
      this.map_add_uuid(res.data)
      this.map = res.data
      this.$store.commit('commit_filemap', res.data)
      this.deal_with_postfilename()
    })
    .catch((err) => {
      console.log("error:", err)
    })
  },
  mounted(){
  },
  watch:{
    desktop_keyboard_show(val) {
      if (val) {
        this.$nextTick(()=>{
          this.$refs.keyboard_div.style.left = ((this.$store.state.fullWidth /2) -300) + 'px';
          this.$refs.keyboard_div.style.top = ((this.$store.state.fullHeight - 200) * 0.8) + 'px';
        })
      }
    }
  },
  computed:{
    window_list(){
      return this.$store.state.window_list
    },
    desktop_keyboard_show(){
      return this.$store.state.desktop_keyboard_show
    },
    context_menu_show(){
      return this.$store.state.context_menu_show
    },
  },
  methods:{
    background_clicked(){
      this.$store.commit('close_side_bar')
      this.$store.commit('refresh_window_focus', {uuid:""})
    },
    map_add_uuid(pointer){
      for (let item of pointer) {
        item.fileuuid = this.$utils.get_uuid()
        if (item.size < 0) {
          this.map_add_uuid(item.children)
        }
      }
    },
    vkey_pressed(key, upperscale){
      console.log(key , upperscale)
    },
    keyboard_move_down(){
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downY = e.clientY;
      let downX = e.clientX;
      let orn_top = this.$refs.keyboard_div.style.top;
      orn_top = parseFloat(orn_top.substr(0,orn_top.length-2))
      let orn_left = this.$refs.keyboard_div.style.left;
      orn_left = parseFloat(orn_left.substr(0,orn_left.length-2))
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveY = e.clientY;
        let moveX = e.clientX;
        let offsetY = moveY-downY
        let offsetX = moveX-downX
        this.$refs.keyboard_div.style.top = (orn_top + offsetY ) + 'px';
        this.$refs.keyboard_div.style.left = (orn_left + offsetX ) + 'px';
      }
      let mouseUpHandler = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onmousedown = orn_mousedown;
      }
      document.onmousemove = mouseMoveHandler;
      document.onmouseup = mouseUpHandler;
      document.onmousedown = ()=>{};
    },
    bgloaded(){
      let ctime = (new Date()).getTime()
      let time_diff = Math.max(ctime - this.$store.state.start_load_time,0)
      if ( isNaN(time_diff) || time_diff === undefined || time_diff === null) {
        time_diff = 0
      }
      let wait_time = Math.max(2500 - time_diff,0)
      window.setTimeout(()=>{
        this.$store.commit('hide_interlude')
      }, wait_time)
    },
    bg_mr_clicked(){
      this.$store.commit('show_context_menu')
    },
    deal_with_postfilename(){
      let target = this.$route.params.postfilename
      if (target === undefined) {
        return 
      }
      // else 
      let digin = (dir) => {
        for (let item of dir) {
          if (item.children === undefined) {
            if (item.name === target) {
              return item
            }
          } else {
            let r = digin(item.children)
            if (r != null) {
              return r
            }
          }
        }
        return null
      }
      let res = digin(this.map)
      if (res != null) {
        this.$store.commit('open_new_window', {
          type:'text',
          filesrc: res.path,
          filename: res.name,
          size: res.size,
        })
      } else {
        this.$store.commit('open_new_window', {
          type:'text',
          filesrc: '',
          filename: '404 not found',
          size: 0,
        })
      }
    }
  }, 
}
</script>

<style scoped>

</style>
