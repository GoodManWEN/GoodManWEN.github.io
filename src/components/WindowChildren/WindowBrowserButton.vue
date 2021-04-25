<template>
  <div class=" tw-w-9 tw-h-9">
    <button class=" tw-bg-mygray-b3 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-rounded-lg tw-border tw-border-gray-300 tw-outline-none" :class="{'hover:tw-bg-mygray-b1':!disabled,}" v-if="mode===0" @click="button_clicked">
      
      <v-icon :class="{'tw-text-mygray-b9':!disabled,'tw-text-mygray-b10':disabled}">mdi-{{icon}}</v-icon>
    </button>  
    <div v-if="mode === 1" class="hover:tw-bg-mygray-b3 tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-rounded-lg">
      <v-icon style="color:#5f6368" small>mdi-{{icon}}</v-icon>
    </div>
  </div>
  
</template>

<script>

export default {
  name: 'WindowBrowserButton',
  components: {
  },
  data(){
    return {
    
    }
  },
  props:{
    mode:{
      type:Number,
      default:0,
    },
    disabled:{
      type:Boolean,
      default:false,
    },
    icon:{
      type:String,
      default:"",
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
    button_clicked(){
      if (this.disabled) {
        return 
      }
      this.$emit('button_clicked')
    }
  }
}
</script>

<style scoped>
</style>