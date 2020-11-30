<template>
  <div class="loading" ref="loading" >
    <div class="wrap">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <p class="title">{{ title }}</p>
  </div>
</template>


<script>

import {prefixStyle} from "common/js/dom"
const TRANSFORM = prefixStyle("transform")
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    size:{
      type:Number,
      default:1
    }
  },
  mounted(){
      this.$refs.loading.style[TRANSFORM] = `scale(${this.size})`
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.loading {
  text-align: center;
  width: 100%;

  .title {
    line-height: 20px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }

  .bar {
    width: 7px;
    height: 24px;
    display: inline-block;
    animation: loading 1s ease-in-out infinite;
    transform-origin: bottom center;
  }

  .bar:nth-child(1) {
    animation-delay: 0.1s;
  }

  .bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .bar:nth-child(3) {
    animation-delay: 0.3s;
  }

  .bar:nth-child(4) {
    animation-delay: 0.4s;
  }

  .bar:nth-child(5) {
    animation-delay: 0.5s;
  }

  .bar:nth-child(6) {
    animation-delay: 0.6s;
  }

  @keyframes loading {
    0% {
      transform: scaleY(0.1);
      background-color: $color-sub-theme;
    }

    50% {
      transform: scaleY(1);
      background-color: lighten($color-theme, 30%);
    }

    100% {
      transform: scaleY(0.1);
      background-color: $color-sub-theme;
    }
  }
}
</style>