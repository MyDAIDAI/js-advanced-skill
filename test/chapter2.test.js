describe('Polygon的测试', function () {
  it('new Polygon应该是有', function() {
      isArray([1,2]).should.equal(true)
  })
  it('"1" 不应该是数组', function() {
      isArray("1").should.equal(false)
  })
  it('1 不应该是数组', function() {
      isArray(1).should.equal(false)
  })
})