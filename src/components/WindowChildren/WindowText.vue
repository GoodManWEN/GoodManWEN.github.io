<template>
  <Window @height_changed="window_height_changed" :startpos_x="startpos_x" :startpos_y="startpos_y" :uuid="uuid" :zindex="zindex" :minimized="minimized" @width_changed="window_width_changed" v-show="loaded">
    <template v-slot:header>
      <div class="tw-flex tw-items-center tw-select-none" style="pointer-events:none;"> 
        <img src="../../assets/images/icons/doc.png" alt="" style="pointer-events:auto;" class=" tw-w-8 tw-h-7 tw-ml-4">
        <div class="tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-bg-mygray-b4 hover:tw-bg-mygray-b5 tw-ml-3" style="pointer-events:auto;" :style="{'opacity':global_focus===uuid?'1':'0.85'}" @click="title_clicked">
          <div class="tw-h-full tw-px-3  tw-text-sm tw-font-normal tw-text-gray-50 tw-pt-2" style="white-space:nowrap;text-overflow: ellipsis;overflow: hidden;max-width:300px" >{{filename}}</div>
        </div>
        <div class="tw-h-9 tw-px-3  tw-flex tw-items-center tw-justify-center tw-bg-mygray-b3  tw-rounded-lg tw-ml-3 hover:tw-bg-mygray-b1 tw-text-mygray-b8" style="pointer-events:auto;">
          <v-icon small>mdi-plus</v-icon>
        </div>
        <!-- <div class=" tw-ml-4 tw-font-bold tw-tracking-wider"> {{filename}} </div> -->
      </div>
    </template>
    <template v-slot:content>
      <div class="tw-w-full tw-h-full tw-rounded-b-2xl tw-flex tw-flex-col-reverse" @contextmenu.prevent="mr_clicked">
        <div class="tw-h-8 tw-w-full tw-rounded-b-2xl tw-border-t tw-border-gray-200 tw-items-center tw-flex tw-flex-row-reverse" style="background-color:#fdfdfd">
          <div class="tw-flex-none tw-h-full tw-flex tw-justify-center tw-items-center tw-px-3 tw-py-1 tw-select-none ">
            <button class="tw-flex tw-justify-center tw-items-center hover:tw-bg-mygray-b1 tw-px-2 rounded-lg tw-text-xs tw-text-gray-700 tw-w-full tw-h-full tw-outline-none">
              None
              <v-icon small class="tw-ml-1">mdi-chevron-down</v-icon>
            </button>
          </div>
          <div class="vl"></div>
          <div class="tw-flex-none tw-h-full tw-flex tw-justify-center tw-items-center tw-px-3 tw-py-1 tw-select-none">
            <button class="tw-flex tw-justify-center tw-items-center hover:tw-bg-mygray-b1 tw-px-2 rounded-lg tw-text-xs tw-text-gray-700 tw-w-full tw-h-full tw-outline-none">
              UTF-8
              <v-icon small class="tw-ml-1">mdi-chevron-down</v-icon>
            </button>
          </div>
          <div class="vl"></div>
          <div class="tw-flex-none tw-h-full tw-flex tw-justify-center tw-items-center tw-px-3 tw-py-1 tw-select-none">
            <div class="tw-flex tw-justify-center tw-items-center rounded-lg tw-text-xs tw-text-gray-700 tw-w-full tw-h-full">
              Browse
            </div>
          </div>
          <div class="tw-flex-none tw-h-full tw-flex tw-justify-center tw-items-center tw-pr-24 tw-py-1 tw-select-none">
            <div class="tw-flex tw-justify-center tw-items-center rounded-lg tw-text-xs tw-text-gray-700 tw-w-full tw-h-full">
              {{size_format_converter(size)}}
            </div>
          </div>
          <div class="tw-flex-grow tw-h-full tw-flex tw-flex-row tw-justify-start tw-py-1 tw-select-none tw-pl-4">
            <div class="tw-flex tw-justify-start tw-items-center rounded-lg tw-text-xs tw-text-gray-700 tw-w-18 tw-h-full tw-flex-nowrap">
              Ln {{line_num}}, Col {{col_num}}
            </div>
          </div>
        </div>
        <div class=" tw-flex-grow tw-w-full tw-flex flex-row">
          <div class="tw-w-8 tw-h-full tw-px-1.5 tw-py-1" style="background-color:#f0f0f0;color:#a1b9cf">
            <span class="tw-hidden">1</span>
          </div>
          <div class="tw-w-full  tw-bg-white tw-pl-5 tw-pr-3 tw-py-1.5 change-srollbar" style="overflow:auto" :style="{'height': cont_height +'px'}">
            <markdown-it-vue class="md-body zoomined-frame" :content="content" :style="{'width':cont_width+'px !important'}" :options="{markdownIt: {html: true}}"/>
          </div>
        </div>
      </div>
    </template>
  </Window>
</template>

<script>
import Window from '../WindowBasic/Window.vue'
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'

const error_message = '## Failed to load the file, some kind of error may have occurred\n\nWe are very sorry about the inconvenience caused.\n\n Since it is not likely a probelm caused by the framework author, this is usually an error due to network reasons.\n\nIt is recommended to do the following setps:\n> 1.Reconnect the network cable and pray for the resume.\n> 2.Go to the author\'s blog and give the repo a star.\n> 3.Yes, this advice is just gibberish.The only reason why this exists is to prove to you that markdown can be recognized correctly even under case of article loading failure.'

export default {
  name: 'WindowText',
  components: {
    Window,
    MarkdownItVue
  },
  data(){
    return {
      content: "",
      cont_margin: 80,
      cont_height: 600 - 80,
      line_num:0,
      col_num:0,
      cont_width: 800,
      cont_width_margin: 76,
      loaded:false,
      copy_lock:false,
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
    filesrc:{
      type:String,
      default:"",
    },
    filename:{
      type:String,
      default:"",
    },
    size:{
      type:Number,
      default:0,
    },
  },
  created(){
  },
  mounted(){
    this.$axios.raw(this.filesrc)
    .then((res) => {
      document.body.style.cursor='normal'
      if (typeof(res.data) === 'string') {
        // error
        console.log("Load error, got string returned")
        this.content = error_message
      }
      this.content = res.data.data
      console.log(res.data.data)
      this.compute_line_col_num(res.data.data)
      this.$store.commit('refresh_window_focus', {uuid:this.uuid})
      this.loaded = true
    })
    .catch((err) => {
      document.body.style.cursor='normal'
      console.log("error:", err)
      this.$store.commit('refresh_window_focus', {uuid:this.uuid})
      this.content = error_message
      this.loaded = true
    })
  },
  watch:{
  },
  computed:{
    global_focus(){
      return this.$store.state.current_focus
    }
  },
  methods:{
    window_height_changed(val){
      this.cont_height = val - this.cont_margin
    },
    compute_line_col_num(cont){
      let text = cont.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
      let largest = 0
      text.forEach(
        (item, index) => { // 删除空项
          if (item.length > largest) {
            largest = item.length;index
          }
        }
      )
      this.line_num = text.length
      this.col_num = largest
    },
    size_format_converter(val) {
      if (val < 0) {
        return '-'
      } else if (val >= (1<<20)) {
        return (val / (1<<20)).toFixed(1) + 'MB'
      } else if (val >= (1<<10)) {
        return (val / (1<<10)).toFixed(1) + 'KiB'
      } else {
        return val + "Bytes"
      }
    },
    window_width_changed(val){
      this.cont_width = val - this.cont_width_margin
    },
    title_clicked(){
      let background = document.getElementsByClassName("realbackground")[0]
      if (background === undefined || this.copy_lock) {
        return 
      }
      this.copy_lock = true
      let e = e || window.event || e.which;
      let downY = e.clientY;
      let downX = e.clientX;
      let element = document.createElement('div');
      element.innerText = "URL has been copied"
      element.style.cssText = "z-index:1001;white-space:nowrap;top:" + (downY-20) + "px;left:" + downX + "px";
      element.className = "tw-px-2 tw-py-1 tw-absolute tw-rounded-md tw-bg-gray-200 tw-text-sm tw-tracking-wide tw-text-gray-900  tw-select-none animate__animated";
      background.appendChild(element)
      element.className += " animate__fadeOutUp"
      navigator.clipboard.writeText(document.location.protocol + "//" + window.location.host + "/#/desktop/post/" + this.filename)
      window.setTimeout(()=>{
        element.remove()
        this.copy_lock = false
      },550)
    },
    mr_clicked(){
      this.$store.commit('show_context_menu')
    }
  }
}
</script>

<style scoped>
.vl {
  border-left: 1px solid rgba(200,200,200,.5);
  height: 16px;
  left: 50%;
}

.change-srollbar{
  left:0;
  margin-right:3px;
}
.change-srollbar::-webkit-scrollbar {/*滚动条整体样式*/
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
  scrollbar-arrow-color:red;

}
.change-srollbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 7px rgba(0,0,0,0.3);
  background: rgba(0,0,0,0.3);
  scrollbar-arrow-color:red;
}
.change-srollbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 7px rgba(0,0,0,0.2); */
  border-radius: 0;
  /* background: rgba(0,0,0,0.1); */
}
</style>
