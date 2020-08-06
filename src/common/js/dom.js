/* 自定义一个兼容各类浏览器的css方法 */
//创建当前浏览器的style对象
let elementStyle = document.createElement("div").style
  //返回当前浏览器供应商
let vendor = (() => {
  const transformName = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "transform"
  }
  for (const key in transformName) {
    if (elementStyle[transformName[key]] !== undefined) {
      return key
    }
  }
  return false
})()

//根据供应商添加前缀
export function prefixStyle(style) {
  if (!vendor) {
    return false
  }
  if (vendor === "standard") {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.slice(1)
}