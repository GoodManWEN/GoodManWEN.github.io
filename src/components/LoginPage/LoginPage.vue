<template>
  <div class="tw-w-screen tw-h-screen main-background tw-select-none tw-overflow-hidden">
    <div ref="background_image" class="tw-absolute tw-w-full tw-h-full tw-flex tw-flex-col tw-justify-center tw-items-center" v-if="show_keyboard">
      <div style="height:60vh"></div>
      <KeyBoard class="tw-z-20" @vkey_pressed="vkey_pressed"/>
    </div>
    <div ref="content" class="tw-flex tw-flex-col tw-w-full tw-h-full">
      <div ref="background_image" class="tw-absolute tw-w-full tw-h-full tw-flex tw-flex-row tw-justify-center tw-items-center">
          <div class="tw-w-140"></div>
          <img src="../../assets/images/deepin_3.png" alt="" class="tw-w-160" style="opacity:.03;min-width:600px" @load="bgloaded">
      </div>
      <div ref="header" class="tw-w-full tw-h-32 tw-flex-none tw-flex tw-flex-col tw-items-center tw-justify-center  tw-z-10">
        <div class="tw-text-4xl tw-tracking-wider tw-light tw-font-sans">{{PrefixZero(date_hour,2)}}:{{PrefixZero(date_minute,2)}}</div>
        <div class="tw-mt-1.5 tw-text-sm">{{date_year}}/{{date_month}}/{{date_date}} {{date_weekday_display}}</div>
      </div>
      <div ref="middle" class="tw-w-full tw-h-20 tw-flex-grow tw-flex  tw-flex-col tw-justify-center tw-items-center  tw-z-10" style="min-height:300px">
        <div class="tw-w-72 tw-h-40 tw-rounded-xl tw-flex tw-flex-col tw-flex-nowrap" style="background-color:rgba(81,90,156)" v-if="show_middle">
          <div class="tw-h-10 tw-flex 
          tw-justify-center tw-items-end ">
            <div class="tw-h-full " style="width:31%">
              <div class="ratio-container">
                <div class="ratio-content tw-rounded-lg 
                tw-bg-center
                tw-bg-cover" :style="{ backgroundImage: 'url(' + require('@/assets/images/avatar.jpg') + ')' }">
                </div>
              </div>
            </div>
          </div>
          <div class="tw-h-full tw-flex tw-justify-center tw-items-center tw-text-2xl tw-tracking-wide tw-pt-4">{{user_name}}</div>
          <div class=" tw-absolute tw-w-72 tw-h-40 " style="pointer-events:none;">
            <div ref="infinite_bar"  class="tw-absolute tw-rounded-lg " style="bottom:12px;height:38px;width:264px;left:12px" :class="{'process-animation':relay,'tw-hidden':!show_loading_bar}"> </div>
          </div>
          <div class="tw-h-full tw-flex tw-justify-center tw-items-center tw-py-3 tw-px-3">
            <input ref="password_input_bar" v-model="password" @keyup.enter="login_clicked" type="password" placeholder="Enter your password" autofocus autocomplete class="tw-w-full tw-h-full tw-rounded-lg" style="background-color:rgba(180,190,220,.35);outline-color: rgba(0,119,230);text-align: center">
          </div>
        </div>
        <button class="tw-rounded-full tw-w-12 tw-h-12 tw-mt-2 tw-bg-blue-600 tw-flex tw-items-center tw-justify-center hover:tw-bg-blue-700 tw-outline-none animate__animated" v-if="show_middle" @click="login_clicked" :class="{'animate__shakeX':button_shaking}">
          <v-icon class="tw-text-gray-100">mdi-arrow-right</v-icon>
        </button>
        <div v-if="!show_middle" class="tw-h-full tw-w-full  tw-flex tw-flex-row tw-flex-nowrap tw-justify-evenly tw-items-center" style="max-width:650px;min-width:300px" @click="blanker">
          <RestartButton :typename="'shutdown'" @click.native="halt_clicked"/>
          <RestartButton :typename="'restart'" @click.native="restart_clicked"/>
          <RestartButton :typename="'sleep'" @click.native="halt_clicked"/>
        </div>
      </div>
      <div ref="footer" class="tw-w-full tw-h-32 tw-flex-none tw-flex  tw-z-10 tw-flex-wrap">
        <div class="tw-w-76 tw-h-full flex-none tw-flex tw-justify-center tw-items-center" style="min-width:300px">
          <img src="../../assets/images/deepin_text_1.png" alt="" class="tw-w-32">
          <div class="flex-none tw-flex tw-flex-col-reverse tw-pl-3">
            <div class="tw-h-3"></div>
            <div class="tw-absolute tw-text-gray-400">20.2 Community Edition</div></div>
        </div>
        <div class="tw-h-full tw-flex-grow"></div>
        <div class="tw-h-full flex-none tw-w-76 tw-flex tw-justify-center tw-items-center tw-pr-2" style="min-width:300px">
          <button class="tw-rounded-full tw-w-12 tw-h-12 tw-bg-mygray-light hover:tw-bg-mygray-dark active:tw-bg-mygray-darker tw-flex tw-justify-center tw-items-center  tw-outline-none" @click="show_keyboard_clicked()">
            <v-icon class="tw-text-gray-100 "  >mdi-keyboard</v-icon>
          </button>
          <button class="tw-rounded-full tw-w-12 tw-h-12 tw-bg-mygray-light hover:tw-bg-mygray-dark active:tw-bg-mygray-darker ml-8 tw-flex tw-justify-center tw-items-center tw-outline-none" @click="show_middle_clicked">
            <v-icon class="tw-text-gray-100 ">mdi-power</v-icon>
          </button>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script>
import KeyBoard from '../Keyboard/KeyBoard.vue';
import RestartButton from './RestartButton.vue';

const weekdays = new Array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

export default {
  name: 'LoginPage',
  components: {
    KeyBoard,
    RestartButton
  },
  data(){
    return {
      login_locked:false,
      show_keyboard:false,
      show_middle:true,
      date_hour:0,
      date_minute:0,
      date_year:1970,
      date_month:1,
      date_date:1,
      date_weekday:0,
      // user_name:"Observer",
      user_name:"Guest",
      password:"12345678",
      password_answer:"12345678",
      relay:false,
      show_loading_bar:false,
      button_shaking:false,
      timer:null,
      timer2:null,
    }
  },
  created(){
    this.refresh_time()
    window.setInterval(() => {
      this.refresh_time()
    }, 1000);
  },
  mounted(){
    let bar = this.$refs.password_input_bar
    bar

    this.timer = window.setInterval(()=>{
      this.relay = false
      this.$refs.infinite_bar.style.width='0px'
      this.timer2 = window.setTimeout(()=>{
        this.relay = true
        this.$refs.infinite_bar.style.width='264px'
      },200)
    },800)
  },
  watch:{
  },
  computed:{
    date_weekday_display(){
      return weekdays[this.date_weekday]
    }
  },
  methods:{
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    login_clicked(){
      // pw check
      if (this.password === this.password_answer) {
        // correct password
        this.login_locked = false;
        this.show_loading_bar = true
        window.setTimeout(()=>{
          this.show_loading_bar = false
          clearInterval(this.timer)
          clearTimeout(this.timer2)
          this.$router.push({
            name: 'Desktop',
          })
          // full screeen
          let elem = document.getElementById('app')
          elem.requestFullscreen();
        },1800)
        return
      } else if (this.password === "") {
        this.login_locked = true;
        for (let i=0;i<this.password_answer.length;i++) {
          window.setTimeout(() => {
            this.password += this.password_answer[i]
            if (i === (this.password_answer.length - 1)) {
              this.login_clicked()
            }
          }, 100 * i)
        }
      } else {
        // wrong password
        this.show_loading_bar = true
        window.setTimeout(()=>{
          this.show_loading_bar = false
          this.button_shaking = true
        },3000)
        window.setTimeout(()=>{
          this.button_shaking = false
        },3800)
      }
    },
    vkey_pressed(key, upperscale){
      if (this.login_locked) {
        return
      }
      // functional keys only enter-left-right-delete has function
      this.$refs.password_input_bar.focus()
      if (key === 'QT') {
        key = "'"
      } else if (key === 'DH') {
        key = ','
      } else if (key === 'JH') {
        key = '.'
      } else if (key === 'SPACE') {
        key = ' '
      } else if (key === 'BAK') {
        let cur = this.$refs.password_input_bar.selectionStart
        this.password = this.password.substr(0,Math.max(0,cur-1)) + this.password.substr(cur,this.password.length - cur)
        return
      } else if (key === 'LEFT') {
        let cur = this.$refs.password_input_bar.selectionStart
        this.$refs.password_input_bar.selectionStart = this.$refs.password_input_bar.selectionEnd = Math.max(cur - 1,0)
        return
      } else if (key === 'RIGHT') {
        let cur = this.$refs.password_input_bar.selectionStart
        this.$refs.password_input_bar.selectionStart = this.$refs.password_input_bar.selectionEnd = Math.min(cur + 1,this.password.length)
        return
      } else if (key === 'ENTER') {
        this.login_clicked()
        return
      }
      let keykey = key.length ==1?key:upperscale?key.toUpperCase():key.toLowerCase();
      if ((!this.login_locked) && keykey.length === 1) {
        let cur = this.$refs.password_input_bar.selectionStart
        this.password = this.password.substr(0,cur) + keykey + this.password.substr(cur,this.password.length - cur)
      }   
    },
    show_keyboard_clicked(){
      this.show_keyboard = !this.show_keyboard
    },
    show_middle_clicked(){
      this.show_middle = !this.show_middle
      if (this.show_middle) {
        this.login_locked = false
      } else {
        this.login_locked = true
      }
    },
    blanker(){
      if (this.show_middle) {
        return
      } else {
        this.show_middle_clicked()
      } 
    },
    refresh_time() {
      let date = new Date();
      this.date_year = date.getFullYear();
      this.date_month = date.getMonth() + 1;
      this.date_date = date.getDate();
      this.date_weekday = date.getDay() - 1;
      this.date_hour = date.getHours();
      this.date_minute = date.getMinutes();
    },
    bgloaded(){
      let ctime = (new Date()).getTime()
      let time_diff = Math.max(ctime - this.$store.state.start_load_time,0)
      if ( isNaN(time_diff) || time_diff === undefined || time_diff === null) {
        time_diff = 0
      }
      let wait_time = Math.max(1800 - time_diff,0)
      window.setTimeout(()=>{
        this.$store.commit('hide_interlude')
      }, wait_time)
    },
    restart_clicked(){
      location.reload();
    },
    halt_clicked(){
      document.body.style.cursor='progress'
      window.setTimeout(()=>{
        document.body.style.cursor='default'
        this.$router.push({
          name: 'Down',
        })
      },800)
    }
  }
}
</script>

<style scoped>
.main-background{
  background-image: linear-gradient(to bottom right, rgba(37,18,108), rgba(17,16,118));
  color:white
}

::-webkit-input-placeholder {
  text-align: center;
  color:rgba(235,235,235,.8);
}

:-moz-placeholder { /* Firefox 18- */
  text-align: center;  
  color:rgba(235,235,235,.8);
}

::-moz-placeholder {  /* Firefox 19+ */
  text-align: center;  
  color:rgba(235,235,235,.8);
}

:-ms-input-placeholder {  
  text-align: center; 
  color:rgba(235,235,235,.8);
}

.ratio-container {
  width: 100%;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  position: relative; /* If you want text inside of it */
  bottom:125%;
}

/* If you want text inside of the container */
.ratio-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.process-animation {
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#f5f7f8), color-stop(0.5,#b9b9bb), to(#ebeef0));
  -webkit-border-radius: 10px;
  -webkit-transition: width 0.6s ease-in-out;
  opacity:0.14
}
</style>
