<template>
  <div class="no-result">
    <p>
      {{ msg }}
    </p>
    <div class="img"></div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: "Nothing",
    },
  },
};
</script>

<style scoped  lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.no-result {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: $color-text-l;
}

.img {
  margin: 20px;
  height: 48px;
  width: 48px;
  filter: grayscale(50%);
  bg-image('wrong');
  background-size: cover;
}
</style>