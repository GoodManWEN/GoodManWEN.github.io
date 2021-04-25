<template>
  <div class="tw-w-9 tw-h-9  tw-rounded-lg tw-select-none">
    <div class=" tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center">
      <button class="tw-rounded-lg tw-flex tw-justify-center tw-items-center tw-bg-gray-700 hover:tw-bg-gray-800 tw-outline-none" style="width:30px;height:30px" @mouseover="mouseover" @mouseleave="mouseleave" v-if="mode==='small'" @click="emit_event">
        <v-icon class="tw-text-gray-100" :small="smalltrue">mdi-{{iconn}}</v-icon>
      </button>
      <button class="tw-rounded-lg tw-flex tw-justify-center tw-items-center tw-outline-none tw-w-12 tw-h-9" style="width:30px;height:30px" @mouseover="mouseover" @mouseleave="mouseleave" v-if="mode==='large'" @click="emit_event" >
        <img ref="shakeimg" :src="require('../../assets/images/icons/'+srcc+'.png')" class="animate__animated"/>
      </button>
      <div class="tw-absolute ">
        <div class="tw-absolute tw-w-5" style="top:21px;left:-10px;height:1.8px;background-color:rgba(49,56,58)" :style="{'background':cfocus?` -webkit-gradient(linear, 0 0, 100% 0, from(rgba(82,153,195,.7)), color-stop(0.5,rgba(77,191,255)), to(rgba(82,153,195,.7))`:'rgba(49,56,58)'}" v-if="fshow"></div>
      </div>
      <div class="tw-absolute tw-transform tw-rotate-45 tw-z-20" :style="highertag?'top:-70%':'top:-40%'"  v-show="show_tag">
        <div class=" tw-w-4 tw-h-4" style="background-color:rgba(166,166,166)"></div>
      </div>
      <div class="tw-absolute tw-z-20" :style="highertag?'top:-110%':'top:-70%'"   v-show="show_tag">
        <div class="tw-h-6 tw-rounded-lg tw-text-sm  tw-flex tw-justify-center tw-items-center tw-font-bold tw-tracking-wide tw-px-2" style="background-color:rgba(166,166,166);text-wrap:none;white-space:nowrap;">{{tagcont}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  components: {
  },
  data(){
    return {
      show_tag:false,
      current_timeout:null,
      prevent_continue_click:false,
    }
  },
  props:{
    mode: {
      type:String,
      default:"small"
    },
    srcc: {
      type:String,
      default:""
    },
    iconn: {
      type:String,
      default:""
    },
    tagcont: {
      type:String,
      default:""
    },
    smalltrue: {
      type:Boolean,
      default:true,
    },
    highertag:{
      type:Boolean,
      default:false,
    },
    noamine:{
      type:Boolean,
      default:false,
    },
    realactivate:{
      type:Boolean,
      default:false,
    },
    cfocus:{
      type:Boolean,
      default:false,
    },
    fshow:{
      type:Boolean,
      default:false,
    },
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
    mouseover(){
      if (this.current_timeout === null) {
        this.current_timeout = window.setTimeout(()=>{
          this.show_tag = true
        },700)
      }
    },
    mouseleave(){
      let targ = this.current_timeout
      this.current_timeout = null
      if (targ != null) {
        clearTimeout(targ)
      }
      this.show_tag = false
    },
    emit_event(){
      if (this.iconn != 'bell') {
        this.$store.commit('close_side_bar')
      }
      if (this.prevent_continue_click === false) {
        this.prevent_continue_click = true 
        window.setTimeout(()=>{
          this.$emit("button_clicked")
          this.prevent_continue_click = false
        },200)
        if (this.mode === 'large' && !this.noamine) { 
          let target = this.$refs.shakeimg;
          target.classList.add('animate__swing')
          window.setTimeout(()=>{
            target.classList.remove('animate__swing')
          },400)
        }
      }
    },
  }
}
</script>

<style scoped>
</style>