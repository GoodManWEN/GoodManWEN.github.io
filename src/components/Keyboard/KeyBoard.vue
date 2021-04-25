<template>
  <div class=" tw-py-1.5 tw-px-2 tw-flex tw-flex-col tw-flex-nowrap tw-select-none" style="width:600px;height:200px;background-color:rgba(0,14,40)">
    <div ref="line1" class=" tw-h-11 tw-flex tw-flex-row ">
      <div class="tw-w-11 flex-none"><Key-2 letter="Esc" :key_down_status="KESC" @mousedown.native="mousedown('ESC')" /></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="Q" :key_down_status="KQ" @mousedown.native="mousedown('Q')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="W" :key_down_status="KW" @mousedown.native="mousedown('W')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="E" :key_down_status="KE" @mousedown.native="mousedown('E')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="R" :key_down_status="KR" @mousedown.native="mousedown('R')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="T" :key_down_status="KT" @mousedown.native="mousedown('T')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="Y" :key_down_status="KY" @mousedown.native="mousedown('Y')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="U" :key_down_status="KU" @mousedown.native="mousedown('U')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="I" :key_down_status="KI" @mousedown.native="mousedown('I')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="O" :key_down_status="KO" @mousedown.native="mousedown('O')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="P" :key_down_status="KP" @mousedown.native="mousedown('P')" :upperscale="upperscale"/></div>
      <div class="tw-flex-grow  tw-ml-1"><Key-2 letter="icon_back" :key_down_status="KBAK" @mousedown.native="mousedown('BAK')" /></div>
    </div>
    <div ref="line2" class=" tw-h-11 tw-flex tw-flex-row  tw-mt-1">
      <div class="tw-w-14 flex-none"><Key-2 letter="Tab" :key_down_status="KTAB" @mousedown.native="mousedown('TAB')" /></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="A" :key_down_status="KA" @mousedown.native="mousedown('A')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="S" :key_down_status="KS" @mousedown.native="mousedown('S')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="D" :key_down_status="KD" @mousedown.native="mousedown('D')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="F" :key_down_status="KF" @mousedown.native="mousedown('F')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="G" :key_down_status="KG" @mousedown.native="mousedown('G')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="H" :key_down_status="KH" @mousedown.native="mousedown('H')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="J" :key_down_status="KJ" @mousedown.native="mousedown('J')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="K" :key_down_status="KK" @mousedown.native="mousedown('K')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="L" :key_down_status="KL" @mousedown.native="mousedown('L')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="'" :key_down_status="KQT" @mousedown.native="mousedown('QT')"/></div>
      <div class="tw-flex-grow  tw-ml-1"><Key-2 letter="icon_xxxx" :key_down_status="KXXXX" @mousedown.native="mousedown('XXXX')" /></div>
    </div>
    <div ref="line3" class=" tw-h-11 tw-flex tw-flex-row  tw-mt-1">
      <div class="flex-none" style="width:72px"><Key-2 letter="icon_shift" :key_down_status="KSHIFT" @mousedown.native="mousedown('SHIFT')" /></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="Z" :key_down_status="KZ"  @mousedown.native="mousedown('Z')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="X" :key_down_status="KX" @mousedown.native="mousedown('X')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="C" :key_down_status="KC" @mousedown.native="mousedown('C')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="V" :key_down_status="KV" @mousedown.native="mousedown('V')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="B" :key_down_status="KB" @mousedown.native="mousedown('B')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="N" :key_down_status="KN" @mousedown.native="mousedown('N')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="M" :key_down_status="KM" @mousedown.native="mousedown('M')" :upperscale="upperscale"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="," :key_down_status="KDH" @mousedown.native="mousedown('DH')"/></div>
      <div class="tw-ml-1 tw-w-11 flex-none"><Key letter="." :key_down_status="KJH" @mousedown.native="mousedown('JH')"/></div>
      <div class="tw-flex-grow  tw-ml-1"><Key-2 letter="icon_enter" :key_down_status="KENTER" @mousedown.native="mousedown('ENTER')" /></div>
    </div>
    <div ref="line4" class=" tw-h-11 tw-flex tw-flex-row  tw-mt-1">
      <div class="tw-w-11 flex-none"><Key-2 letter="Ctrl" :key_down_status="KCTRL" @mousedown.native="mousedown('CTRL')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1" v-if="mode==='default'"><Key-2 letter="Win" :key_down_status="KWIN" @mousedown.native="mousedown('WIN')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1" v-if="mode!='default'"><Key-2 letter="" :key_down_status="KWIN" /></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="AlT" :key_down_status="KALT" @mousedown.native="mousedown('ALT')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="12?" :key_down_status="K12" @mousedown.native="mousedown('12')" /></div>
      <div class="tw-w-52 flex-none tw-ml-1"><Key letter="" :key_down_status="KSPACE" @mousedown.native="mousedown('SPACE')"/></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="icon_left" :key_down_status="KLEFT" @mousedown.native="mousedown('LEFT')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="icon_right" :key_down_status="KRIGHT" @mousedown.native="mousedown('RIGHT')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="icon_up" :key_down_status="KUP" @mousedown.native="mousedown('UP')" /></div>
      <div class="tw-w-11 flex-none tw-ml-1"><Key-2 letter="icon_down" :key_down_status="KDOWN" @mousedown.native="mousedown('DOWN')" /></div>
    </div>
    
  </div>
</template>

<script>
import Key from './Key.vue'
import Key2 from './Key2.vue'
export default {
  name: 'KeyBoard',
  components: {
    Key,
    Key2
  },
  data(){
    return {
      upperscale:false,
      tmp_handler:null,
      key_hold:"Q",
      KESC:false,
      KQ:false,
      KW:false,
      KE:false,
      KR:false,
      KT:false,
      KY:false,
      KU:false,
      KI:false,
      KO:false,
      KP:false,
      KBAK:false,
      KTAB:false,
      KA:false,
      KS:false,
      KD:false,
      KF:false,
      KG:false,
      KH:false,
      KJ:false,
      KK:false,
      KL:false,
      KQT:false,
      KXXXX:false,
      KSHIFT:false,
      KZ:false,
      KX:false,
      KC:false,
      KV:false,
      KB:false,
      KN:false,
      KM:false,
      KDH:false,
      KJH:false,
      KENTER:false,
      KCTRL:false,
      KWIN:false,
      KALT:false,
      K12:false,
      KSPACE:false,
      KLEFT:false,
      KRIGHT:false,
      KUP:false,
      KDOWN:false,
    }
  },
  props:{
    mode:{
      type:String,
      default:"default"
    }
  },
  created(){
  },
  mounted(){
  },
  watch:{
  },
  computed:{
  },
  methods:{
    mousedown(key){
      this['K'+key] = true
      this.key_hold = key
      this.tmp_handler = document.onmouseup;
      document.onmouseup = this.mouseup_handler;
    },
    mouseup_handler(){
      this['K'+this.key_hold] = false;
      document.onmouseup = this.tmp_handler;
      if (this.key_hold == 'SHIFT') {
        this.upperscale = !this.upperscale
      }
      this.$emit("vkey_pressed", this.key_hold, this.upperscale)
    },
  }
}
</script>

<style scoped>
</style>