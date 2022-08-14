/*
 * @Description: 实现ProusbV9的适配
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:15:31 
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-15 01:20:54
 */
import { CardInfoErros, ISmartLock, loadCardResult } from '@/lib/ISmartLock';
import { LockException } from '@/lib/LockException';
import { DllLoader } from '@/utils/DllLoader';
import * as assert from 'assert';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as ref from 'ref-napi';
const DllDir = path.resolve( './dll/prousbV9')

export class ProusbV9SmartLock implements ISmartLock{
  dll: any;
  carNo = 0
  Dai  = 0 
  constructor(){
    this.dll = DllLoader(DllDir,"V9RF.dll", {
      //方法名称： 返回值，参数列表
      'GetDLLVersionA': [ ref.types.int, [ ref.refType(ref.types.CString) ] ] , 
      'Buzzer': [ ref.types.int, [  ref.types.uchar] ] , 
      'WriteGuestCardA': [ ref.types.int, [ 
         ref.types.int,
         ref.types.uchar,
         ref.types.uchar,
         ref.types.uchar,
         ref.types.uchar,
         ref.types.uchar,
         ref.refType(ref.types.CString),
        ] ] , 
      'CardEraseA': [ ref.types.int, [   ref.refType(ref.types.CString)  ] ] , 
      'ReadCard': [ ref.types.int, [   ref.refType(ref.types.CString)  ] ] , 
      // 读取卡信息
      'GetGuestCardinfoA': [ ref.types.int, [  
        ref.types.int,
         ref.refType(ref.types.CString)  ,
         ref.refType(ref.types.CString)  ,
        ] ] , 
    });
  }


  async version(): Promise<string> {
    let pointerSomething= ref.alloc(ref.types.CString,"128");
    let vr = this.dll.GetDLLVersionA(pointerSomething)
    let version = pointerSomething.readCString(0)
    if(vr != 0){
      throw new LockException("版本获取失败,返回："+vr)
    }
    return version
  }
  async buzzer(time: number):Promise<void> {
    assert(time>=10,`时间不能少于10ms【${time}】`)
    let sTime = Number((time/10).toFixed(0))
    let code = this.dll.Buzzer(sTime)
    if(code!=0){
      throw new LockException("buzzer调用失败")
    }
  }

  
  async guestCard(hotelId: string, lockNo: string, eTime: Date): Promise<string> {
    let pointerSomething= ref.alloc(ref.types.CString,"128");
    this.Dai = (this.Dai+1)%255
    let dlsCoID  = Number(hotelId)
    // 每次发出一张就+1
    let CardNo   = ++ this.carNo
    let Dai  = this.Dai +""
    let LLock   =  "1" 
    //年月日时分，各2位
    let EDate  =  dayjs(eTime).format("YYMMDDHHmm")
    let code = this.dll.WriteGuestCardA(
      dlsCoID,CardNo+"",Dai,LLock,EDate,lockNo,
      pointerSomething)
    if(code ==1 ){
      throw new LockException("发卡器没有连接")
    }
    if(code == -2 ){
      throw new LockException("没有读到有效卡片")
    }
    let cardHexStr = pointerSomething.readCString(0)
    return cardHexStr
  }
  async eraseCard(hotelId: string): Promise<string> {
    let pointerSomething= ref.alloc(ref.types.CString,"128");
    let code = this.dll.CardEraseA(Number(hotelId),pointerSomething)
    if(code ==1 ){
      throw new LockException("发卡器没有连接")
    }
    if(code == -2 ){
      throw new LockException("没有读到有效卡片")
    }
    let cardHex = pointerSomething.readCString(0)
    return cardHex
  }
  
  async loadCard(hotelId: string): Promise<loadCardResult> {
    let cardHexStrRef= ref.alloc(ref.types.CString,"128");
    let infoRef= ref.alloc(ref.types.CString,"128");
    let code = this.dll.GetGuestCardinfoA(Number(hotelId),cardHexStrRef,infoRef)
    if(code != 0 ){
      throw CardInfoErros[code]
    } 
    let cardHexStr = cardHexStrRef.readCString(0)
    let info = infoRef.readCString(0)
    if(info.length!=40){
      throw new LockException("卡号信息长度为40个字符串，但是读取到：" +  info.length+ "位")
    }
    let result = {
      cardHexStr,
      lockNo:info.slice(0,6),
      createTime:dayjs(info.slice(6,18),'YYMMDDHHmm').toDate(),
      endTime:dayjs(info.slice(18,30),"YYMMDDHHmm").toDate(),
      llock:Number(info.slice(30,31)) as any,
      cardOrderNo:info.slice(31,31+8),
    }
    return result
  }

  getCardNo(cardHex:string){
    if(!cardHex.startsWith("551501")){
      throw new LockException("卡号不正确；应该以551501开头："+cardHex)
    }
    return cardHex.slice(24,24+8)
  }

  
  async readCardNo(): Promise<string> {
    let pointerSomething= ref.alloc(ref.types.CString,"128");
    let vr = this.dll.ReadCard("1",pointerSomething)
    if(vr != 0){
      throw new LockException("卡片读取失败")
    }
    let cardHex = pointerSomething.readCString(0) 
    return this.getCardNo(cardHex)
  }
 

}