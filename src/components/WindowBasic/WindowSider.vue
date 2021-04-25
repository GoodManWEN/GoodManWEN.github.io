<template>
  <div :class="{'e-resize':mode===1,'s-resize':mode===0,'nw-resize':mode===2}" :style="mode===1?'width:2px;height: calc(100% - 8px) ':mode===0?'height:2px;width: calc(100% - 8px) ':'height:2px;width:2px'" class="tw-select-none tw-flex-none">
    <div class="tw-relative tw-w-2 tw-h-2" v-if="mode===2"  style="left:-4px;top:-4px"></div>
  </div>
</template>

<script>
export default {
  name: 'WindowSider',
  components: {
  },
  data(){
    return {
      
    }
  },
  props:{
    mode:{
      type: Number,
      default: 0,
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
.s-resize {cursor: s-resize;}
.e-resize {cursor: e-resize;}
.nw-resize {cursor: nw-resize;}
</style>