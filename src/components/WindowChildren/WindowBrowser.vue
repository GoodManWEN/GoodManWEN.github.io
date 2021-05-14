<template>
  <Window :startpos_x="startpos_x" :startpos_y="startpos_y" :uuid="uuid" :zindex="zindex" :default_width="default_width" :minimized="minimized" @resize_start="show_blocker=true" @resize_end="show_blocker=false">
    
    <template v-slot:header>
      <div class=" tw-ml-4 tw-font-bold tw-tracking-wider tw-flex tw-items-center tw-select-none" style="pointer-events:none;"> 
        <img src="../../assets/images/icons/browser.png" alt="" style="pointer-events:auto;" class=" tw-w-7 tw-h-7">
        <div class=" tw-ml-4 tw-font-bold tw-tracking-wider " style="pointer-events:none;"> Google Chrome </div>
      </div>
    </template>
    <template v-slot:content>
      <div class=" tw-w-full  tw-h-full tw-rounded-b-2xl tw-overflow-hidden tw-flex tw-flex-col tw-items-center">
        <div class="tw-h-11 tw-border-t tw-border-gray-400 tw-flex tw-items-center" style="background-color:#fafafa;width:99%">
          <WindowBrowserButton :disabled="href_stack_pointer == (href_stack.length - 1)" :icon="'chevron-left'" class="tw-ml-3" @button_clicked="prev_clicked"/>
          <WindowBrowserButton :disabled="href_stack_pointer===0" :icon="'chevron-right'" class="tw-ml-3" @button_clicked="next_clicked"/>
          <WindowBrowserButton :disabled="false" :icon="'refresh'" class="tw-ml-3" @button_clicked="refresh_clicked"/>
          <div ref="llock" class="tw-absolute tw-w-8 tw-h-8  tw-flex tw-items-center tw-justify-center hover:tw-bg-mygray-b3 tw-rounded-lg" style="left: calc(158px + 0.72%)" @mouseleave="unshow_lock" @mouseenter="show_lock">
            <v-icon small>mdi-{{no_http?'alert-circle-outline':'lock'}}</v-icon>
            <div class="tw-absolute tw-py-1 tw-px-2 tw-border" :style="{'top':tipoffsetY + 'px','left':tipoffsetX  + 'px'}" style="background-color:#545868;color:#b2bbc6;white-space:nowrap" v-if="show_lock_tip">Show Website Details</div>
          </div>
          <input class="tw-flex-grow tw-ml-3 tw-h-9 focus:tw-bg-white tw-tracking-tight tw-px-10" style="outline-color:#4285f4;text-color:#939387" v-model="input_src" @keyup.enter="inputSubmit"/>
          <button class="tw-absolute tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-outline-none" style="right: calc(68px + 0.70%)">
            <v-icon small>mdi-star-outline</v-icon>
          </button>
          <WindowBrowserButton :disabled="false" :icon="'currency-eth'" class="tw-mx-4" :mode="1"/>
        </div>
        <div class=" tw-h-0 tw-border-b tw-border-gray-300" style="width:99%"></div>
        <iframe ref="iframe_main" :src="real_src" frameborder="0" class="tw-w-full tw-h-full" onload="mouse_style_none"></iframe>
        <div class="tw-w-full tw-h-full tw-absolute background-color" style="top:0" v-if="show_blocker">
          <span class="tw-hidden"> this div is to prevent iframe take control over mouse event while dragging window </span>
        </div>
      </div>
    </template>
  </Window>
</template>

<script>
import Window from '../WindowBasic/Window.vue'
import WindowBrowserButton from './WindowBrowserButton.vue'

export default {
  name: 'WindowBrowser',
  components: {
    Window,
    WindowBrowserButton,
  },
  data(){
    return {
      show_blocker:false,
      tipoffsetY:0,
      tipoffsetX:0,
      show_lock_tip:false,
      input_src:"https://www.google.com/webhp?igu=1",
      real_src:'https://www.google.com/webhp?igu=1',
      no_http:false,
      href_stack:['https://www.google.com/webhp?igu=1',],
      href_stack_pointer:0,
    }
  },
  props:{
    uuid:String,
    startpos_x:{
      default:60,
    },
    startpos_y:{
      default:60
    },
    zindex:{
      type:Number,
      default:999,
    },
    minimized:{
      type:Boolean,
      default:false,
    },
    default_width:{
      type:Number,
      default:1000
    }
  },
  created(){
  },
  mounted(){

  },
  watch:{
  },
  computed:{
  },
  methods:{
    show_lock(){
      let e = e || window.event || e.which;
      let downX = e.clientX;
      let downY = e.clientY;
      let ptop = this.getTop(this.$refs.llock)
      let pleft = this.getLeft(this.$refs.llock)
      let offsetX = downX - pleft
      let offsetY = downY - ptop
      this.tipoffsetX = offsetX
      this.tipoffsetY = offsetY
      this.show_lock_tip = true
    },
    unshow_lock(){
      this.show_lock_tip = false
    },
    getTop(e){
      let offset=e.offsetTop;
      if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
      return offset;
    },
    getLeft(e){
      let offset=e.offsetLeft;
      if(e.offsetParent!=null) offset+=this.getLeft(e.offsetParent);
      return offset;
    },
    inputSubmit(){
      let header_http = this.input_src.substr(0,7)
      let header_https = this.input_src.substr(0,8)
      let noheader = false
      if (header_http == 'http://') {
        header_http = true
        this.no_http = true
      } else if (header_https == 'https://') {
        header_https = true
      } else {
        noheader = true
      }
      let googlepat = /^((https|http|ftp|rtsp|mms)?:\/\/)?[w.]*google\.com(\/)*$/
      if (googlepat.test(this.input_src)) {
        this.input_src = 'https://www.google.com/webhp?igu=1'
        noheader = false
      }
      if (noheader) {
        this.real_src = 'https://' + this.input_src
        this.input_src = this.real_src
      } else {
        this.real_src = this.input_src
      }
      this.href_stack.push(this.real_src)
    },
    prev_clicked(){
      this.href_stack_pointer = Math.min(this.href_stack_pointer + 1, this.href_stack.length - 1)
      this.real_src = this.href_stack[this.href_stack.length - 1 - this.href_stack_pointer]
      this.input_src = this.real_src
      this.mouse_style()
    },
    next_clicked(){
      this.href_stack_pointer = Math.max(this.href_stack_pointer - 1,0)
      this.real_src = this.href_stack[this.href_stack.length - 1 - this.href_stack_pointer]
      this.input_src = this.real_src
      this.mouse_style()
    },
    mouse_style(){
      document.body.style.cursor='progress'
      window.setTimeout(()=>{
        document.body.style.cursor='default'
      },500)
    },
    mouse_style_none(){
      document.body.style.cursor='default'
    },
    refresh_clicked(){
      this.$refs.iframe_main.contentWindow.location.reload(true);
    },
  }
}
</script>

<style scoped>
.bg-b11 {
  background-color:#f1f3f4
}
</style>