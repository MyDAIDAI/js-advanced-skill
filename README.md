# js-advanced-skill
javaScript高级技巧

## 安全的类型检测
`javaScript`的类型检测机制并非完全可靠，并且在某个对象到底是原生对象还是开发人员自定义对象的时候，也会出现问题。
解决办法：在任何值上调用`Object`原生的`toString()`方法，都会返回一个`[object NativeConstructName]`格式的字符串，开发人员定义的任何构造函数都将会返回`[object Object]`，所以可以以此来判断是否是原生js类型
由于原生数组的构造函数与全局作用域无关，因此使用`toString()`就能保证返回一致的值。利用这一点，可以创建如下函数：
```
function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}
function isFunction (value) {
  return Object.prototype.toString.call(value) === '[object Function]'
}
function isRegExp (value) {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}
```
但是也要注意，在`IE`中以`COM`对象形式实现的任何函数，`isFunction()`都将会返回`false`，由于它们并不是原生的js函数