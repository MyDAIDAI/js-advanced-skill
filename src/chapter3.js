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
// 惰性载入函数
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
// 惰性载入函数
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