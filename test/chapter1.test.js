describe('isArray的测试', function () {
    it('[1, 2]应该是数组', function() {
        isArray([1,2]).should.equal(true)
    })
    it('"1" 不应该是数组', function() {
        isArray("1").should.equal(false)
    })
    it('1 不应该是数组', function() {
        isArray(1).should.equal(false)
    })
    it('null不应该是数组', function() {
        isArray(null).should.equal(false)
    })
    it('undefined不应该是数组', function() {
        isArray(undefined).should.equal(false)
    })
})

describe('isFunction的测试', function () {
    it('testFunction应该是函数', function() {
        isFunction(function () {} ).should.equal(true)
    })
    it('[1, 2]不应该是函数', function() {
        isFunction([1,2]).should.equal(false)
    })
    it('"1" 不应该是函数', function() {
        isFunction("1").should.equal(false)
    })
    it('1 不应该是函数', function() {
        isFunction(1).should.equal(false)
    })
    it('null不应该是函数', function() {
        isFunction(null).should.equal(false)
    })
    it('undefined不应该是函数', function() {
        isFunction(undefined).should.equal(false)
    })
})
describe('isRegExp的测试', function () {
    it('testRegExp应该是正则', function() {
        isRegExp(new RegExp()).should.equal(true)
    })
    it('[1, 2]不应该是正则', function() {
        isRegExp([1,2]).should.equal(false)
    })
    it('"1" 不应该是正则', function() {
        isRegExp("1").should.equal(false)
    })
    it('1 不应该是正则', function() {
        isRegExp(1).should.equal(false)
    })
    it('null不应该是正则', function() {
        isRegExp(null).should.equal(false)
    })
    it('undefined不应该是正则', function() {
        isRegExp(undefined).should.equal(false)
    })
})
describe('isNativeJson的测试', function () {
    it('[1, 2]不应该是JSON', function() {
        isNativeJson([1,2]).should.equal(false)
    })
    it('[1, 2]不应该是JSON', function() {
        isNativeJson([1,2]).should.equal(false)
    })
    it('"1" 不应该是JSON', function() {
        isNativeJson("1").should.equal(false)
    })
    it('1 不应该是JSON', function() {
        isNativeJson(1).should.equal(false)
    })
    it('null不应该是JSON', function() {
        isNativeJson(null).should.equal(false)
    })
    it('undefined不应该是JSON', function() {
        isNativeJson(undefined).should.equal(false)
    })
})