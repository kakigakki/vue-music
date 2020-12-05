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
            .set("api", resolve("src/api"))
            .set("assets", resolve("src/assets"));
    },
    devServer: {
        before
    },
    publicPath: process.env.NODE_ENV === "production" ? "/kakiMusic" : "/"
};