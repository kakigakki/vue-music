<template>
  <div class="singer">
    <listView :singers="singers" @enterDetail="enterDetail"></listView>
    <router-view></router-view>
  </div>
</template>

<script>
import listView from "components/listView/listView";
import { getSingerList } from "api/singer.js";
import { Singer } from "common/js/singer.js";
import { mapMutations } from "vuex";
const HOT_NAME = "热门";
const HOT_LENGTH = 10;
export default {
  components: {
    listView,
  },
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._getSinger();
  },
  methods: {
    //进入详情页点击事件
    enterDetail(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`,
      });
      //将singer存进vuex,方便详情页使用
      this._setSinger(singer);
    },
    //异步获取歌手们的信息
    _getSinger() {
      getSingerList().then((res) => {
        this.singers = this._normalizeSingers(res.data.list);
      });
    },
    //包装歌手数据
    _normalizeSingers(singers) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      for (let i = 0; i < singers.length; i++) {
        if (i < HOT_LENGTH) {
          map.hot.items.push(
            new Singer(singers[i].Fsinger_mid, singers[i].Fsinger_name)
          );
        } else {
          const key = singers[i].Findex;
          const singer = new Singer(
            singers[i].Fsinger_mid,
            singers[i].Fsinger_name
          );
          if (map[key]) {
            map[key].items.push(singer);
          } else {
            map[key] = {
              title: key,
              items: [singer],
            };
          }
        }
      }
      let hot = [];
      let res = [];
      for (const key in map) {
        if (map[key].title == HOT_NAME) {
          hot.push(map[key]);
        } else if (/[A-z]/.test(key[0])) {
          res.push(map[key]);
        }
      }
      return hot.concat(
        res.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
      );
    },
    //将this._setSinger映射为this.$store.commit('SET_SINGER')
    ...mapMutations({
      _setSinger: "SET_SINGER",
    }),
  },
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>