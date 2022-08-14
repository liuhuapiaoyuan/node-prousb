/*
 * @Description: 实现ProusbV9的适配
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:15:31 
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-15 00:40:41
 */
import type { ISmartLock, loadCardResult } from '@/lib/ISmartLock';
import { LockException } from '@/lib/LockException';
import { DllLoader } from '@/utils/DllLoader';
import * as path from 'path';
import * as ref from 'ref-napi';
const DllDir = path.resolve( './dll/prousb')
console.log('DllDir',DllDir)


export class ProusbSmartLock implements ISmartLock{
  dll: any;

  constructor(){
    this.dll = DllLoader(DllDir,"proRFL.dll", {
      //方法名称： 返回值，参数列表
      'GetDLLVersion': [ ref.types.int, [ ref.refType(ref.types.CString) ] ] , 
    });
  }
 

  async version(): Promise<string> {
    let pointerSomething= ref.alloc(ref.types.CString,"128");
    let vr = this.dll.GetDLLVersion(pointerSomething)
    let version = pointerSomething.readCString(0)
    if(vr != 0){
      console.error('版本获得失败：',version)
      throw new LockException("版本获取失败,返回："+vr)
    }
    return version
  }
  buzzer(time: number) :Promise<void>{
    throw new Error('Method not implemented.');
  }
  guestCard(hotelId: string, lockNo: string, eTime: Date): Promise<string> {
    throw new Error('Method not implemented.');
  }
  eraseCard(hotelId: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  loadCard(hotelId: string): Promise<loadCardResult> {
    throw new Error('Method not implemented.');
  }
  readCardNo(): Promise<string> {
    throw new Error('Method not implemented.');
  }
 

}