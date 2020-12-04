import { qqMusicConfigParam } from "./config";
import axios from "axios";

const debug = process.env.NODE_ENV !== "production";

// 获取轮播图数据
export function getSlider() {
    // 线上环境地址，根据自己的需要配置修改
    const url = debug ?
        "/api/getTopBanner" :
        "http://106.55.149.238/api/getTopBanner";

    const data = Object.assign({}, qqMusicConfigParam, {
        data: {
            comm: { ct: 24 },
            focus: {
                module: "QQMusic.MusichallServer",
                method: "GetFocus",
                param: {}
            }
        }
    });

    return axios
        .get(url, {
            params: data
        })
        .then(res => {
            return res.data;
        });
}

// 获取推荐列表数据
export function getDiscList() {
    // 线上环境地址，同学们根据自己的需要配置修改
    const url = debug ? '/api/getDiscList' : 'http://106.55.149.238/api/getDiscList'

    const data = Object.assign({}, qqMusicConfigParam, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

//获取歌单中的歌曲
export function getSongList(disstid) {
    const url = debug ? '/api/getCdInfo' : 'http://106.55.149.238/api/getCdInfo'

    const data = Object.assign({}, qqMusicConfigParam, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}