const cget = (key) => {
  if (typeof(key)=='string'){
    let all = document.cookie.split(';')
    .map((_)=>{
      return [_.substr(0 , _.indexOf('=')) , _.substr(_.indexOf('=') + 1 , _.length - 1)]
      .map(res => res.replace(/^\s\s*/, '').replace(/\s\s*$/, ''))
    })
    for (let item of all){
      if (item[0] == key) {
        return item[1]
      }
    }
    return undefined
  }
}

const cookies = function (Vue) {
  Vue.prototype.$cookies = {
    get:cget,
    set(key , value , exp , path = '/'){
      /*
        `exp` accepts string or number, both float and integer is ok.
        string should be end with 'm'/'d'/'h', which means month, day, or hour.
        if input string is a pure number without ending, which means seconds.
      */
      if (exp == undefined) {
        document.cookie = key + '=' + this._strip(value) + ';path='+path+';'
      } else {
        let datetime = new Date();
        let addon = 0;
        let exp_str = exp.toString();
        let exp_flag = exp_str.charAt(exp_str.length - 1);
        if (exp_flag == 'm') {
          addon = 60 * parseFloat(exp_str.substring(0 , exp_str.length - 1)) * 1000
        } else if (exp_flag == 'h') {
          addon = 3600 * parseFloat(exp_str.substring(0 , exp_str.length - 1)) * 1000
        } else if (exp_flag == 'd') {
          addon = 24 * 3600 * parseFloat(exp_str.substring(0 , exp_str.length - 1)) * 1000
        } else {
          addon = parseFloat(exp_str) * 1000
        }
        datetime.setTime(datetime.getTime() + addon);
        document.cookie = key + '=' + this._strip(value) + ';expires=' + datetime.toGMTString() + ';path='+path+';'
      }
    },
    remove(key , path = '/'){
      this.set(key , '' , -1 , path)
    },
    keys(){
      return document.cookie.split(';')
      .map((_)=>{
        return this._strip(_.substr(0 , _.indexOf('=')))
      })
    },
    items(){
      return document.cookie.split(';').map((_)=>{
        return [_.substr(0 , _.indexOf('=')) , _.substr(_.indexOf('=') + 1 , _.length - 1)]
        .map(this._strip)
      })
    },
    _strip(str){
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    },
  }
};

export {cget}
export default cookies