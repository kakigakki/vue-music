
<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
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
      maxBarClientWidth : 0
   }
  },
  props:{
    percent:{
      type:Number,
      default:0
    }
  },
  mounted(){
    //progress进度条的最长宽度
    this.maxBarClientWidth = this.$refs.progressBar.clientWidth-BTN_WIDTH
  },
  watch:{
    percent(nVal){
      //利用百分比求出当前宽度
      this.$refs.progress.style.width = `${nVal*this.maxBarClientWidth}px`
      const progressBarWidth = this.$refs.progress.clientWidth
      this.$refs.progressBtn.style.transform= `translate3d(${progressBarWidth}px,0,0)`
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
