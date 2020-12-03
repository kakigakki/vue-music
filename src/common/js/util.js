//洗牌函数
export function shuffle(list) {
    let _list = list.slice()
    for (let i = 0; i < _list.length; i++) {
        let tempIndex = getRandom(0, i)
        const curValue = _list[i]
        _list[i] = _list[tempIndex]
        _list[tempIndex] = curValue
    }
    return _list
}


//获取包括Min,max的随机整数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(func, delay = 500) {
    let timer
    return function(...arg) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, arg)
        }, delay);
    }
}