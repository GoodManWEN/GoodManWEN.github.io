<template>
  <Window @height_changed="window_height_changed" @width_changed="window_width_changed" :startpos_x="startpos_x" :startpos_y="startpos_y" :uuid="uuid" :zindex="zindex" :minimized="minimized">
    <template v-slot:header>
      <div class=" tw-ml-4 tw-font-bold tw-tracking-wider tw-flex tw-items-center tw-select-none" style="pointer-events:none;" > 
        <img src="../../assets/images/icons/explorer.png" alt="" style="pointer-events:auto;" class=" tw-w-8 tw-h-8">
        <div class="tw-w-9 tw-h-9 tw-rounded-l-lg tw-flex tw-justify-center tw-items-center tw-ml-6" style="background-color:#f0f0f0;pointer-events:auto;" :style="{'opacity':global_focus===uuid?'1':'0.85'}">
          <v-icon style="color:#b0b4bf">mdi-chevron-left</v-icon>
        </div>
        <div class=" tw-h-9 tw-w-0.5" style="background-color:#ebebeb"></div>
        <div class="tw-w-9 tw-h-9 tw-rounded-r-lg tw-flex tw-justify-center tw-items-center" style="background-color:#f0f0f0;pointer-events:auto;" :style="{'opacity':global_focus===uuid?'1':'0.85'}">
          <v-icon style="color:#b0b4bf">mdi-chevron-right</v-icon>
        </div>
        <div class="tw-h-9 tw-px-3  tw-flex tw-items-center tw-justify-center tw-bg-mygray-b2  tw-rounded-lg tw-ml-3" style="pointer-events:auto;" :style="{'opacity':global_focus===uuid?'1':'0.85'}">
          <v-icon small>mdi-home-heart</v-icon>
        </div>
        <div class="tw-h-9 tw-px-3 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-ml-3 tw-text-sm tw-text-gray-50 tw-font-normal" style="pointer-events:auto;" v-for="(item,i) in open_openpath" :key="i" :class="{'tw-bg-mygray-b2':i!=(open_openpath.length - 1),'tw-bg-mygray-b4':i===(open_openpath.length - 1),'tw-text-mygray-b6':i!=(open_openpath.length - 1),'tw-text-gray-50':i===(open_openpath.length - 1), 'tw-font-semibold':i!=(open_openpath.length - 1),'hover:tw-bg-mygray-b3':i!=(open_openpath.length - 1),'hover:tw-bg-mygray-b5':i===(open_openpath.length - 1)}" :style="{'opacity':global_focus===uuid?'1':'0.85'}" @click="switch_supr_class(i)">
          {{item}}
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="tw-w-full tw-rounded-b-2xl tw-flex tw-select-none" :style="{'height':cont_height + 'px'}" v-if="true" @contextmenu.prevent="mr_clicked">
        <div ref="leftbar" class="tw-flex-none tw-bg-white tw-rounded-bl-2xl tw-overflow-hidden tw-flex tw-flex-row tw-select-none" style="min-width:160px;max-width:260px;width:208px" :style="{'opacity':global_focus===uuid?'1':'0.85'}">
          <div class=" tw-flex-grow tw-h-full tw-flex tw-items-center tw-flex-col tw-px-3">
            <WindowFolderIcon :icon="'clock-time-three'" :text="'Recently'"/>
            <WindowFolderIcon  :icon="'home-heart'" :text="'Home'"/>
            <WindowFolderIcon  :icon="'television-guide'" :text="'Desktop'"/>
            <WindowFolderIcon  :icon="'filmstrip'" :text="'Videos'"/>
            <WindowFolderIcon  :icon="'music'" :text="'Musics'"/>
            <WindowFolderIcon  :icon="'image'" :text="'Pictures'"/>
            <WindowFolderIcon  :icon="'file-document'" :text="'Documents'"/>
            <WindowFolderIcon  :icon="'delete'" :text="'Recycle Bin'"/>
            <div style="width:100%;height:2px;background-color:#efefef;margin-top:1px;margin-bottom:1px"></div>
            <WindowFolderIcon  :icon="'desktop-mac-dashboard'" :text="'This PC'"/>
            <WindowFolderIcon  :icon="'harddisk'" :text="'Root'"/>
            <div style="width:100%;height:2px;background-color:#efefef;margin-top:1px;margin-bottom:1px"></div>
            <WindowFolderIcon  :icon="'earth'" :text="'Network'"/>
          </div>
          <div class="tw-h-full tw-select-none" style="width:1px">
            <WindowSider :mode="1" @mousedown.native="right_resize" />
          </div>
        </div>
        <div class="tw-flex-grow  tw-h-full tw-rounded-br-2xl tw-flex tw-flex-col" >
          <div ref="main_body" class=" tw-flex-grow tw-w-full tw-flex tw-flex-col" style="background-color:#f8f8f8" :style="{'width':cont_width+'px'}" >
            <div class="tw-w-full tw-h-8 tw-border-b border tw-border-gray-300 tw-flex tw-items-center tw-text-mygray-b6 tw-tracking-tight tw-select-none" style="background-color:#e9e9e9">
              <div ref="name_col" class="tw-h-full tw-flex tw-items-center" style="" :style="{'width':name_col_width + 'px'}" @click="switch_selected('Name')">
                <div class="tw-flex-none tw-ml-2">Name</div>
                <div class="tw-flex-grow tw-flex tw-flex-row-reverse">
                  <v-icon v-if="selected==='Name'">{{mdi_computed_direction}}</v-icon>
                </div>
              </div>
              <WindowFolderSlider @mousedown.native="right_resize_grid_1"/>
              <div ref="date_col" class="tw-h-full tw-flex tw-items-center" style=""  :style="{'width':date_col_width + 'px'}" @click="switch_selected('Date Modified')">
                <div class="tw-flex-none">Date Modified</div>
                <div class="tw-flex-grow tw-flex tw-flex-row-reverse">
                  <v-icon v-if="selected==='Date Modified'">{{mdi_computed_direction}}</v-icon>
                </div>
              </div>
              <WindowFolderSlider @mousedown.native="right_resize_grid_2"/>
              <div ref="size_col" class="tw-h-full tw-flex tw-items-center" style=""  :style="{'width':size_col_width + 'px'}" @click="switch_selected('Size')">
                <div class="tw-flex-none">Size</div>
                <div class="tw-flex-grow tw-flex tw-flex-row-reverse">
                  <v-icon v-if="selected==='Size'">{{mdi_computed_direction}}</v-icon>
                </div>
              </div>
            </div>
            <div class="tw-flex-grow tw-w-full tw-flex ">
              <div ref="name_col_cont" :style="{'width':name_col_width + 4 + 'px'}" class=" tw-h-full">
                <div class=" tw-w-full tw-text-sm tw-flex tw-items-center" style="height:28px;" :style="{'background-color':current_focus===item.fileuuid?'rgba(0,129,255)':i%2===0?'rgba(255,255,255,0)':'rgba(55,55,55,.04)'}" v-for="(item ,i) in current_dir_list" :key="i" @click="item_oneClick(i)"> 
                  <div :style="{'height':item.children === undefined?'24px':'18px'}" class=" tw-flex tw-justify-center tw-items-center tw-w-7 tw-flex-none tw-ml-7 tw-pb-0.5">
                    <img :src="require(item.children === undefined?'../../assets/images/icons/text2.png':'../../assets/images/icons/folder.png')" alt="" class="tw-h-full" >
                  </div>
                  <div class=" tw-flex-grow tw-pr-1 tw-pl-2 tw-tracking-wide  tw-text-mygray-b6 tw-font-semibold" style="white-space:nowrap;text-overflow: ellipsis;overflow: hidden;" :style="{'color':current_focus===item.fileuuid?'#fefefe !important':''}"> {{item.name}}</div>
                </div>
              </div>
              <div ref="date_col_cont" :style="{'width':date_col_width + 10 + 'px'}" class="tw-h-full">
                <div class=" tw-w-full tw-text-sm tw-flex tw-items-center" style="height:28px;" :style="{'background-color':current_focus===item.fileuuid?'rgba(0,129,255)':i%2===0?'rgba(255,255,255,0)':'rgba(55,55,55,.04)'}" v-for="(item ,i) in current_dir_list" :key="i"> 
                  <div class=" tw-flex-grow tw-pr-1 tw-pl-3 tw-tracking-wide  tw-text-mygray-b7" style="white-space:nowrap;text-overflow: ellipsis;overflow: hidden;" :style="{'color':current_focus===item.fileuuid?'#fefefe !important':''}"> {{time_format_converter(item.lastedittime)}}</div>
                </div>
              </div>
              <div ref="size_col_cont" :style="{'width':size_col_width + 4 + 'px'}" class="tw-h-full">
                <div class=" tw-w-full tw-text-sm tw-flex tw-items-center" style="height:28px;" :style="{'background-color':current_focus===item.fileuuid?'rgba(0,129,255)':i%2===0?'rgba(255,255,255,0)':'rgba(55,55,55,.04)'}" v-for="(item ,i) in current_dir_list" :key="i"> 
                  <div class=" tw-flex-grow tw-pr-1 tw-pl-3 tw-tracking-wide  tw-text-mygray-b7" style="white-space:nowrap;text-overflow: ellipsis;overflow: hidden;" :style="{'color':current_focus===item.fileuuid?'#fefefe !important':''}"> {{size_format_converter(item.size)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class=" tw-flex-none tw-h-6 tw-w-full tw-rounded-br-2xl tw-flex tw-justify-center tw-items-center tw-text-sm tw-text-gray-900">
            {{current_dir_list.length}} Items
          </div>
        </div>
      </div>
    </template>
  </Window>
</template>

<script>
import Window from '../WindowBasic/Window.vue'
import WindowFolderIcon from './WindowFolderIcon.vue'
import WindowFolderSlider from './WindowFolderSlider.vue'
import WindowSider from '../WindowBasic/WindowSider.vue'

export default {
  name: 'WindowText',
  components: {
    Window,
    WindowSider,
    WindowFolderIcon,
    WindowFolderSlider,
  },
  data(){
    return {
      result: [],
      delay: 200,
      clicks: 0,
      focus: false,
      cont_margin: 50,
      cont_height: 550,
      cont_width: 800,
      body_margin: 208 + 20,
      selected: "Date Modified",
      direction_down: true,
      name_col_width: 160,
      date_col_width: 110,
      size_col_width: 50,
      current_focus:'',
      file_filemap:[],
      open_openpath:[],
    }
  },
  props: {
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
    filemap:{
      default:[]
    },
    openpath:{
      default:[]
    },
  },
  created(){
    this.file_filemap = this.filemap
    this.open_openpath = this.openpath
  },
  mounted(){
    this.$store.commit('refresh_window_focus', {uuid:this.uuid})
  },
  watch:{
    filemap(val){
      this.file_filemap = val
    },
    openpath(val){
      this.open_openpath = val
    },
  },
  computed:{
    mdi_computed_direction() {
      if (this.direction_down) {
        return 'mdi-chevron-down'
      } else {
        return 'mdi-chevron-up'
      }
    },
    current_dir_list() {
      if (this.file_filemap === [] || this.open_openpath === []) {
        return []
      }
      // else 
      let current_folder_pointer = this.file_filemap
      for (let dirname of this.open_openpath) {
        for (let tmp of current_folder_pointer) {
          if (tmp.name === dirname) {
            current_folder_pointer = tmp.children
            break
          }
        }
      }
      // sort
      let result = JSON.parse(JSON.stringify(current_folder_pointer))
      let compare_tag = "name"
      if (this.selected === "Name") {
        compare_tag = 'name'
      } else if (this.selected === "Date Modified") {
        compare_tag = 'lastedittime'
      } else if (this.selected === "Size") {
        compare_tag = 'size'
      }
      let sortfunc = (a,b) => {
        let res = 0;
        if (a.size < 0 && b.size >= 0) {
          res = -1
        } else if (a.size >= 0 && b.size < 0) {
          res = 1
        } else {
          if (a[compare_tag] === b[compare_tag]) {
            res = 0
          } else if (a[compare_tag] > b[compare_tag]) {
            res = 1
          } else {
            res = -1
          }
        }
        if (this.direction_down) {
          return -res
        } else {
          return res
        }
      }
      result.sort(sortfunc)
      return result
    },
    folder_name(){
      if (this.open_openpath.length === 0) {
        return ""
      } 
      // else 
      return this.open_openpath[this.open_openpath.length - 1]
    },
    global_focus(){
      return this.$store.state.current_focus
    },
  },
  methods:{
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    getOffset(offset,min,max){
      if (offset < min) {
        return min;
      } else if(offset > max){
        return max;
      } 
      return offset;
    },
    window_height_changed(val){
      this.cont_height = val - this.cont_margin
    },
    window_width_changed(val){
      this.cont_width = val - this.body_margin
      let sum = this.name_col_width + this.date_col_width + this.size_col_width
      this.name_col_width = this.name_col_width * this.cont_width / sum
      this.date_col_width = this.date_col_width * this.cont_width / sum
      this.size_col_width = this.size_col_width * this.cont_width / sum
    },
    right_resize(){
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downX = e.clientX;
      let orn_width = this.$refs.leftbar.style.width;
      orn_width = parseFloat(orn_width.substr(0,orn_width.length-2))
      let name_orn_width = this.$refs.name_col.style.width;
      name_orn_width = parseFloat(name_orn_width.substr(0,name_orn_width.length-2))
      let date_orn_width = this.$refs.date_col.style.width;
      date_orn_width = parseFloat(date_orn_width.substr(0,date_orn_width.length-2))
      let size_orn_width = this.$refs.size_col.style.width;
      size_orn_width = parseFloat(size_orn_width.substr(0,size_orn_width.length-2))
      let sum = name_orn_width + date_orn_width + size_orn_width;
      let max = Math.max(Math.min(sum - date_orn_width - size_orn_width - 110,260),160)
      let min = 160
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let offsetX = this.getOffset(moveX-downX+orn_width,min,max);
        this.$refs.leftbar.style.width = offsetX + 'px';
        this.body_margin = offsetX + 20
        let name_col_width = name_orn_width + orn_width - offsetX ;
        this.$refs.name_col.style.width = name_col_width + 'px';
        this.$refs.name_col_cont.style.width = name_col_width + 'px';
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
    switch_selected(val) {
      this.selected = val
      this.direction_down = ! this.direction_down
    },
    right_resize_grid_1(){
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downX = e.clientX;downX
      let name_orn_width = this.$refs.name_col.style.width;
      name_orn_width = parseFloat(name_orn_width.substr(0,name_orn_width.length-2))
      let date_orn_width = this.$refs.date_col.style.width;
      date_orn_width = parseFloat(date_orn_width.substr(0,date_orn_width.length-2))
      let size_orn_width = this.$refs.size_col.style.width;
      size_orn_width = parseFloat(size_orn_width.substr(0,size_orn_width.length-2))
      let sum = name_orn_width + date_orn_width + size_orn_width;
      let min_size = 110;
      let max_size = sum - 190;
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let offsetX = this.getOffset(moveX-downX+name_orn_width,min_size,max_size);
        let size_col_width = Math.max(sum - date_orn_width - offsetX, 70)
        let date_col_width = sum - size_col_width - offsetX
        this.$refs.name_col.style.width = offsetX + 'px';
        this.$refs.size_col.style.width = size_col_width + 'px';
        this.$refs.date_col.style.width = date_col_width + 'px';
        this.$refs.name_col_cont.style.width = (offsetX + 4) + 'px';
        this.$refs.size_col_cont.style.width = (size_col_width + 4) + 'px';
        this.$refs.date_col_cont.style.width = (date_col_width  + 10) + 'px';
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
    right_resize_grid_2(){
      let orn_mousedown = document.onmousedown;
      let e = e || window.event || e.which;
      let downX = e.clientX;downX
      let name_orn_width = this.$refs.name_col.style.width;
      name_orn_width = parseFloat(name_orn_width.substr(0,name_orn_width.length-2))
      let date_orn_width = this.$refs.date_col.style.width;
      date_orn_width = parseFloat(date_orn_width.substr(0,date_orn_width.length-2))
      let size_orn_width = this.$refs.size_col.style.width;
      size_orn_width = parseFloat(size_orn_width.substr(0,size_orn_width.length-2))
      let sum = name_orn_width + date_orn_width + size_orn_width;
      let min_size = 120;
      let max_size = sum - name_orn_width - 70;
      let mouseMoveHandler = () => {
        let e = e || window.event || e.which;
        let moveX = e.clientX;
        let offsetX = this.getOffset(moveX-downX+date_orn_width,min_size,max_size);
        let size_col_width = sum - offsetX - name_orn_width;
        this.$refs.date_col.style.width = offsetX + 'px';
        this.$refs.size_col.style.width = size_col_width + 'px';
        this.$refs.date_col_cont.style.width = offsetX + 10 + 'px';
        this.$refs.size_col_cont.style.width = size_col_width + 4 + 'px';
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
    time_format_converter(val) {
      let newdate = new Date(val * 1000)
      return newdate.getFullYear() + '/' + this.PrefixZero(newdate.getMonth() + 1,2) + '/' + this.PrefixZero(newdate.getDate(),2) + ' ' + this.PrefixZero(newdate.getHours(),2) + ':' + this.PrefixZero(newdate.getMinutes(),2) + ':' + this.PrefixZero(newdate.getSeconds(),2)
    },
    size_format_converter(val) {
      if (val < 0) {
        return '-'
      } else if (val >= (1<<20)) {
        return (val / (1<<20)).toFixed(1) + 'MB'
      } else if (val >= (1<<10)) {
        return (val / (1<<10)).toFixed(1) + 'KB'
      } else {
        return val + "B"
      }
    },
    item_oneClick(val){
      this.current_focus = this.current_dir_list[val].fileuuid
      this.clicks++ 
      if(this.clicks === 1) {
        let self = this
        this.timer = setTimeout(function() {
          self.clicks = 0
        }, this.delay);
      } else{
        clearTimeout(this.timer);  
        let item = this.current_dir_list[val]
        if (item.children === undefined) {
          document.body.style.cursor='progress'
          window.setTimeout(()=>{
            document.body.style.cursor='default'
          },500)
          this.$store.commit('open_new_window', {
            type:'text',
            filesrc: item.path,
            filename: item.name,
            size: item.size,
          })
        } else {
          // document.body.style.cursor='progress'
          // window.setTimeout(()=>{
          //   let tmp = JSON.parse(JSON.stringify(this.openpath))
          //   tmp.push(item.name)
          //   this.$store.commit('open_new_window', {'type':'explorer','openpath':tmp})
          //   document.body.style.cursor='default'
          // },450)
          this.open_openpath.push(item.name)
          this.file_filemap = item.children
        }
        this.clicks = 0;
      } 
    },
    switch_supr_class(val){
      let diff_num = this.open_openpath.length - 1 - val
      if (diff_num > 0) {
        for (let j = 0; j < diff_num; j++) {
          this.open_openpath.pop()
        }
        let folder_pointer = this.filemap
        for (let dirname of this.open_openpath) {
          for (let item of folder_pointer) {
            if (item.children === undefined) {
              continue
            }
            if (item.name === dirname) {
              folder_pointer = item.children
            }
          }
        }
        this.file_filemap = folder_pointer
      }
    },
    mr_clicked(){
      this.$store.commit('show_context_menu')
    },
  }
}
</script>

<style scoped>
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
