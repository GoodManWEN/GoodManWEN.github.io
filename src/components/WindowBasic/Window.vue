<template>
  <div ref="window_mainbody" class="tw-absolute animate__animated animate__faster" :class="{'animate__zoomOut':closed,'animate__zoomOutDown':minimized,'animate__zoomIn':!minimized}" style="min-width:680px;min-height:600px;height:600px; width: 1000px;pointer-events:auto;" :style="{'top':default_top+'px','left':default_left+'px','z-index':zindex}" @click="window_clicked" @contextmenu.prevent="mr_clicked($event)">
    <div class="tw-flex tw-justify-center tw-items-center tw-flex-nowrap tw-w-full tw-h-full tw-border tw-border-gray-500 " :style="{'box-shadow':global_focus===uuid?'0 0px 30px rgba(16,16,16,.6)':'0 0px 15px rgba(16,16,16,.3)','background-color':blacktheme?'#111111':'#f8f8f8'}" :class="{'tw-rounded-2xl':!full_windowed}">
      <WindowSider :mode="1" v-if="false"/>
      <div class="tw-flex-grow tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap tw-h-full" >
        <WindowSider :mode="0" v-if="false"/>
        <div class="tw-w-full tw-h-12  tw-select-none" :style="{'background-color':blacktheme?'#282828':'#fcfcfc'}" :class="{'tw-rounded-t-xl':!full_windowed}">
          <div class="tw-w-full tw-h-24 tw-absolute tw-overflow-hidden " style="left:-0px;pointer-events:none;opacity:.5" :class="{'tw-rounded-xl':!full_windowed}">
            <div class="tw-w-full tw-h-12 tw-absolute" style="pointer-events:none;" :style="{'box-shadow':blacktheme?'0 0px 24px rgba(33,33,33,.8)':'0 0px 24px rgba(212,212,212,.8)'}"></div>
          </div>
          <WindowHeaderCursor @mousedown.native="move_clicked"/>
          <div class="tw-w-full tw-h-12 cursor-move tw-absolute" v-if="show_cursor_move" :class="{'tw-rounded-t-xl':!full_windowed}"></div>
          <div class="tw-w-full tw-h-12 tw-absolute tw-overflow-hidden" style="pointer-events:none;" :class="{'tw-rounded-t-xl':!full_windowed}">
            <div class="tw-flex tw-flex-row-reverse tw-items-center tw-overflow-hidden tw-w-full tw-h-full red-200" :class="{'tw-rounded-t-xl':!full_windowed}">
              <div class="tw-flex-none tw-h-full tw-w-40  tw-flex-row-reverse tw-flex tw-overflow-hidden" style="padding-right:2px;pointer-events:auto;" :class="{'tw-rounded-t-3xl':!full_windowed}" @click="refocus">
                <WindowHeaderButton :bname="blacktheme?'d2':'b2'" :blacktheme="blacktheme" @button_clicked="close_clicked"/>
                <WindowHeaderButton :bname="blacktheme?'d1':'b1'" :blacktheme="blacktheme" @button_clicked="fullwindow_clicked"/>
                <WindowHeaderButton :bname="blacktheme?'d3':'b3'" :blacktheme="blacktheme" @button_clicked="minimizewindow_clicked"/>
              </div>
              <div ref="user_header_content" class="tw-flex-grow">
                <slot name="header"></slot>
              </div>
            </div>
          </div>
          <div ref="header_content" class="tw-w-full tw-h-full">
          </div>
        </div>
        <div class="tw-flex-grow tw-w-full tw-flex tw-justify-center tw-items-center">
          <div ref="user_content" class="tw-flex-none tw-w-full tw-h-full">
            <slot name="content"></slot>
          </div>
        </div>
        <div class="tw-w-full tw-flex-none tw-select-none" style="height:0">
          <div class="tw-absolute tw-w-full tw-flex tw-justify-center tw-items-center tw-flex-nowrap" style="height:3px;bottom:-3px">
            <WindowSider :mode="0" @mousedown.native="bottom_resize" v-if="(!full_windowed)&&(!fixedsize)"/>
          </div>
        </div>
      </div>
      <div class="tw-h-full tw-flex-none tw-select-none" style="width:0">
        <div class="tw-absolute tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center tw-flex-nowrap" style="right:-3px;width:3px">
          <div class="tw-w-0.5 tw-h-0.5"></div>
          <WindowSider :mode="1" @mousedown.native="right_resize" v-if="(!full_windowed)&&(!fixedsize)"/>
          <WindowSider :mode="2" @mousedown.native="bottom_right_resize" v-if="(!full_windowed)&&(!fixedsize)"/>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import WindowHeaderCursor from './WindowHeaderCursor.vue';
import WindowHeaderButton from './WindowHeaderButton.vue';
import WindowSider from './WindowSider.vue';
export default {
  name: 'Window',
  components: {
    WindowSider,
    WindowHeaderCursor,
    WindowHeaderButton
  },
  data(){
    return {
      show_cursor_move:false,
      closed:false,
      // minimized:false,
      full_windowed: false,
      backup_width:"800px",
      backup_height:"600px",
      backup_top:"0px",
      backup_left:"0px",
      default_top:60,
      default_left:60,
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
      default:-1
    },
    default_height:{
      type:Number,
      default:-1
    },
    fixedsize:{
      type:Boolean,
      default:false,
    },
    blacktheme:{
      type:Boolean,
      default:false,
    }
  },
  created(){
  },
  mounted(){
    if (this.default_width < 0) {
      this.$refs.window_mainbody.style.width = Math.max(Math.min(1000,0.6 * this.fullWidth),680) + 'px'
      this.$emit("width_changed" ,Math.max(Math.min(1000,0.6 * this.fullWidth),680))
    } else {
      this.$refs.window_mainbody.style.width = this.default_width + 'px'
      this.$emit("width_changed" ,this.default_width)
    }
    this.$emit("height_changed" ,600) 
    this.default_top = this.startpos_x
    this.default_left = this.startpos_y
  },
  watch:{
  },
  computed:{
    fullHeight(){
      return this.$store.state.fullHeight
    },
    fullWidth(){
      return this.$store.state.fullWidth
    },
    global_focus(){
      return this.$store.state.current_focus
    },
  },
  methods:{
    getOffset(offset,min,max){
      if (offset < min) {
        return min;
      } else if(offset > max){
        return max;
      } 
      return offset;
    },
    bottom_resize(){
      if (this.full_windowed  || this.fixedsize) {
        return ;
      }
      this.$emit("resize_start")
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downY = e.clientY;
      let min = this.$refs.window_mainbody.style.top;
      min = parseFloat(min.substr(0,min.length-2))
      min = min + 600 - downY;
      let max = this.fullHeight-downY;
      let orn_height = this.$refs.window_mainbody.style.height
      orn_height = parseFloat(orn_height.substr(0,orn_height.length-2))
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveY = e.clientY;
        let offsetY = this.getOffset(moveY-downY,min,max);
        this.$refs.window_mainbody.style.height = (offsetY + orn_height) + 'px';
        this.$emit("height_changed" ,offsetY + orn_height) 
      }
      let mouseUpHandler = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onmousedown = orn_mousedown;
        this.$emit("resize_end")
      }
      document.onmousemove = mouseMoveHandler;
      document.onmouseup = mouseUpHandler;
      document.onmousedown = ()=>{};
    },
    right_resize(){
      if (this.full_windowed  || this.fixedsize) {
        return ;
      }
      this.$emit("resize_start")
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downX = e.clientX;
      let min = this.$refs.window_mainbody.style.left;
      min = parseFloat(min.substr(0,min.length-2))
      min = min + 680 - downX;
      let max = this.fullWidth-downX;
      let orn_width = this.$refs.window_mainbody.style.width
      orn_width = parseFloat(orn_width.substr(0,orn_width.length-2))
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let offsetX = this.getOffset(moveX-downX,min,max);
        this.$refs.window_mainbody.style.width = (offsetX + orn_width) + 'px';
        this.$emit("width_changed" ,offsetX + orn_width) 
      }
      let mouseUpHandler = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onmousedown = orn_mousedown;
        this.$emit("resize_end")
      }
      document.onmousemove = mouseMoveHandler;
      document.onmouseup = mouseUpHandler;
      document.onmousedown = ()=>{};
    },
    bottom_right_resize(){
      if (this.full_windowed || this.fixedsize) {
        return ;
      }
      this.$emit("resize_start")
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downY = e.clientY;
      let downX = e.clientX;
      let minX = this.$refs.window_mainbody.style.left;
      minX = parseFloat(minX.substr(0,minX.length-2))
      minX = minX + 680 - downX;
      let minY = this.$refs.window_mainbody.style.top;
      minY = parseFloat(minY.substr(0,minY.length-2))
      minY = minY + 600 - downY;
      let maxX = this.fullWidth-downX;
      let maxY = this.fullHeight-downY;
      let orn_width = this.$refs.window_mainbody.style.width
      orn_width = parseFloat(orn_width.substr(0,orn_width.length-2))
      let orn_height = this.$refs.window_mainbody.style.height
      orn_height = parseFloat(orn_height.substr(0,orn_height.length-2))
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let moveY = e.clientY;
        let offsetX = this.getOffset(moveX-downX,minX,maxX);
        let offsetY = this.getOffset(moveY-downY,minY,maxY);
        this.$refs.window_mainbody.style.width = (offsetX + orn_width) + 'px';
        this.$refs.window_mainbody.style.height = (offsetY + orn_height) + 'px';
        this.$emit("height_changed" ,offsetY + orn_height)
        this.$emit("width_changed" ,offsetX + orn_width)
      }
      let mouseUpHandler = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        document.onmousedown = orn_mousedown;
        this.$emit("resize_end")
      }
      document.onmousemove = mouseMoveHandler;
      document.onmouseup = mouseUpHandler;
      document.onmousedown = ()=>{};
    },
    move_clicked(){
      this.$store.commit('close_side_bar')
      this.$emit("resize_start")
      this.refocus()
      if (this.full_windowed) {
        this.$emit("resize_end")
        return ;
      }
      let orn_mousedown = document.onmousedown;
      this.show_cursor_move = true;
      let e = e || window.event || e.which;
      let downY = e.clientY;
      let downX = e.clientX;
      let minX = -e.clientX;
      let minY = -e.clientY;
      let maxX = this.fullWidth;
      let maxY = this.fullHeight;
      let ornX = this.$refs.window_mainbody.style.left;
      ornX = parseFloat(ornX.substr(0,ornX.length-2))
      let ornY = this.$refs.window_mainbody.style.top;
      ornY = parseFloat(ornY.substr(0,ornY.length-2))
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let moveY = e.clientY;
        let offsetX = this.getOffset(moveX-downX,minX,maxX);
        let offsetY = this.getOffset(moveY-downY,minY,maxY);
        this.$refs.window_mainbody.style.left = offsetX + ornX + 'px';
        this.$refs.window_mainbody.style.top = offsetY + ornY + 'px';
      }
      let mouseUpHandler = () => {
        this.show_cursor_move = false;
        document.onmousemove = null;
        document.onmouseup = null;
        document.onmousedown = orn_mousedown;
        this.$emit("resize_end")
      }
      document.onmousemove = mouseMoveHandler;
      document.onmouseup = mouseUpHandler;
      document.onmousedown = ()=>{};
    },
    close_clicked(){
      this.closed = true
      window.setTimeout(()=>{
        // let parentNode = this.$refs.window_mainbody.parentNode
        // parentNode.removeChild(this.$refs.window_mainbody)
        this.$store.commit('close_window_with_uuid',{uuid:this.uuid,})
      },400)
    },
    fullwindow_clicked(){
      if (!this.full_windowed) {
        this.full_windowed = true
        this.backup_width = this.$refs.window_mainbody.style.width
        this.backup_height = this.$refs.window_mainbody.style.height
        this.backup_left = this.$refs.window_mainbody.style.left
        this.backup_top = this.$refs.window_mainbody.style.top
        this.$refs.window_mainbody.style.width = this.fullWidth + 'px';
        this.$refs.window_mainbody.style.height = (this.fullHeight - 75) + 'px'
        this.$refs.window_mainbody.style.top = 0 + 'px'
        this.$refs.window_mainbody.style.left = 0 + 'px'
        this.$emit("height_changed" ,this.fullHeight - 75)
        this.$emit("width_changed" ,this.fullWidth)
      } else {
        this.full_windowed = false
        this.$refs.window_mainbody.style.width = this.backup_width;
        this.$refs.window_mainbody.style.height = this.backup_height;
        this.$refs.window_mainbody.style.top = this.backup_top;
        this.$refs.window_mainbody.style.left = this.backup_left;
        let targ_height = parseFloat(this.backup_height.substr(0,this.backup_height.length-2))
        let targ_width = parseFloat(this.backup_width.substr(0,this.backup_width.length-2))
        this.$emit("height_changed" ,targ_height)
        this.$emit("width_changed" ,targ_width)
      }
    },
    close_side_bar(){
      this.$store.commit('close_side_bar')
    },
    content_clicked(){

    },
    minimizewindow_clicked(){
      this.$store.commit('minimize_window_with_uuid',{uuid:this.uuid,})
      window.setTimeout(()=>{
        this.$store.commit('refresh_window_focus', {uuid: ""})
      },400)
    },
    window_clicked(){
      this.$store.commit('close_side_bar')
      this.refocus()
    },
    refocus(){
      this.$store.commit('refresh_window_focus', {uuid: this.uuid})
    },
    mr_clicked(event){
      event.stopPropagation()
    }
  }
}
</script>

<style scoped>
.init_size {
  width: min(1000px, 65vw);
  height: min(620px, 65vh);
}

.cursor-move:hover {
  cursor: move;
}
</style>