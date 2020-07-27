import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fastclick from "fastclick";
import lazyload from "vue-lazyload";

import "common/stylus/index.styl";

Vue.config.productionTip = false;
//图片懒加载
Vue.use(lazyload, {
  preLoad: 1,
  loading: require("assets/Music note.png")
});
fastclick.attach(document.body);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");