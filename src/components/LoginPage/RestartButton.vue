<template>
  <div class="tw-flex tw-flex-col tw-items-center">
    <div class="tw-w-20 tw-h-20  tw-rounded-full tw-flex tw-justify-center tw-items-center tw-bg-mygray-deeldark tw-border-2 tw-border-gray-600" v-if="typename=='shutdown'">
      <v-icon class="tw-w-full tw-h-full tw-text-gray-100 " x-large>mdi-power</v-icon>
    </div>
    <div class="tw-mt-4 tw-bg-mygray-deeldark tw-border-2 tw-border-gray-600 tw-rounded-lg tw-px-2 tw-py-0.5"  style="text-align:center"  v-if="typename=='shutdown'">Shut down</div>
    <div @mouseover="hover = true" @mouseleave="hover = false" v-if="typename!='shutdown'">
      <div ref="ticon" class="tw-w-20 tw-h-20  tw-rounded-full tw-flex tw-justify-center tw-items-center">
        <v-icon :class="icolor_class" x-large v-if="typename=='sleep'">mdi-moon-waxing-crescent</v-icon>
        <v-icon :class="icolor_class" x-large v-if="typename=='restart'">mdi-reload</v-icon>
      </div>
      <div class="tw-h-4 tw-w-20"></div>
      <div ref="text" class="tw-rounded-lg tw-px-2 tw-py-0.5 tw-text-gray-100" style="text-align:center">{{typename=="sleep"?"Sleep":"Restart"}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Blank',
  components: {
  },
  data(){
    return {
      hover: false,
      icolor_class: 'tw-w-full tw-h-full tw-text-gray-100',
    }
  },
  props:{
    typename:{
      type:String,
      default:"shutdown"
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
    hover(val){
      if (val) {
        this.$refs.ticon.classList.add('tw-bg-mygray-purple')
        this.icolor_class = 'tw-w-full tw-h-full tw-text-gray-900'
        this.$refs.text.classList.remove('tw-text-gray-100')
        this.$refs.text.classList.add('tw-text-gray-900')
        this.$refs.text.classList.add('tw-bg-mygray-purple')
      } else {
        this.$refs.ticon.classList.remove('tw-bg-mygray-purple')
        this.icolor_class = 'tw-w-full tw-h-full tw-text-gray-100'
        this.$refs.text.classList.add('tw-text-gray-100')
        this.$refs.text.classList.remove('tw-text-gray-900')
        this.$refs.text.classList.remove('tw-bg-mygray-purple')
      }
    }
  },
  computed:{
  },
  methods:{
  }
}
</script>

<style scoped>
</style>