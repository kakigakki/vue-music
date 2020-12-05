<template>
  <div class="tabbar">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">Home</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">Singer</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">Ranking</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">Search</span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.tabbar {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>