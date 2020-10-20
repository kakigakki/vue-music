
<template>
  <div class="progress-bar" ref="progressBar" @touchstart.prevent="changeProgress">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent.stop="touchStart"
      @touchmove.prevent="touchMove"
      @touchend.prevent="touchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
const BTN_WIDTH = 15
export default {
  data(){
   return {
      maxBarClientWidth : 0,
      touchData:{
        initPos:0,
        isTouchMove:false,
        percent:0
      },
     
   }
  },
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  mounted(){
    //progress进度条的最大宽度
    this.maxBarClientWidth = this.$refs.progressBar.clientWidth-BTN_WIDTH
    //总进度条到最左边边框的距离
    this.progressBarClientX =this.$refs.progressBar.getBoundingClientRect().x
  },
  watch:{
    percent(nVal){
      //当按钮被拖动时，取消自动更新进度条长度
      if(!this.touchData.isTouchMove){
         //利用百分比自动求出当前进度条的宽度
           this.setProgress(nVal*this.maxBarClientWidth)
      }
    }
  },
  methods:{
    //设置当前进度条长度与按钮的位置
    setProgress(length){
       this.$refs.progress.style.width = `${length}px`
       this.$refs.progressBtn.style.transform= `translate3d(${length}px,0,0)`
    },
    touchStart(e){
      console.log(e.touches[0].pageX);
      //获取总进度条距离左边边框的距离
      this.touchData.initPos = e.touches[0].pageX-this.progressBarClientX
       //开始拖动时，标记
      this.touchData.isTouchMove = true
    },
    touchMove(e){
      //进度条的长度不能小于0，且不能大于总进度条的长度
       let moveDis = Math.min(this.maxBarClientWidth,Math.max(0,e.touches[0].pageX-this.progressBarClientX))
       this.touchData.percent = moveDis/this.maxBarClientWidth
       this.$emit("dragProgress", this.touchData.percent)
       this.setProgress(moveDis)
      
    },
    touchEnd(e){
      this.$emit("dragEnd",this.touchData.percent)
       //结束拖动时，标记
      this.touchData.isTouchMove = false
    },
    changeProgress(e){
     let jumpDis = e.touches[0].pageX-this.progressBarClientX
     console.log(jumpDis);
       this.touchData.percent = jumpDis/this.maxBarClientWidth
      this.$emit("dragEnd",this.touchData.percent)
     this.setProgress(jumpDis)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
