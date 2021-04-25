<template>
  <div class="tw-w-screen tw-h-screen tw-overflow-hidden tw-fixed tw-bg-gray-900 tw-top-0 tw-left-0 tw-flex tw-justify-center tw-items-center animate__animated animate__faster" :class="{'animate__fadeOut':!show_loading_page}" :style="{'z-index':zindex}" style="pointer-events:auto" @contextmenu.prevent="{}">
    <div class=" tw-flex tw-items-center tw-justify-center tw-w-60 tw-h-60 ">
      <div class="tw-absolute tw-w-60 tw-h-60  tw-flex tw-justify-center tw-items-center">
        <div class=" tw-w-10 tw-h-16  tw-flex tw-flex-col-reverse turnaround"><div class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-blue-500"></div></div>
      </div>
      <div class="tw-absolute tw-w-60 tw-h-60  tw-flex tw-justify-center tw-items-center turnaround1">
        <div class=" tw-w-10 tw-h-16  tw-flex tw-flex-col-reverse"><div class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-yellow-500"></div></div>
      </div>
      <div class="tw-absolute tw-w-60 tw-h-60  tw-flex tw-justify-center tw-items-center turnaround2">
        <div class=" tw-w-10 tw-h-16  tw-flex tw-flex-col-reverse"><div class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-purple-500 "></div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Interlude',
  components: {
  },
  data(){
    return {
      timer: null,
      zindex: 9999,
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
    show_loading_page(val) {
      if (!val) {
        this.timer = window.setTimeout(()=>{
          this.zindex = -1
          this.timer = null
        },700)
      } else {
        this.zindex = 9999
        if (this.timer != null) {
          clearTimeout(this.timer)
        }
      }
    }
  },
  computed:{
    show_loading_page(){
      return this.$store.state.show_loading_page
    },
  },
  methods:{
  }
}
</script>

<style scoped>
.turnaround{
  animation:turnaround 0.5s linear infinite;      
}

.turnaround1{
  animation:turnaround1 0.5s linear infinite;      
}

.turnaround2{
  animation:turnaround2 0.5s linear infinite;      
}


@keyframes turnaround{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(90deg);}
  50%{-webkit-transform:rotate(180deg);}
  75%{-webkit-transform:rotate(270deg);}
  100%{-webkit-transform:rotate(360deg);}
}

@keyframes turnaround1{
  0%{-webkit-transform:rotate(120deg);}
  25%{-webkit-transform:rotate(210deg);}
  50%{-webkit-transform:rotate(300deg);}
  75%{-webkit-transform:rotate(390deg);}
  100%{-webkit-transform:rotate(480deg);}
}

@keyframes turnaround2{
  0%{-webkit-transform:rotate(240deg);}
  25%{-webkit-transform:rotate(330deg);}
  50%{-webkit-transform:rotate(420deg);}
  75%{-webkit-transform:rotate(510deg);}
  100%{-webkit-transform:rotate(600deg);}
}
</style>