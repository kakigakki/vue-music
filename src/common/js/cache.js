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