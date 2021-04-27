<template>
  <Window :uuid='uuid' :startpos_x="startpos_x" :startpos_y="startpos_y" :zindex="zindex" :default_width="default_width" :default_height="default_height" :fixedsize="fixedsize" :minimized="minimized">
    <template v-slot:header>
      <div class="tw-flex tw-items-center tw-select-none" style="pointer-events:none;"> 
        <img src="../../assets/images/icons/music.png" alt="" style="pointer-events:auto;" class=" tw-w-8 tw-h-7 tw-ml-4">
        <div class=" tw-ml-4 tw-font-bold tw-tracking-wider tw-w-14" style="pointer-events:auto;"> Music </div>
      </div>
    </template>
    <template v-slot:content>
      <div class=" tw-w-full tw-h-full tw-overflow-hidden tw-rounded-b-2xl tw-flex tw-flex-col
      tw-items-center tw-justify-center" @contextmenu.prevent="mr_clicked" >
        <aplayer autoplay
          style="width:500px;height:500px;overflow:scroll"
          :music="firstmusic"
          :list="musiclist"
          :repeat="'repeat-all'"
        />
      </div>
    </template>
  </Window>
</template>

<script>
import Window from '../WindowBasic/Window.vue'
import Aplayer from 'vue-aplayer'

export default {
  name: 'WindowMusic',
  components: {
    Window,
    Aplayer
  },
  data(){
    return {
      musiclist: [],
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
    }
  },
  created(){
    this.$axios.raw('musics.json')
    .then((res) => {
      document.body.style.cursor='normal'
      if (typeof(res.data) === 'string') {
        // error
        console.log("Load error, got string returned")
      }
      this.musiclist = res.data
    })
    .catch((err) => {
      console.log("[WindowMusic] axios error: ", err)
    })
  },
  mounted(){
    
  },
  watch:{
  },
  computed:{
    firstmusic(){
      if (this.musiclist.length > 0) {
        return this.musiclist[0]
      } else {
        return {
          title: '',
          artist: '',
          src: '',
          pic: '',
        }
      }
    }
  },
  methods:{
    window_height_changed(val){
      this.cont_height = val - this.cont_margin
    },
    mr_clicked(){
      this.$store.commit('show_context_menu')
    }
  }
}
</script>

<style scoped>
</style>
