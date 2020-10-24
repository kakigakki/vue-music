import * as types from "./mutationType";
import { mode } from "common/js/config.js"
import { shuffle } from "common/js/util.js"

export default {
    //页面选择歌曲时进入此方法
    selectPlaySong({ commit, state }, { list, index }) {
        commit(types.SET_SEQLIST, list)
        if (state.mode === mode.random) {
            //打乱播放列表
            let randomList = shuffle(list)
                //获取点击歌曲在随机播放列表中的index
            let randomIndex = randomList.findIndex((item) => {
                    return item.name === list[index].name
                })
                //设置随机列表
            commit(types.SET_PLAYLIST, randomList)
                //设置新的index
            commit(types.SET_CURRENT_INDEX, randomIndex)
        } else {
            commit(types.SET_PLAYLIST, list)
            commit(types.SET_CURRENT_INDEX, index)
        }
        commit(types.SET_PLAYING, true)
        commit(types.SET_FULLSCREEN, true)
    },
    //页面点击“随机播放全部”时，进入此方法
    randomPlayAll({ commit, state }, list) {
        commit(types.SET_SEQLIST, list)
        commit(types.SET_MODE, mode.random)
            //打乱播放列表
        let randomList = shuffle(list)
            //设置随机列表
        commit(types.SET_PLAYLIST, randomList)
            //设置新的index
        commit(types.SET_CURRENT_INDEX, 0)
        commit(types.SET_PLAYING, true)
        commit(types.SET_FULLSCREEN, true)
    }
};