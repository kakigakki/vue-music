import * as types from "./mutationType";

export default {
    [types.SET_SINGER](state, singer) {
        state.singer = singer;
    },
    [types.SET_PLAYING](state, playState) {
        state.playing = playState
    },
    [types.SET_FULLSCREEN](state, screenState) {
        state.fullScreen = screenState
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list
    },
    [types.SET_SEQLIST](state, list) {
        state.seqlist = list
    },
    [types.SET_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_RANK_LIST](state, rankSongList) {
        state.rankList = rankSongList
    },
    [types.SET_HISTORY](state, historyList) {
        state.history = historyList
    }
};