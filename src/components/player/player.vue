<template>
  <div class="player">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="getPlaylist.length && getFullScreen">
        <div class="background" ref="bgImg"></div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <p class="title" v-html="currentSong.name"></p>
          <p class="subtitle" v-html="currentSong.singer"></p>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img
                  class="image"
                  :src="this.currentSong.image"
                  alt="cd-image"
                  :class="imgRotateCls"
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot active"></div>
            <div class="dot"></div>
          </div>
          <div class="progress-wrapper" v-if="this.$refs.audio">
            <div class="time time-l">{{formatTime(currentTime)}}</div>
             <div class="progress-bar-wrapper"> 
               <progressBar
                :percent="percent"
                @dragProgress="dragProgress"
                @dragEnd="dragEnd"/>
               </div>
            <div class="time time-r">{{formatTime(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-loop"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playCls" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div
        class="mini-player"
        v-show="getPlaylist.length && !getFullScreen"
        @click="openPlayer"
      >
        <div class="icon">
          <div class="imgWrapper">
            <img
              :src="this.currentSong.image"
              alt=""
              height="40"
              width="40"
              :class="imgRotateCls"
            />
          </div>
        </div>
        <div class="text">
          <p class="name" v-html="currentSong.name"></p>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniPlayCls" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @playing="ready"
      @error="error"
      @timeupdate="timeUpdate"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import progressBar from "../progressBar/progressBar"
export default {
  data() {
    return {
      currentSong: {},
      isSongReady: false,
      currentTime:0
    };
  },
  components:{
    progressBar
  },
  computed: {
    ...mapGetters([
      "getPlayingState", //播放状态
      "getPlaylist", //播放列表
      "getCurrentIndex", //当前歌曲索引
      "getFullScreen", //是否全屏
    ]),
    playCls() {
      //全屏的播放或暂停图标
      return this.getPlayingState ? "icon-pause" : "icon-play";
    },
    miniPlayCls() {
      //托盘的播放或暂停图标
      return this.getPlayingState ? "icon-pause-mini" : "icon-play-mini";
    },
    imgRotateCls() {
      //播放时图片旋转
      return this.getPlayingState ? "play" : "play pause";
    },
    disableCls() {
      return this.isSongReady ? "" : "disable";
    },
    percent(){
      return this.currentTime/this.currentSong.duration
    }
  },
  watch: {
    getCurrentIndex(nVal) {
      this.currentSong = this.getPlaylist[nVal];
      this.$refs.bgImg.style.backgroundImage = `url("${this.currentSong.image}")`;
    },
    currentSong() {
      this.$nextTick(() => {
        //DOM更新完后再进行播放歌曲操作
        this.setPlaying(true);
      });
    },
    getPlayingState(nVal) {
      this.$nextTick(() => {
        //DOM更新完后再进行播放歌曲操作
        const audio = this.$refs.audio;
        nVal ? audio.play() : audio.pause();
      });
    },
  },
  methods: {
    back() {
      this.setFullScreen(false);
    },
    openPlayer() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      console.log(x, y, scale);
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0),scale(1.2)`,
        },
        100: {
          transform: `translate3d(0,0,0),scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "enter",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });
      animations.runAnimation(this.$refs.cdWrapper, "enter", done);
    },
    afterEnter(el) {
      animations.unregisterAnimation("enter");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        100: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
      };
      animations.registerAnimation({
        name: "leave",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });
      animations.runAnimation(this.$refs.cdWrapper, "leave", done);
    },
    afterLeave(el) {
      animations.unregisterAnimation("leave");
      this.$refs.cdWrapper.style.animation = "";
    },
    togglePlaying() {
      this.setPlaying(!this.getPlayingState);
    },
    next() {
      //下一首歌
      //如果当前歌曲没有准备好,无法点击
      if (!this.isSongReady) {
        return;
      }
      //将当前歌曲暂停后再跳到下一首歌曲,否则无法检测到playingState发生变化
      this.setPlaying(false);
      const nextIndex = this.getCurrentIndex + 1;
      if (nextIndex === this.getPlaylist.length) {
        this.setCurrentIndex(0);
      } else {
        this.setCurrentIndex(nextIndex);
      }
      this.isSongReady = false;
    },
    prev() {
      //上一首歌
      if (!this.isSongReady) {
        return;
      }

      const prevIndex = this.getCurrentIndex - 1;
      this.setPlaying(false);
      if (prevIndex === -1) {
        this.setCurrentIndex(this.getPlaylist.length);
      } else {
        this.setCurrentIndex(prevIndex);
      }
      this.isSongReady = false;
    },
    ready() {
      this.isSongReady = true;
    },
    error() {
      //防止播放歌曲出错时,isSongReady一直处于false状态,无法继续播放下一首
      this.isSongReady = true;
    },
    _getPosAndScale() {
      //获取大图与小图之间的x,y
      const miniLeft = 20;
      const miniBottom = 10;
      const normalTop = 85;
      const miniWidth = 40;
      const normalWidth = window.innerWidth * 0.8;
      const diffX = -(window.innerWidth / 2 - miniLeft - miniWidth / 2);
      const diffY =
        window.innerHeight -
        normalTop -
        normalWidth / 2 -
        miniBottom -
        miniWidth / 2;
      const diffScale = miniWidth / normalWidth;
      return {
        x: diffX,
        y: diffY,
        scale: diffScale,
      };
    },
    //格式化时间
    formatTime(sec){
      const min = ((sec/60 | 0)+"").padStart(2,"0")
      const seconds = ((sec%60 |0)+"").padStart(2,"0")
      return `${min}:${seconds}` 
    },
    timeUpdate(e){
      this.currentTime = e.target.currentTime
    },
    dragProgress(percent){
      //只是修改界面上的时间进度，不改变歌曲时间
      this.currentTime = this.currentSong.duration*percent |0
    },
    dragEnd(percent){
         //修改歌曲时间
      this.$refs.audio.currentTime = this.currentSong.duration*percent |0
    },
    ...mapMutations({
      setFullScreen: "SET_FULLSCREEN",
      setPlaying: "SET_PLAYING",
      setCurrentIndex: "SET_CURRENT_INDEX",
    }),
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .play {
              animation: rotate 20s linear infinite;
            }

            .pause {
              animation-play-state: paused;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 35px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align left
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>