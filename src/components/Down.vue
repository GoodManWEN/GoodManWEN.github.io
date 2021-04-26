<template>
  <div class=" tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-h-screen tw-overflow-hidden" style="background-color:rgba(16,16,16)">
    <div class="tw-mt-14 tw-ml-20 flash tw-bg-red-50" style="height:1.5px;width:14px"></div>
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
  created(){
  },
  mounted(){
    window.setTimeout(()=>{
      this.$store.commit('hide_interlude')
    },2000)
    window.setTimeout(()=>{
      this.exitfullscreen()
    },4000)
  },
  watch:{
  },
  computed:{
  },
  methods:{
    exitfullscreen() {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if(document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }
}
</script>

<style scoped>
.flash {
  animation-iteration-count: infinite;
  animation-name: twinkle-1;
  animation-duration: 1s;
}


@keyframes twinkle-1 {
  0% {
    opacity: 0;
  }
  45% {
    opacity: 0;
  }
  55% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
</style>

