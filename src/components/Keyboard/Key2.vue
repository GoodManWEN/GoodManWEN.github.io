<template>
  <div class="tw-w-full tw-h-11 key-background tw-rounded-md shadowed" ref="outer">
    <div class="tw-w-full tw-h-1/2 key-background2 tw-rounded-md " ref="inner">
      <div class="tw-flex tw-justify-center tw-items-center tw-w-11 tw-h-11 tw-pt-1 tw-font-light">
        <span v-if="letter.length<=5">{{letter}}</span>
        <div v-if="letter=='icon_back'"><v-icon class="tw-text-gray-100 ">mdi-backspace-outline</v-icon></div>
        <div v-if="letter=='icon_xxxx'"><v-icon class="tw-text-gray-100 ">mdi-close-box-outline</v-icon></div>
        <div v-if="letter=='icon_shift'"><v-icon class="tw-text-gray-100 ">mdi-arrow-up-bold-outline</v-icon></div>
        <div v-if="letter=='icon_enter'"><v-icon class="tw-text-gray-100 ">mdi-subdirectory-arrow-left</v-icon></div>
        <div v-if="letter=='icon_left'"><v-icon class="tw-text-gray-100 ">mdi-arrow-left</v-icon></div>
        <div v-if="letter=='icon_right'"><v-icon class="tw-text-gray-100 ">mdi-arrow-right</v-icon></div>
        <div v-if="letter=='icon_up'"><v-icon class="tw-text-gray-100 ">mdi-arrow-up</v-icon></div>
        <div v-if="letter=='icon_down'"><v-icon class="tw-text-gray-100 ">mdi-arrow-down</v-icon></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Key',
  components: {
  },
  data(){
    return {

    }
  },
  props: {
    letter:{
      type: String,
      default: ""
    },
    key_down_status:{
      type: Boolean,
      default: false,
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
    key_down_status(val){
      if (!val) {
        this.keyup()
      } else {
        this.keydown()
      }
    }
  },
  computed:{
  },
  methods:{
    keydown(){
      this.$refs.outer.classList.remove('shadowed')
      this.$refs.outer.classList.remove('key-background')
      this.$refs.outer.classList.add('mt025')
      this.$refs.outer.classList.add('key-background-pressed')
      this.$refs.inner.classList.remove('key-background2')
      this.$refs.inner.classList.add('key-background2-pressed')
    },
    keyup(){
      this.$refs.outer.classList.add('shadowed')
      this.$refs.outer.classList.add('key-background')
      this.$refs.outer.classList.remove('mt025')
      this.$refs.outer.classList.remove('key-background-pressed')
      this.$refs.inner.classList.add('key-background2')
      this.$refs.inner.classList.remove('key-background2-pressed')
    }
  }
}
</script>

<style scoped>
.mt025{
  margin-top: 1px;
}

.key-background{
  background-image: linear-gradient(to bottom, rgba(41,48,60), rgba(31,38,50));
  color:white
}

.key-background-pressed{
  background-image: linear-gradient(to bottom, rgba(94,107,128), rgba(94,107,128));
  color:white
}

.key-background2{
  background-image: linear-gradient(to bottom, rgb(98,105,117,.2), rgba(36,43,55,.8));
  color:white
}

.key-background2-pressed{
  background-image: linear-gradient(to bottom, rgb(138,145,157,.2), rgba(94,107,128,.8));
  color:white
}

.shadowed{
  box-shadow: 0 1px #000000;
}
</style>