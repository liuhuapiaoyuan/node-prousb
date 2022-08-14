/*
 * @Description: 
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:20:10
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-15 00:11:55
 */





import { Library, LibraryObjectDefinitionBase, LibraryObjectDefinitionInferenceMarker } from 'ffi-napi';




function injectDllDir(dir:string){
  const kernel32 = Library("kernel32", {
    'SetDllDirectoryA': ["bool", ["string"]]
  })
  let t = kernel32.SetDllDirectoryA(dir);
  console.log(`[${t ? '成功' :"失败"}]inject dll Dir LINK:`,dir)
}

/**
 * 加载DLL文件
 * @param {*} dllDir  dll文件所在的完整目录
 */
 function DllLoader<TDefinition extends LibraryObjectDefinitionBase | LibraryObjectDefinitionInferenceMarker>(dllDir:string , libFile:string,config:TDefinition){
  injectDllDir(dllDir)
   let oldPath = process.env.PATH;
  process.env['PATH'] = `${process.env.PATH};${dllDir}`;
  let lib =  Library(libFile, config);
  process.env['PATH'] = oldPath; 
  return lib
}

export { DllLoader };

