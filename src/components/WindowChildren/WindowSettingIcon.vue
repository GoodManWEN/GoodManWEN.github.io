<template>
  <div class=" tw-h-12  tw-w-full tw-rounded-xl hover:tw-bg-mygray-b3 tw-flex tw-items-center  tw-mt-0.5" :class="{'hover:tw-bg-mygray-b3':selected_tag!=tag,'hover:tw-bg-mygray-b11':selected_tag===tag,'tw-bg-mygray-b4':selected_tag===tag,'tw-text-white':selected_tag===tag,'tw-text-mygray-b6':selected_tag!=tag}">
    <img :src="require('../../assets/images/icons/'+img+'.png')" alt="" class="tw-ml-4 tw-w-7" v-if="mdi===''">
    <v-icon v-if="mdi!=''" class="tw-ml-4" :class="{'tw-text-white':selected_tag===tag,'tw-text-mygray-b6':selected_tag!=tag}">mdi-{{mdi}}</v-icon>
    <div class=" tw-font-bold tw-ml-3">{{tag}}</div>
  </div>
</template>

<script>
export default {
  name: 'WindowSettingsIcon',
  components: {
  },
  data(){
    return {
    }
  },
  props:{
    tag:{
      type:String,
      default:"",
    },
    selected_tag:{
      type:String,
      default:"_",
    },
    img:{
      type:String,
      default:"",
    },
    mdi:{
      type:String,
      default:"",
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
  }
}
</script>

<style scoped>
</style>