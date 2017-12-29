function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}
function isFunction (value) {
  return Object.prototype.toString.call(value) === '[object Function]'
}
function isRegExp (value) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}
function isNativeJson (value) {
  return window.JSON && Object.prototype.toString.call(value) === '[object JSON]'
}