<template>
  <div :class="{'tw-w-full':true, 'tw-px-3':true,'tw-select-none':true,'animate__animated':true, 'animate__slideOutRight':closed,'animate__fadeInDown':true,'animate__faster':closed,'tw-mt-3':true}" @mouseover="mouseover" @mouseleave="mouseleave" v-if="!deleted">
    <div class="tw-w-full tw-h-full tw-bg-opacity-50 tw-bg-gray-50 tw-rounded-xl tw-overflow-hidden">
      <div class="tw-w-full tw-h-8 tw-bg-opacity-40 tw-bg-gray-200 tw-flex tw-flex-row tw-items-center">
        <!-- <img src="" alt="" class="tw-flex-none tw-px-2"> -->
        <img src="../../assets/images/icons/text2.png" alt="" class="tw-flex-none  tw-h-5 tw-w-6  tw-pl-2 tw-ml-2">
        <div class="tw-flex-none tw-text-xs tw-font-bold tw-ml-2">{{content}}</div>
        <div class="tw-flex-grow"></div>
        <div class="tw-text-gray-600 tw-text-xs tw-mr-3" v-if="!mouseon"> {{time}} </div>
        <div class="tw-text-xs tw-mr-3" v-if="mouseon"> 
          <button class=" tw-w-5  tw-h-5 tw-bg-gray-50 tw-rounded-full tw-flex tw-justify-center tw-items-center hover:tw-bg-gray-200 hover:tw-shadow-md tw-outline-none" @click="close_triggered">
            <v-icon x-small>mdi-close</v-icon>
          </button>
        </div>
      </div>
      <div class="tw-flex-grow tw-flex tw-flex-row-reverse tw-w-full">
        <div class="tw-p-2 tw-flex tw-flex-col tw-justify-center tw-items-center">
          <button class="tw-w-16 tw-h-9 tw-rounded-lg tw-flex  tw-justify-center tw-items-center tw-font-bold tw-text-sm tw-bg-opacity-40 tw-bg-gray-100 hover:tw-bg-opacity-80 hover:tw-shadow-sm tw-outline-none" @click="view_triggered"> View </button>
        </div>
        <div class=" tw-flex-grow tw-flex tw-flex-col">
          <div class=" tw-flex tw-items-center tw-py-1 tw-px-4 tw-font-bold tw-mt-1 tw-tracking-wide tw-text-sm" style="font-size:15px !important">{{title}}</div>
          <div class="tw-flex-gorw tw-text-sm tw-text-gray-600 tw-tracking-wide tw-h-12" >
            <div class="tw-h-11 tw-w-68 tw-px-4 tw-py-1" style="text-overflow:ellipsis; display: -webkit-box;-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;">{{abstract}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mssage',
  components: {
  },
  data(){
    return {
      mouseon: false,
      closed: false,
      deleted: false,
    }
  },
  props:{
    title:{
      type:String,
      default:""
    },
    abstract:{
      type:String,
      default:""
    },
    content:{
      type:String,
      default:""
    },
    time:{
      type:String,
      default:""
    },
    lastedittime:{
      type:Number,
      default:0,
    },
    filename:{
      type:String,
      default:""
    },
    filesrc:{
      type:String,
      default:""
    },
    filesize:{
      type:Number,
      default:0,
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
    clean_messages(val){
      if (val) {
        this.closed = true
        window.setInterval(()=>{
          this.deleted = true
        },500)
      }
    }
  },
  computed:{
    clean_messages(){
      return this.$store.state.clean_messages 
    }
  },
  methods:{
    mouseover(){
      this.mouseon = true
    },
    mouseleave(){
      this.mouseon = false
    },
    view_triggered(){
      this.$store.commit('open_new_window', {
        type:'text',
        filesrc: this.filesrc,
        filename: this.filename,
        size: this.filesize,
      })
      this.close_triggered()
    },
    close_triggered(){
      this.$emit('close_triggered', this.lastedittime)
      this.$emit('delete_item', this.filesrc)
      this.closed = true
      window.setInterval(()=>{
        this.deleted = true
      },500)
    }
  }
}
</script>

<style scoped>
</style>