// vue.config.js
const path = require("path");
const before = require("./qqmusic-data-conf");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"))
      .set("common", resolve("src/common"))
      .set("api", resolve("src/api"));
  },
  devServer: {
    proxy: {
      "/api": {
        target: " https://u.y.qq.com/cgi-bin/musicu.fcg",
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/api": ""
        }
      },
      "/v8": {
        target: "https://c.y.qq.com/v8/fcg-bin/v8.fcg",
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/v8": ""
        }
      },
      "/lyrics": {
        target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          "^/lyrics": ""
        }
      }
    },
    before
  }
};