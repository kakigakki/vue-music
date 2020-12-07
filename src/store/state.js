import { getItem } from "common/js/cache.js"
const HISTORY = "history"
export default {
    singer: [],
    playing: false,
    fullScreen: false,
    playlist: [],
    seqlist: [],
    mode: 0,
    currentIndex: -1,
    disc: [],
    rankList: [],
    history: getItem(HISTORY, [])
};