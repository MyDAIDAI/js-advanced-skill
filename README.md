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

## 作用域安全的构造函数
在我们使用构造函数创建新实例时，会使用`new`操作符，构造函数其实就是一个使用`new`操作符调用的函数，当使用`new`调用时，构造函数内用到的`this`对象会指向新创建的对象的实例。但是，创建实例时若不使用`new`进行构造，就不会新创建对象实例，`this`值就会指向全局`window`，如：
```
function Polygon (sides) {
    this.sides = sides
    this.getArea = function () {
        return 0
    }
}
var test2 = new Polygon(2)
console.log(test2) //Polygon {sides: 2, getArea: ƒ}
console.log(window.sides) //undefined
var test3 = Polygon(3)
console.log(test3) //undefined
console.log(window.sides) // 3
```
从上面的代码中可以看到当使用`new`操作符时，新创建了一个实例，当未使用时，相当于调用构造函数，此时的`this`值指向全局`window`.
所以为了避免编码的时候出现类似的错误，我们需要对构造函数进行改进，由于使用`new`操作符后，`this`值会指向新创建的对象实例，所以可以根据这个进行判断。
```
function Polygon (sides) {
    if (this instanceof Polygon) {
        this.sides = sides
        this.getArea = function () {
            return 0
        }
    }else {
        return new Polygon(sides)
    }

}
var test2 = new Polygon(2)
console.log(test2) // Polygon {sides: 2, getArea: ƒ}
console.log(window.sides) // undefined
var test3 = Polygon(3)
console.log(test3) // Polygon {sides: 3, getArea: ƒ}
console.log(window.sides) // undefined
```
在使用这个模式之后，会产生一个问题，就是当使用构造函数式的继承且不使用原型链，那么这个继承就可能会被破坏
```
function Polygon (sides) {
    if (this instanceof Polygon) {
        this.sides = sides
        this.getArea = function () {
            return 0
        }
    }else {
        return new Polygon(sides)
    }

}
function Rectangle (width, height) {
    Polygon.call(this, 2)
    this.width = width
    this.height = height
    this.getArea = function () {
        return this.width * this.height
    }
}
var rect = new Rectangle(5, 10)
console.log(rect) // Rectangle {width: 5, height: 10, getArea: ƒ}
```
在上面的代码中，在实例`Rectangle`时，由于使用`new`操作符会将`this`中的所有属性复制给新创建的实例中，但是在实例化过程中，通过`Polygon.call(this, 2)`继承`Polygon`中的属性，由于`this`值指向的是`Rectangle`新创建的实例而非`Polygon`的实例，所以在执行此代码时，会新建一个`Polygon`的实例，它们两个的`this`值指向不同，所以在`new Rectangle(5, 10)`的过程中只会复制其`this`值指向`Rectangle`实例的，所以`rect`并没有继承到对应的属性。

想要解决这个问题，就要找到问题的根源，其根源就是实例化过程中的`this`的不一致性，所以需要`this instanceof Polygon`的判断为真，即`this`值即是`Rectangle`的实例也是`Polygon`的实例，所以使用原型链继承`Polygon`的实例，添加如下代码：
`Rectangle.prototype = new Polygon()`
添加这段代码之后，一个`Rectangle`的实例也是`Polygon`的实例,所以不会执行`new Polygon(sides)`，也就不会有`this`不同产生的继承问题.