const axios = require("axios");
const bodyParser = require("body-parser");
const vueAxios = axios.create({
  headers: {
    origin: "https://y.qq.com/",
    "sec-fetch-site": "same-site",
    "access-control-allow-origin": "https://y.qq.com",
    "access-control-expose-headers": "Area",
    referer: "https://c.y.qq.com/"
  },
  timeout: 3000
});

const sendAxiosAjax = (url, params) => {
  return Promise.resolve(
    vueAxios.get(url, {
      params
    })
  );
};
const url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
module.exports = function before(app, server, compiler) {
  // #region 推荐页
  // 获取 qq music 推荐页 slider信息
  app.get("/api/getTopBanner", (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  });

  // 获取 qq music 推荐页 recomPlayList信息
  app.get("/api/getRecomList/", (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  });

  // 获取 歌手的信息
  app.get("/api/getSingerList", (req, res) => {
    const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";
    axios
      .get(url, {
        params: req.query
      })
      .then(response => {
        return res.json(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  });

  // 获取 歌手详情页的歌单信息
  app.get("/api/getSingerSongList", (req, res) => {
    const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  });

  app.post("/api/getPurlUrl", bodyParser.json(), (req, res) => {
    const url = "https://u.y.qq.com/cgi-bin/musicu.fcg";
    axios
      .post(url, req.body, {
        headers: {
          referer: "https://y.qq.com/",
          origin: "https://y.qq.com",
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
      .then(response => {
        res.json(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  });
};