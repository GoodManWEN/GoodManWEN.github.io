<template>
  <div class="tw-w-12 tw-h-full tw-flex tw-items-center tw-justify-center" :class="{'tw-pl-1':bname=='b2','hover:tw-bg-mygray-lighter':!blacktheme,'hover:tw-bg-mygray-b12':blacktheme}" @click="clicked">
    <img :src="require('../../assets/images/icons/'+bname+'.svg')" alt="" class="">
  </div>        
</template>

<script>
export default {
  name: 'Blank',
  components: {
  },
  data(){
    return {
    }
  },
  props:{
    bname: {
      type:String,
      default:"b1"
    },
    blacktheme: {
      type:Boolean,
      default:false
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
    clicked(){
      this.$emit("button_clicked")
    }
  }
}
</script>

<style scoped>
</style>