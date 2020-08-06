import Vue from "vue";
import VueRouter from "vue-router";
import Recommand from "../views/recommand/Recommand.vue";
import Rank from "../views/rank/Rank.vue";
import Search from "../views/search/Search.vue";
import Singer from "../views/singer/Singer.vue";
import SingerDetail from "../views/singer/subView/singerDetail.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    redirect: "/recommend"
  },
  {
    path: "/recommend",
    name: "Recommend",
    component: Recommand
  },
  {
    path: "/rank",
    name: "Rank",
    component: Rank
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/singer",
    name: "Singer",
    component: Singer,
    children: [{
      path: ":id",
      component: SingerDetail
    }]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;