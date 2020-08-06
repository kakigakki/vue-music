let _uid = 0;
export function getUid() {
  if (_uid) {
    return _uid;
  }
  if (!_uid) {
    //从qq官网拿到的设置随机的uid值,保证参数一样
    const t = new Date().getUTCMilliseconds();
    _uid = "" + ((Math.round(2147483647 * Math.random()) * t) % 1e10);
  }
  return _uid;
}