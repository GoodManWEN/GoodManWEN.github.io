<template>
  <div class="tw-pl-6 tw-pr-1.5 tw-flex tw-items-center tw-font-semibold" :class="{'hover:tw-text-white':!disabled,'hover:tw-bg-mygray-b4':!disabled,'tw-text-mygray-b15':disabled,'tw-text-gray-900':!disabled}" style="height:30px">
    <div>{{text}}</div>
    <div class="tw-flex-grow tw-h-full"></div>
    <v-icon small class="tw-flex-none" :class="{'hover:tw-text-white':!disabled,'tw-text-mygray-b15':disabled,'tw-text-gray-900':!disabled}" v-if="further_menu">mdi-chevron-right</v-icon>
  </div>
</template>

<script>
export default {
  name: 'ContextMenuButton',
  components: {
  },
  data(){
    return {

    }
  },
  props:{
    text:{
      type:String,
      default:"111",
    },
    disabled:{
      type:Boolean,
      default:false,
    },
    further_menu:{
      type:Boolean,
      default:false,
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
  }
}
</script>

<style scoped>
</style>