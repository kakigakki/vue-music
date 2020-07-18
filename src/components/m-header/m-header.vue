<template>
  <div class="m-header">
    <div class="logo">nnn</div>
    <h1 class="text">KakiMiki Music</h1>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable.styl';
@import '~common/stylus/mixin.styl';

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;

  .logo {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    bg-image('logo');
    background-size: 30px 32px;
  }

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }

  .mine {
    position: absolute;
    right: 0;
    top: 0;

    .icon-mine {
      display: block;
      padding: 12px;
      color: $color-theme;
      font-size: 20px;
    }
  }
}
</style>