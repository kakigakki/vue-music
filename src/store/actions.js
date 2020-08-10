import * as types from "./mutationType";

export default {
  selectPlaySong({ commit, state }, { list, index }) {
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING, true)
    commit(types.SET_FULLSCREEN, true)
  }
};