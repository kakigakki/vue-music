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
    },
    addToPlaylist({ commit, state, dispatch }, song) {
        const { playlist, seqlist, currentIndex } = state
        if (!playlist.length && !seqlist.length) {
            let list = [song]
            let index = 0
            dispatch("selectPlaySong", { list, index })
        } else {
            /* playlist操作 */
            let newPlaylist = playlist.slice()
            let newIndex = currentIndex + 1
                //判断点击歌曲是否已经存在在歌单中
            let deleteIndex = playlist.findIndex((item) => {
                    return item.name === song.name
                })
                //如果存在，删除歌曲
            if (deleteIndex > -1) {
                //如果插入歌曲与待删除歌曲相同，则结束
                if (deleteIndex === newIndex) {
                    commit(types.SET_PLAYING, true)
                    commit(types.SET_FULLSCREEN, true)
                    return
                }
                //删除歌曲
                newPlaylist.splice(deleteIndex, 1)
                    //插入歌曲在待删除歌曲的后面,则插入位置的Index需要-1
                if (newIndex >= deleteIndex) {
                    newIndex--
                }
            }
            //把点击歌曲插入到当前播放歌曲的下一首
            newPlaylist.splice(newIndex, 0, song)
            console.log(newPlaylist, newIndex);

            /* seqlist操作 */
            let newSeqlist = seqlist.slice()
            let newIndex_seq = currentIndex + 1
                //判断点击歌曲是否已经存在在歌单中
            let deleteIndex_seq = seqlist.findIndex((item) => {
                    return item.name === song.name
                })
                //如果存在，删除歌曲
            if (deleteIndex_seq > -1) {
                //删除歌曲
                newSeqlist.splice(deleteIndex_seq, 1)
                    //插入歌曲在待删除歌曲的后面,则插入位置的Index需要-1
                if (newIndex_seq >= deleteIndex_seq) {
                    newIndex_seq--
                }
            }
            //把点击歌曲插入到当前播放歌曲的下一首
            newSeqlist.splice(newIndex_seq, 0, song)
            console.log(newSeqlist, newIndex_seq);

            //设置播放列表
            commit(types.SET_PLAYLIST, newPlaylist)
                //设置新的index
            commit(types.SET_CURRENT_INDEX, newIndex)
                //设置顺序列表
            commit(types.SET_SEQLIST, newSeqlist)
            commit(types.SET_PLAYING, true)
            commit(types.SET_FULLSCREEN, true)
        }
    }

};