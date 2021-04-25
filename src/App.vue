<template>
  <v-app>
    <router-view v-wechat-title="$route.meta.title" />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data: () => ({
    authed: false,
  }),
  created(){
    this.authed = this.$store.state.authed
    // resize
    window.onresize = () => {
      this.$store.commit('refresh_sizes')
      this.$store.commit('refresh_scroll')
    }
    window.onscroll = () => {
      this.$store.commit('refresh_scroll')
    }

    // nigh mode part
    let theme = this.$cookies.get('theme')
    if (theme == undefined) {
      theme = 'light'
      this.$store.commit('set_lightmode')
      this.$cookies.set('theme',theme,'720d')
    } else {
      this.$store.commit('set_'+ theme +'mode')
    }
  },
  mounted(){
  },
  watch:{
  },
  computed:{
  },
  methods:{
  }
};
</script>
