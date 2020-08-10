import { getPurlUrl } from "api/song.js";
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    Object.assign(this, { id, mid, singer, name, album, duration, image, url });
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: ""
  });
}

//有时候歌手有多个,需要合并歌手名字
export function filterSinger(singer) {
  if (singer.length <= 1) {
    return singer[0].name;
  }
  if (singer.length > 5) {
    return "群星";
  }
  return singer.reduce((prev, cur) => {
    return prev.name + "/" + cur.name;
  });
}

//判断是否是有效的歌曲
export function isValidSong(musicData) {
  return (
    musicData.songid &&
    musicData.songmid &&
    (!musicData.pay || musicData.pay.paytrackprice === 0)
  );
}

//为每个song对象附上url.注意:url接口在国外的ip地址大部分都请求不到
export function setSongsUrl(songs) {
  return getPurlUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid];
      if (purl) {
        song.url =
          purl.indexOf("http") === -1 ?
          `http://dl.stream.qqmusic.qq.com/${purl}` :
          purl;
        return true;
      }
      return false;
    });
    return songs;
  });
}