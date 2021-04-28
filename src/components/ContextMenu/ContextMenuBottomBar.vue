<template>
  <div class="tw-w-44 tw-h-20  tw-absolute tw-rounded-xl tw-overflow-hidden tw-border tw-border-gray-400 tw-select-none" style="z-index:9999;backdrop-filter: blur(35px);box-shadow: 0 0 10px rgba(16,16,16,.3)" @click="fullclicked($event)" :style="{'left':context_menu_x+'px', 'top':context_menu_y_r +'px'}">
    <div class="tw-absolute tw-w-full tw-h-full tw-py-2 tw-flex tw-flex-col" style="background-color:rgba(235,235,235,.7)">
      <ContextMenuButton v-if="!mode" :text="'Open'" @click.native="open_new_window"/>
      <ContextMenuButton v-if="mode" :text="'Switch Visibility'" @click.native="switch_visibility"/>
      <ContextMenuButton :disabled="!mode" :text="'Close All'" @click.native="close_all"/>
    </div>
  </div>
</template>

<script>
import ContextMenuButton from './ContextMenuButton.vue'
export default {
  name: 'ContextMenuBottomBar',
  components: {
    ContextMenuButton
  },
  data(){
    return {
      allow_open:[
        'terminal',
        'settings',
        'vscode',
        'music',
        'browser'
      ],
    }
  },
  props:{
    target:{
      type:String,
      default:"terminal",
    },
    mode:{
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
    context_menu_x(){
      return this.$store.state.context_menu_x
    },
    context_menu_y(){
      return this.$store.state.context_menu_y
    },
    context_menu_y_r(){
      return this.context_menu_y - 80
    },
  },
  methods:{
    fullclicked(event){
      // this.$store.commit('hide_context_menu')
      event.stopPropagation()
    },
    open_new_window(){
      if (!this.mode && this.allow_open.indexOf(this.target) >= 0) {
        this.$store.commit('open_new_window', {'type':this.target})
        this.$store.commit('refresh_window_focus', {'type':this.target})
        this.$store.commit('hide_context_menu')
      }
    },
    switch_visibility(){
      if (this.mode) {
        if (this.mode) {
          this.$store.commit('switch_global_window_show_status', {'type':this.target})
        } else {
          this.$store.commit('open_new_window', {'type':this.target})
        }
        this.$store.commit('refresh_window_focus', {'type':this.target})
      }
      this.$store.commit('hide_context_menu')
    },
    close_all(){
      if (this.mode) {
        this.$store.commit('close_global_window_same_type', {'type':this.target})
      }
      this.$store.commit('hide_context_menu')
    }
  }
}
</script>

<style scoped>
</style>