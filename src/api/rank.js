import { qqMusicConfigParam, options } from "./config";
import jsonp from "common/js/jsonp.js"

const debug = process.env.NODE_ENV !== "production";

export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

    const data = Object.assign({}, qqMusicConfigParam, {
        uin: 0,
        needNewCode: 1,
        platform: 'h5',
        format: 'jsonp'
    })

    return jsonp(url, data, options)
}

export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

    const data = Object.assign({}, qqMusicConfigParam, {
        topid,
        needNewCode: 1,
        uin: 0,
        tpl: 3,
        page: 'detail',
        type: 'top',
        platform: 'h5',
        format: 'jsonp'
    })

    return jsonp(url, data, options)
}