<template>
  <Window :uuid='uuid' :startpos_x="startpos_x" :startpos_y="startpos_y" :zindex="zindex" :blacktheme="true" @height_changed="height_changed" :minimized="minimized">
    <template v-slot:header>
      <div class="tw-flex tw-items-center tw-select-none" style="pointer-events:none;"> 
        <img src="../../assets/images/icons/shell.png" alt="" style="pointer-events:none;" class=" tw-w-8 tw-h-7 tw-ml-4">
        <div class=" tw-ml-4 tw-font-semibold tw-tracking-wider tw-h-8 tw-rounded-lg tw-px-4 tw-py-1  tw-text-white tw-bg-mygray-b13 hover:tw-bg-mygray-b14 " style="pointer-events:auto;max-width:300px;white-space:nowrap;text-overflow: ellipsis;overflow: hidden;"> guest@wen-PC: ~/ </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="tw-w-full tw-h-full tw-flex tw-flex-col tw-font-semibold tw-text-white  tw-leading-7 tw-tracking-wide tw-ml-1">
        <textarea v-model="input_text" ref="textarea_ele" rows="102400" style="height:530px;resize:none;" class=" tw-outline-none change-srollbar" autofocus @keydown="messageSendlisten" @contextmenu.prevent="mr_clicked()"></textarea>
      </div>
    </template>
  </Window>
</template>

<script>
import Window from '../WindowBasic/Window.vue'

export default {
  name: 'WindowTerminal',
  components: {
    Window,
  },
  data(){
    return {
      input_text:"",
      protection_length:17,
      path_stack:[],
      history_cmd_stack:[],
      history_cmd_index:-1,
      HISTSIZE:99,
      terminal_bonus: false
    }
  },
  props:{
    uuid:String,
    startpos_x:{
      default:60,
    },
    startpos_y:{
      default:60
    },
    zindex:{
      type:Number,
      default:999,
    },
    minimized:{
      type:Boolean,
      default:false,
    },
  },
  created(){
  },
  mounted(){ 
    this.input_text += this.header
  },
  watch:{
  },
  computed:{
    filemap(){
      return this.$store.state.filemap
    },
    header(){
      let res = "guest@wen-PC: ~/"
      for (let dir of this.path_stack) {
        res += (dir + '/')
      }
      res += ' '
      return res
    }
  },
  methods:{
    height_changed(val) {
      this.$refs.textarea_ele.style.height = (val - 70) + 'px'
      window.setTimeout(()=>{
        let textarea = this.$refs.textarea_ele;
        textarea.scrollTop = textarea.scrollHeight;
      },150)
    },
    messageSendlisten(event) {
      if (event.keyCode === 13) {
        //apply cmd
        event.preventDefault(); 
        this.new_cmd_commit()
        this.history_cmd_index=-1
      } else if (event.keyCode === 8) {
        //backspace
        event.preventDefault(); 
        this.trim_end()
      } else if (event.keyCode === 38||event.keyCode === 40){
        //resume history cmd
        event.preventDefault();
        this.cmd_backtracking(event)
      } else {
        //input chars
        let cursor_start = this.$refs.textarea_ele.selectionStart;
        while (cursor_start < this.protection_length) {
          this.$refs.textarea_ele.selectionStart += 1
          cursor_start += 1
        }
      }
      window.setTimeout(()=>{
        let textarea = this.$refs.textarea_ele;
        textarea.scrollTop = textarea.scrollHeight;
      },150)
    },
    trim_end(){
      if (this.input_text.length > this.protection_length) {
        this.input_text = this.input_text.substring(0,this.input_text.length - 1);
      }
    },
    new_cmd_commit(){
      let words = this.input_text.substring(this.protection_length,this.input_text.length);
      this.protection_length += words.length
      words = words.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      //add to command history
      if (words.length > 0 && words != this.history_cmd_stack[-1]) {
        this.history_cmd_stack.length>=this.HISTSIZE&&this.history_cmd_stack.pop()
        this.history_cmd_stack.unshift(words)
      }
      // bonus
      if (this.terminal_bonus) {
        return 
      }
      if ((words.length === 8) && (words.substr(0, 6)==='rm -rf')) {
        document.body.style.cursor='progress'
        this.push_output("")
        this.terminal_bonus = true
        window.setTimeout(()=>{
          document.body.style.cursor='default'
          this.$router.push({
            name: 'Down',
          })
        },2800)
        return 
      }

      // Normal handling
      if (words.length === 0) {
        this.push_output("")
        this.cmd_reset()
        return
      }
      let cmd = ''
      let remain = ''
      let cmd_drain = false
      for (let char of words) {
        if (char != ' ') {
          if (!cmd_drain) {
            cmd += char
          } else {
            remain += char
          }
        } else {
          if (cmd_drain) {
            remain += char
          } else {
            cmd_drain = true
          }
        }
      }
      if (cmd === 'ls') {
        let current_pointer = this.filemap
        for (let dir of this.path_stack) {
          for (let path of current_pointer) {
            if (path.name === dir) {
              current_pointer = path.children
              break
            }
          }
        }
        let res = []
        for (let item of current_pointer) {
          res.push(item.name)
        }
        res.sort()
        res = res.map((x)=>x.indexOf(' ')<0?x:'"'+x+'"')
        if (res.length == 0) {
          this.push_output("")
        } else {
          this.push_output("")
          this.push_output(res.join('    '))
        }
        this.cmd_reset()
      } else if (cmd === 'cd') {
        if (/".+?"/.exec(remain) != null) {
          let tmp = /".+?"/.exec(remain)[0]
          remain = tmp.substr(1,tmp.length - 2)
        } else if (remain.indexOf(' ') > 0) {
          remain = remain.substr(0,remain.indexOf(' '))
        }
        let current_pointer = this.filemap
        for (let dir of this.path_stack) {
          for (let path of current_pointer) {
            if (path.name === dir) {
              current_pointer = path.children
              break
            }
          }
        }
        
        if (remain === '.') {
          this.push_output("")
          this.cmd_reset()
          return
        } else if (remain === '..') {
          this.push_output("")
          if (this.path_stack.length >= 1) {
            this.path_stack.pop()
          } else {
            this.push_output("")
            this.push_output("There's no super directory.")
          }
          this.cmd_reset()
        } else if (remain === '') {
          this.path_stack = []
          this.push_output("")
          this.cmd_reset()
        } else {
          let current_pointer = this.filemap
          for (let dir of this.path_stack) {
            for (let path of current_pointer) {
              if (path.name === dir) {
                current_pointer = path.children
                break
              }
            }
          }
          for (let item of current_pointer) {
            if (item.name === remain) {
              if (item.children === undefined) {
                this.push_output("")
                this.push_output("CD's target must be a directory.")
                this.cmd_reset()
                return
              } else {
                this.path_stack.push(item.name)
                this.push_output("")
                this.cmd_reset()
                return
              }
            }
          }
          // not found
          this.push_output("")
          this.push_output('No such file or directory named "'+remain+'".')
          this.cmd_reset()
        }
      } else if (cmd === 'cat') {
        if (/".+?"/.exec(remain) != null) {
          let tmp = /".+?"/.exec(remain)[0]
          remain = tmp.substr(1,tmp.length - 2)
        } else if (remain.indexOf(' ') > 0) {
          remain = remain.substr(0,remain.indexOf(' '))
        }
        let current_pointer = this.filemap
        for (let dir of this.path_stack) {
          for (let path of current_pointer) {
            if (path.name === dir) {
              current_pointer = path.children
              break
            }
          }
        }
        for (let item of current_pointer) {
          if (item.name === remain) {
            if (item.children === undefined) {
              this.$store.commit('open_new_window', {
                type:'text',
                filesrc: item.path,
                filename: item.name,
                size: item.size,
              })
              this.push_output("")
              this.cmd_reset()
              return
            } else {
              console.log(item)
              this.push_output("")
              this.push_output("")
              this.push_output("Can not use cat command for checking out directories.")
              this.cmd_reset()
              return
            }
          }
        }
        this.push_output("")
        this.push_output('No such file or directory named "'+remain+'".')
        this.cmd_reset()
      } else if (cmd === 'halt') {
        document.body.style.cursor='progress'
        this.push_output("")
        window.setTimeout(()=>{
          document.body.style.cursor='default'
          this.$router.push({
            name: 'Down',
          })
        },2000)
      } else if (cmd === 'clear') {
        this.input_text = this.header
        this.protection_length = this.header.length
      } else {
        this.push_output("")
        this.push_output("")
        this.push_output("Command "+cmd+" not found or not yet implemented.")
        this.push_output("Current available commands: ['ls', 'cd', 'cat', 'clear' ,'halt'].")
        this.cmd_reset()
      }
    },
    cmd_backtracking(e){
      if (this.terminal_bonus) {
        return 
      }

      const hisLen = this.history_cmd_stack.length
      if(hisLen===0){
        return;
      }
      let nextHisIndex = e.keyCode === 38?this.history_cmd_index+1:this.history_cmd_index-1;
      if(nextHisIndex>=hisLen){
        nextHisIndex=hisLen-1;
      }
      if(nextHisIndex<0){
        nextHisIndex=0;
      }
      const hisCmd = this.history_cmd_stack[nextHisIndex]
      this.input_text = this.input_text.substr(0,this.protection_length)//replace last line with header
      this.input_text += hisCmd
      this.history_cmd_index=nextHisIndex
    },
    push_output(val){
      this.input_text += val + '\n'
      this.protection_length += val.length + 1
    },
    cmd_reset(){
      this.input_text += this.header
      this.protection_length += this.header.length
    },
    mr_clicked(){
      document.execCommand('copy') // copy currrent focus element content to copy board
      // the following selecting code is unnecessary
      let tmp = this.input_text.substring(this.$refs.textarea_ele.selectionStart,this.$refs.textarea_ele.selectionEnd);tmp
      this.$refs.textarea_ele.selectionStart = this.input_text.length
    }
  }
}
</script>

<style scoped>
.change-srollbar{
  left:0;
  margin-right:3px;
}
.change-srollbar::-webkit-scrollbar {/*滚动条整体样式*/
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 6px;
  scrollbar-arrow-color:red;

}
.change-srollbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 7px rgba(0,0,0,0.3);
  background: rgba(0,0,0,0.3);
  scrollbar-arrow-color:red;
}
.change-srollbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 7px rgba(0,0,0,0.2); */
  border-radius: 0;
  /* background: rgba(0,0,0,0.1); */
}
</style>
