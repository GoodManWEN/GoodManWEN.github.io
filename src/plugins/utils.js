exports.install = function (Vue) {
  Vue.prototype.$utils = {
    goto:(that , path , query = {})=>{
      if ( path == that.$route.path) {
        that.$router.go(0);
      } else {
        that.$router.push({path:path,query:query});
      }
    },
    dynamic_append_script(url){
      let script = document.createElement('script')
      script.type = "text/javascript"
      script.src = url
      document.body.appendChild(script)
    },
    dynamic_append_link(url){
      let link = document.createElement('link')
      link.rel = "stylesheet"
      link.href = url
      document.body.appendChild(link)
    },
  }
};