const ARR_MAX_LENGTH = 15
const HISTORY = "searchHistory"

function serialize(val) {
    return JSON.stringify(val)
}

function deserialize(val) {
    if (typeof val !== 'string') {
        return undefined
    }
    try {
        return JSON.parse(val)
    } catch (e) {
        return val || undefined
    }
}

export function setItem(key, value) {
    if (!value) {
        localStorage.removeItem(key)
    }
    localStorage.setItem(key, serialize(value))

}

export function getItem(key, value) {
    if (!localStorage.getItem(key)) {
        return value
    }
    let val = deserialize(localStorage.getItem(key))
    return val ? val : value
}

export function removeItem(key) {
    localStorage.removeItem(key)
}

function insertIntoArray(data, arr, compare) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    } else if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(data)
    if (arr.length > ARR_MAX_LENGTH) {
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index < 0) {
        return
    }
    arr.splice(index, 1)
}


export function saveOneHistory(data) {
    const history = getItem(HISTORY, [])
    insertIntoArray(data, history, (item) => item === data)
    setItem(HISTORY, history)
    return history
}

export function deleteOneHistory(data) {
    const history = getItem(HISTORY, [])
    if (!history.length) return
    deleteFromArray(history, (item) => item === data)
    setItem(HISTORY, history)
    return history
}

export function deleteAllHistory() {
    removeItem(HISTORY)
    return []
}