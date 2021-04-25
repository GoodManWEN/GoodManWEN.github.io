<template>
  <div class=" tw-w-full hover:tw-bg-gray-200 tw-rounded-lg tw-flex tw-justify-start tw-items-center tw-py-1.5">
    <v-icon small style="color:rgba(66,77,104)" class=" tw-flex tw-items-center tw-mb-0.5 tw-ml-1.5">mdi-{{icon}}</v-icon>
    <div style="color:rgba(66,77,104)" class="tw-flex tw-items-center tw-ml-2 tw-w-full tw-h-full">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: 'WindowFolderIcon',
  components: {
  },
  data(){
    return {
    }
  },
  props:{
    text:{
      type:String,
      default:"Reecently",
    },
    icon:{
      type:String,
      default:"clock-time-three",
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