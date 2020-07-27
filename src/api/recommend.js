import { qqMusicConfigParam } from "./config";
import axios from "axios";

const debug = process.env.NODE_ENV !== "production";

// 获取轮播图数据
export function getSlider() {
  // 线上环境地址，根据自己的需要配置修改
  const url = debug ?
    "/api/getTopBanner" :
    "http://ustbhuangyi.com/music/api/getTopBanner";

  const data = Object.assign({}, qqMusicConfigParam, {
    data: {
      comm: { ct: 24 },
      focus: {
        module: "QQMusic.MusichallServer",
        method: "GetFocus",
        param: {}
      }
    }
  });

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return res.data;
    });
}

// 获取推荐列表数据
export function getRecommend() {
  const url = debug ?
    "/api/getRecomList" :
    "http://ustbhuangyi.com/music/api/getRecomList";
  const data = Object.assign({}, qqMusicConfigParam, {
    data: {
      comm: {
        ct: 24
      },
      recomPlaylist: {
        method: "get_hot_recommend",
        param: {
          async: 1,
          cmd: 2
        },
        module: "playlist.HotRecommendServer"
      }
    }
  });
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

// 获取最新歌单
export function getNewSongList(pi, ps = 8) {
  const recommendUrl = "/api/getNewSongList";
  const data = {
    ...qqMusicConfigParam,
    data: {
      comm: {
        ct: 24
      },
      new_song: {
        module: "newsong.NewSongServer",
        method: "get_new_song_info",
        param: {
          type: 5
        },
        songlistPage: {
          pi,
          ps
        }
      }
    }
  };
  return axios.get(recommendUrl, { params: data }).then(res => {
    const { pi, ps } = data.data.new_song.songlistPage;
    const s = (pi - 1) * ps;
    const e = pi * ps;
    const newSongList = res.data.new_song.data.songlist.slice(s, e);
    return Promise.resolve({
      code: 0,
      newSongList
    });
  });
}