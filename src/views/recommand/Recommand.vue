<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper" v-if="sliderItem.length">
        <slider>
          <div v-for="item in sliderItem" :key="item.id">
            <a
              :href="[
                'https://y.qq.com/n/yqq/album/' + item.jump_info.url + '.html'
              ]"
            >
              <img :src="item.pic_info.url" />
            </a>
          </div>
        </slider>
      </div>
    </div>
  </div>
</template>

<script>
import { ERR_OK } from "api/config.js";
import { getSlider } from "api/recommend.js";
import slider from "components/slider/slider";
export default {
  data() {
    return {
      sliderItem: []
    };
  },
  components: {
    slider
  },
  created() {
    this._getSlider();
  },
  methods: {
    _getSlider() {
      getSlider().then(res => {
        console.log(res);
        if (res.code == ERR_OK) this.sliderItem = res.focus.data.content;
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .recommend-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .recommend-item {
          flex: 1 0 30%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin: 5px;

          .icon {
            flex: 0 0 80px;
            width: 100%;

            img {
              width: 100%;
            }
          }

          .text {
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: $font-size-medium;
            color: $color-theme;

            .loading-container {
              position: absolute;
              width: 100%;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
            no-wrap();
          }

          .desc {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            color: $color-text-d;
            no-wrap();
          }
        }

        .interval {
          flex: 0 0 50px;
          text-align: center;
          align-self: center;
          color: $color-text-ll;
          font-size: $font-size-small;
          margin-left: 10px;
        }
      }

      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    .recommend-bottom {
      text-align: center;
      color: $color-text-d;
      font-size: $font-size-medium;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>