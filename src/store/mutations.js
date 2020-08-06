import * as types from "./mutationType";

export default {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  }
};