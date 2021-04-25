<template>
  <div>
    Blank Page<br>
		Page not found.
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
  },
  watch:{
    '$route'(to , from) {
      this.$router.go(0)
      to;from;
    },
  },
  computed:{
    fullHeight(){
      return this.$store.state.fullHeight
    },
    fullWidth(){
      return this.$store.state.fullWidth
    },
    theme(){
      return this.$store.state.theme
    },
  },
  methods:{
  }
}
</script>

<style scoped>
</style>