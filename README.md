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

## 惰性载入函数
在js的代码中有一些功能检测代码只需要执行一次，重复的检测测试是没有必要的，这个时候就需要用到惰性载入。
惰性载入表示函数执行的分支仅会发生一次，有两种实现载入的方式，如下：
- 在函数被调用时再处理函数。在第一个调用的过程中，该函数会被覆盖为另一个按合适方式执行的函数，这样任何对原函数的调用都不用再经过执行的分支了。
- 在函数声明时就指定适当的函数。在函数的声明时就使用立即执行表达式立即执行该函数并且将按合适方式执行的函数返回，后面再调用该函数时就是一个合适执行的函数。
比如，由于浏览器之间行为的差异，多数的js代码包含了大量的`if`语句，将执行引导到正确的代码中，代码如下：
```
function createXHR () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest()
    }else if (typeof ActiveXObject !== 'undefined'){
        if (typeof agruments.callee.activeXString !== "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    agruments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    //跳过                     
                }
            }
        }
        return new ActiveXObject(agruments.callee.activeXString)
    } else {
        throw new Error("No XHR object avaliable")
    }
}
```
在上面的代码中每次调用`createXHR()`的时候，它都要对浏览器支持的能力仔细检测。首先检测内置的`XHR`,然后测试有没有基于`ActiveX`的`XHR`,最后如果都没有发现的话就抛出一个错误。每次调用该函数都是这样，即使每次调用时分支的结果都不变，如果浏览器内置`XHR`，那么它就一直支持了，那么这种测试就没有必要了。所以就可以使用惰性载入函数减少这种不必要的开支

### 在函数被调用时再处理函数
这种的惰性载入函数会被覆盖为另一个按合适方式执行的函数，这样任何对原函数的调用都不再经过执行的分支了。代码如下：
```
function createXHR () {
    if (typeof XMLHttpRequest !== 'undefined') {
        createXHR = function () {
            return new XMLHttpRequest()
        }
    }else if (typeof ActiveXObject !== 'undefined'){
        createXHR = function () {
            if (typeof agruments.callee.activeXString !== "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        agruments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {
                        //跳过                     
                    }
                }
           }
           return new ActiveXObject(agruments.callee.activeXString)
        }
    } else {
       createXHR = function () {
            throw new Error("No XHR object avaliable")
       }
    }
    return createXHR()
}
```
在这个惰性载入的`createXHR()`中，`if`语句的每一个分支都会为`createXHR`变量赋值，有效覆盖了原有的函数。最后一步就是调用新赋值的函数，下一次调用`createXHR()`的时候，就会直接调用被赋值的函数，这样就不会再次执行`if`语句了
### 在函数声明时就指定适当的函数
```
var createXHR = (function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return function () {
            return new XMLHttpRequest()
        }
    }else if (typeof ActiveXObject !== 'undefined'){
        return function () {
            if (typeof agruments.callee.activeXString !== "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        agruments.callee.activeXString = versions[i];
                        break;
                    } catch (ex) {
                        //跳过                     
                    }
                }
            }
            return new ActiveXObject(agruments.callee.activeXString)
        }
    } else {
        return function () {
            throw new Error("No XHR object avaliable")
        }
    }
})();
```
这种方式是在声明函数时就指定了适当的函数。这样，第一次调用函数时就不会损失性能了，而是在代码首次加载时会损失性能。

惰性载入函数的优点是只在执行分支代码时牺牲一点性能，至于使用什么方式更加合适，需要根据具体的情况而定。

## 函数绑定
函数绑定要创建一个函数，可以在特定的`this`环境中以指定参数调用另一个函数。该技巧常常和回调函数与事件处理程序一起使用，以便在将函数作为变量传递的同时保留代码执行环境。
```
var handler = {
    message: 'Event handled',
    handleClick: function (event) {
        alert(this.message)
    }
}
var btn = document.getElementById("my-btn")
EventUtil.addHandler(btn, 'click', handler.handleClick)
```
在上面的例子中，创建了一个叫做`handler`的对象。`handler.handleClick()`方法被分配为一个`DOM`按钮事件的处理程序。当按下这个按钮时，就会调用该函数，显示一个警告框，警告框应该显示`Event handled`,但是显示的确是`undefined`，这个问题在于没有保存`handler.handleClick()`的环境，所以在执行的时候`this`对象最后是指向了`DOM`按钮而非`handler`。要修复上面的问题，可以创建一个闭包，如下：
```
EventUtil.addHandler(btn, 'click', function(event) {
    handler.handleClick(event)
})
```
这是特定于这段代码的解决方式，一个通用的方式是使用函数绑定，代码如下：
```
function bind(fn, context) {
    return function () {
        return fn.apply(context, arguments)
    }
}
```
除此之外，`ES6`为所有函数定义了一个原生的`bind()`方法，可以直接在函数上调用这个方法，如下：
`fun.bind(obj)`，`handler.handleClick.bind(handler)`.

它们主要应用于事件处理程序以及`setTimeout()`和`setInterval()`，但是被绑定的函数与普通函数相比有更多的开销，所以最好只在需要的时候使用.

