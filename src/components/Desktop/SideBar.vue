<template>
  <div class="tw-absolute tw-right-0  tw-w-100 tw-p-3 tw-select-none" style="height: calc(100% - 56px);min-height:300px;" :style="{'z-index':show_sidebar_daemon?1000:0}">
    <div 
    :class="{'tw-h-full':true,'tw-w-full':true,'tw-rounded-xl':true, 'animate__animated':true, 'animate__slideInRight':true,'animate__slideOutRight':!show_sidebar, 'tw-overflow-hidden':true}"
    style="backdrop-filter: blur(30px); box-shadow:0 0px 30px rgba(16,16,16,.6)" >
      <div class="tw-h-full tw-w-full tw-rounded-xl tw-flex tw-flex-col tw-items-center tw-border tw-border-gray-500" style="background-color:rgba(235,235,235,.2)">
        <div ref="headline" class=" tw-h-9 tw-w-full tw-flex tw-items-end tw-mt-4 tw-bg-opacity-100">
          <div class="tw-flex-none tw-w-12 tw-h-full tw-flex tw-justify-center tw-items-center tw-pl-3">
            <button class=" tw-w-9 tw-h-9 tw-bg-gray-50 hover:tw-bg-gray-200 tw-rounded-full tw-outline-none active:tw-bg-blue-300" @click="reload_messages(true)">
              <v-icon class="tw-text-blue-400">mdi-bell</v-icon>
            </button>
          </div>
          <div class="tw-flex-grow tw-flex tw-justify-center tw-text-lg tw-font-bold">
            Message Center</div>
          <div class="tw-flex-none tw-w-12 tw-h-full tw-flex tw-justify-center tw-items-center tw-pr-3">
            <button class=" tw-w-9 tw-h-9  hover:tw-bg-gray-200 tw-rounded-full tw-outline-none active:tw-bg-blue-300" @click="clean_messages">
              <v-icon class="tw-text-gray-800" >mdi-delete-sweep</v-icon>
            </button>
          </div>
        </div>
        <div class="tw-pt-4 tw-pb-1 px-3 tw-flex tw-flex-row tw-justify-start tw-flex-none tw-w-full">
          <div class="tw-text-2xl tw-font-extrabold ml-4">News</div>
        </div>
        <div class="tw-w-full  tw-overflow-scroll">
          <Message v-for="(item,i) in articles_display" :key="i" :title="item.title" :content="item.content" :abstract="item.abstract" :time="item.time" :lastedittime="item.lastedittime" :filename="item.filename" :filesrc="item.filesrc" :filesize="item.filesize" @close_triggered="close_triggered" @delete_item="delete_item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Message from './Message.vue'
export default {
  name: 'RightBar',
  components: {
    Message
  },
  data(){
    return {
			show_sidebar: true,
      show_sidebar_daemon: true,
      daemon_timeout:null,
      max_articles: 5,
      articles: {
      },
      articles_display:{
      }
    }
  },
  created(){
  },
  mounted(){
    window.setTimeout(()=>{
      this.reload_messages()
    },2400)
  },
  watch:{
		sidebar_status(val) {
			this.show_sidebar = val
		},
    show_sidebar(val) {
      if (val) {
        if (this.daemon_timeout != null) {
          clearTimeout(this.daemon_timeout)
          this.daemon_timeout = null
        }
        this.show_sidebar_daemon= true
      } else{
        this.daemon_timeout = window.setTimeout(()=>{
          this.show_sidebar_daemon= false
        },800)
      }
    },
    filemap(val) {
      let artical_fulllist = []
      let recursive = (folder, folder_name) => {
        for (let item of folder) {
          if (item.children === undefined) {
            let new_item = JSON.parse(JSON.stringify(item))
            new_item.content = folder_name
            artical_fulllist.push(new_item)
          } else {
            recursive(item.children, item.name)
          }
        }
      }
      recursive(val, "Desktop")
      let sortFunc = (a,b) => {
        if (a.lastedittime > b.lastedittime) {
          return -1
        } else if (a.lastedittime === b.lastedittime) {
          return 0
        } else {
          return 1
        }
      }
      artical_fulllist.sort(sortFunc)
      //
      let loop_end = Math.min(artical_fulllist.length, this.max_articles)
      let now_time = (new Date()).getTime() / 1000
      for (let i=0;i<loop_end;i++) {
        let article = artical_fulllist[i]
        let time_diff = now_time - article.lastedittime
        let time_diff_show = ""
        if (time_diff < 60) {
          time_diff_show = Math.round(Math.max(time_diff,0)) + " seconds ago"
        } else if (time_diff < 3600) {
          time_diff_show = Math.round(time_diff / 60) + " minutes ago"
        } else if (time_diff < (3600 * 24)) {
          time_diff_show = Math.round(time_diff / 3600) + " hours ago"
        } else if (time_diff < (3600 * 24 * 31)) {
          time_diff_show = Math.round(time_diff / (3600 * 24)) + " days ago"
        } else if (time_diff < (3600 * 24 * 31 * 12)) {
          time_diff_show = Math.round(time_diff / (3600 * 24 * 30.5)) + " months ago"
        } else {
          time_diff_show = Math.round(time_diff / (3600 * 24 * 365)) + " years ago"
        }
        this.articles[i]= {
            title: article.title,
            abstract: article.abstract,
            content: article.content,
            time: time_diff_show,
            lastedittime: article.lastedittime,
            filename: article.name,
            filesrc: article.path,
            filesize: article.size,
            hide: false,
        }
      }
    },
  },
  computed:{
		sidebar_status(){
			return this.$store.state.show_sidebar
		},
    not_show_sidebar(){
      return !this.show_sidebar
    },
    filemap(){
      return this.$store.state.filemap
    },
  },
  methods:{
    reload_messages(resettime=false){
      let ignore_since = this.$cookies.get("ignore_since")
      if (ignore_since === undefined) {
        // init
        ignore_since = 0
        this.$cookies.set("ignore_since", "0", "30d")
      } else {
        ignore_since = parseInt(ignore_since)
      }
      if (resettime) {
        this.$cookies.set("ignore_since", "0", "30d")
        ignore_since = 0
      }
      let count = 0;
      let target = new Object()
      for (let key in this.articles) {
        let item = this.articles[key]
        if (item.lastedittime <= ignore_since) {
          continue
        }
        window.setTimeout(() => {
          target[key] = item 
          let new_tar = JSON.parse(JSON.stringify(target))
          this.articles_display = new_tar
          this.refresh_count()
        },(count+1)*400)
        count += 1;
      }count;
      
    },
    clean_messages(){
      if (this.articles_display.length > 0) {
        this.$cookies.set("ignore_since", this.articles_display[0].lastedittime, "30d")
      }
      this.$store.commit('clean_all_messages')
      for (let key of Object.keys(this.articles_display)) {
        this.articles_display[key].hide = true
      }
      this.refresh_count()
    },
    close_triggered(val){
      this.$cookies.set("ignore_since", val.toString(), "30d")
    },
    delete_item(filesrc){
      for (let key of Object.keys(this.articles_display)) {
        let item = this.articles_display[key]
        if (item.filesrc === filesrc) {
          item.hide = true
        }
      }
      this.refresh_count()
    },
    refresh_count(){
      let count = 0
      for (let key of Object.keys(this.articles_display)) {
        let item = this.articles_display[key]
        if (item.hide === false) {
          count += 1
        }
      }
      this.$store.commit("display_article_num_changed", count)
    }
  }
}
</script>

<style scoped>
</style>
