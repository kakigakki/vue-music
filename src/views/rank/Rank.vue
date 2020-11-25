<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul v-if="topList">
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <img class="icon" :src="item.picUrl" />
          <ul class="songlist">
            <li
              v-for="(item2, index2) in item.songList"
              :key="index2"
              class="song"
            >
              <span> {{ index2 + 1 }}. </span>
              <span> {{ item2.singername }}-{{ item2.songname }} </span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-if="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import scroll from "components/scroll/myScroll.vue";
import loading from "components/loading/loading.vue";
import { ERR_OK } from "api/config.js";
import { getTopList } from "api/rank.js";
import {mapMutations} from "vuex"
import {playerMixin} from "common/js/mixins.js"
export default {
  mixins:[playerMixin],
  components: {
    scroll,
    loading,
  },
  data() {
    return {
      topList: [],
    };
  },
  created() {
    this._getTopList();
  },
  methods: {
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this._setRandList(item)
    },
    bottomPlayer(){
      console.log(this.getPlaylist);
      if(this.getPlaylist.length>0){
          this.$refs.rank.style.bottom =  this.MINI_PLAYER_HEIGHT+"px"
      }else{
         this.$refs.rank.style.bottom =  0
      }
      this.$refs.scroll.refresh()
    },
    ...mapMutations({
      _setRandList:"SET_RANK_LIST"
    })
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>