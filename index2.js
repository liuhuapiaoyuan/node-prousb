

const ref = require('ref-napi')
const dllLoad = require('./dllLoad')



// 生成兼容C的指向string类型的指针，即char**
var stringPointer = ref.refType(ref.types.CString);


var libm = dllLoad.dllLoad("./adapter/proUSB","proRFL.dll", {
  //方法名称： 返回值，参数列表
  'GetDLLVersion': [ ref.types.int, [ stringPointer ] ] , 
  /* 0 有驱动，1是免驱动 */
  'initializeUSB': [ ref.types.int, [ ref.types.int] ],
  /* 默认参数是1 */
  'CloseUSB': [ ref.types.int, [ ref.types.uchar ] ],
});
let pointerSomething= ref.alloc(ref.types.CString,"128");
let vr = libm.GetDLLVersion(pointerSomething)
let version = pointerSomething.readCString(0)
if(vr == 0){
  console.log('版本获得成功：',version)
}else{
  
  console.error('版本获得失败：',version)
}

console.log('------------------------')
let r = libm.initializeUSB(1)
console.log('执行 initializeUSB 结果：',r)
console.log('------------------------')

r =  libm.CloseUSB(1)
console.log('执行 CloseUSB 结果：',r)
console.log('------------------------')



