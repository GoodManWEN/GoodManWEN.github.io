<template>
  <div class="tw-pt-4 tw-pb-1 tw-px-6 tw-flex tw-flex-col tw-justify-center tw-items-center" style="height:120px;width:120px" @click="oneClick">
    <img :src="require('../../assets/images/icons/folder.png')" class=" tw-w-12" v-if="item_type===0"/>
    <img :src="require('../../assets/images/icons/text.png')" class=" tw-w-10" v-if="item_type===1"/>
    <div class="tw-flex  tw-justify-center tw-items-start tw-overflow-hidden" style="height:46px;width:72px">
      <div class="tw-mt-1.5 tw-leading-4  tw-pt-1 tw-pb-0.5  tw-px-1 tw-rounded-md tw-text-sm" style="text-align:center;text-shadow:0px 1px 4px rgba(16,16,16,.9);color:#f2f2f2;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;" :class="{'tw-bg-blue-500':global_focus === uuid}">{{item_name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesptopFileIcon',
  components: {
  },
  data(){
    return {
      result: [],
      delay: 200,
      clicks: 0,
      uuid: "",
    }
  },
  props: {
    item_name: {
      type:String,
      default:"",
    },
    item_type: {
      type:Number,
      default:0,
    }
  },
  created(){
    this.uuid = this.$utils.get_uuid()
  },
  mounted(){
  },
  watch:{
  },
  computed:{
    global_focus(){
      return this.$store.state.current_focus
    },
  },
  methods:{
    dbclicked(){
      this.$emit("dbclicked", this.folder)
    },
    oneClick(){
      this.clicks++ 
      this.$store.commit('refresh_window_focus', {uuid:this.uuid})
      this.$store.commit('close_side_bar')
      if(this.clicks === 1) {
        let self = this
        this.timer = setTimeout(function() {
          self.clicks = 0
        }, this.delay);
      } else{
        clearTimeout(this.timer);  
        this.$emit("dbclicked", this.item_name, this.item_type)
        this.clicks = 0;
      }
    }
  }
}
</script>

<style scoped>
</style>