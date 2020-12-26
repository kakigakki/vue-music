<template>
  <transition name="fade">
    <div class="dialog-wrapper" @click="hideDialog" v-if="isShow">
      <div class="dialog" @click.stop="stopBubbel">
        <p class="text">{{ dialogText }}</p>
        <div class="button">
          <span class="left" @click.stop="clickNo">{{ confirmText }}</span>
          <span class="right" @click.stop="clickYes">{{ cancelText }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    confirmText: {
      type: String,
      default: "Cancel",
    },
    cancelText: {
      type: String,
      default: "Yes",
    },
    dialogText: {
      type: String,
      default: "Are you sure to delete all?",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hideDialog() {
      this.$emit("hideDialog");
    },
    stopBubbel() {
      return;
    },
    clickYes() {
      this.$emit("clickYes");
    },
    clickNo() {
      this.$emit("clickNo");
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  height: 100vh;
  width: 100vw;
  background-color: $color-text-d;
  display: flex;
  justify-content: center;
  align-items: center;

  .dialog {
    border-radius: 10px;
    background-color: $color-highlight-background;

    .text {
      font-size: $font-size-medium;
      padding: 20px;
      border-bottom: 1px $color-dialog-background solid;
    }

    .button {
      font-size: $font-size-small;
      display: flex;
      justify-content: space-around;
      align-items: stretch;
      text-align: center;

      .left {
        border-right: 0.5px $color-dialog-background solid;
        padding: 10px 20px;
        flex: 1;
      }

      .right {
        border-left: 0.5px $color-dialog-background solid;
        padding: 10px 20px;
        flex: 1;
      }
    }
  }
}

/* 出场退场动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
