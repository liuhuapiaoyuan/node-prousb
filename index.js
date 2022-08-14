

var ffi = require('ffi-napi');
const path = require('path')
const lib = "./adapter/proUSB/"
var ref = require('ref-napi')
var StructType = require('ref-struct-di')(ref)
var link = path.resolve(lib,"proRFL.dll")


console.log('path.resolve(lib)',path.resolve(lib))
console.log('path',link)



// define the time types
/* var time_t = ref.types.long
var suseconds_t = ref.types.uchar */

/**
 * 功能：读DLL版本，不涉及USB口操作
C++原型：int __stdcall GetDLLVersion(uchar *bufVer)
返回：DLL版本
 */

var libm = ffi.Library(link, {
  //方法名称： 返回值，参数列表
  'GetDLLVersion': [ ref.types.int, [ ref.types.uchar ] ]
});

libm.SetDllDirectoryA(path.resolve(lib))

/* let result = libm.GetDLLVersion(1.5); // 2
console.log('=======》',result)
 */ 