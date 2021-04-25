const get_uuid = () => {
  let s4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

const utils = function (Vue) {
  Vue.prototype.$utils = {
    goto:(that , path , query = {})=>{
      if ( path == that.$route.path) {
        that.$router.go(0);
      } else {
        that.$router.push({path:path,query:query});
      }
    },
    dynamic_append_script(url, callback = ()=>{}){
      let script = document.createElement('script')
      script.type = "text/javascript"
      script.src = url
      document.body.appendChild(script)
      script.onload = script.onreadystatechange = callback()
    },
    dynamic_append_link(url, callback = ()=>{}){
      let link = document.createElement('link')
      link.rel = "stylesheet"
      link.href = url
      document.body.appendChild(link)
      link.onload = link.onreadystatechange = callback()
    },
    'get_uuid': get_uuid,
  }
};

export {get_uuid}
export default utils