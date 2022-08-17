/*
 * @Description: 实现ProusbV9的适配
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:15:31 
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-18 00:20:07
 */
import { CardInfoErros, ISmartLock, loadCardResult } from '@/lib/ISmartLock';
import { LockException } from '@/lib/LockException';
import { delay } from '@/lib/utils';
import { DllLoader } from '@/utils/DllLoader';
import * as assert from 'assert';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as ref from 'ref-napi';
const DllDir = path.join(__dirname , '../../../dll/prousbV9')

export class ProusbV9SmartLock implements ISmartLock{
  dll: any;
  carNo = 0
  Dai  = 0 
  constructor(){
    this.dll = DllLoader(DllDir,"V9RF.dll", {
      //方法名称： 返回值，参数列表
      'GetDLLVersionA': [ ref.types.int, [ ref.refType("string") ] ] , 
      'Buzzer': [ ref.types.int, [  ref.types.uchar] ] , 
      'WriteGuestCardA': [ ref.types.int, [ 
         ref.types.int, // dlscoid
         ref.types.byte,  //cardno
         ref.types.byte,  // dai
         ref.types.byte,  //llock
         ref.types.CString, // eDate
         ref.types.CString, // roomNo
          ref.refType("string") ,  //cardhexstr
        ] ] , 
      'CardEraseA': [ ref.types.int, [    ref.refType("string")   ] ] , 
      'ReadCard': [ ref.types.int, [    ref.refType("string")   ] ] , 
      // 读取卡信息
      'GetGuestCardinfoA': [ ref.types.int, [  
        ref.types.int,
          ref.refType("string")   ,
          ref.refType("string")   ,
        ] ] , 
    });
  }


  async version(): Promise<string> {
    let pointerSomething= ref.allocCString("adaaaaaaaaaasds");
    let vr = this.dll.GetDLLVersionA(pointerSomething)
    if(pointerSomething.isNull()){
      throw new LockException("版本获取失败,返回Null")
    }
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
    let pointerSomething= ref.allocCString("111111111");
    this.Dai = (this.Dai+1)%255
    let dlsCoID  = Number(hotelId)
    // 每次发出一张就+1
    let CardNo   = ++ this.carNo
    let Dai  = this.Dai  
    let LLock   =  1
    //年月日时分，各2位
    let EDate  =  dayjs(eTime).format("YYMMDDHHmm")
    //console.log('dlsCoID,CardNo+"",Dai,LLock,EDate,lockNo,',dlsCoID,CardNo,Dai,LLock,EDate,lockNo+"")
    let code = this.dll.WriteGuestCardA(
      dlsCoID,CardNo,Dai,LLock,EDate,lockNo+"",
      pointerSomething)
    await delay(400)
    if(code ==1 ){
      throw new LockException("发卡器没有连接")
    }
    if(code == -2 ){
      throw new LockException("没有读到有效卡片")
    }
    await this.buzzer(500)
    let cardHexStr = pointerSomething.readCString(0)
    return cardHexStr
  }
  async eraseCard(hotelId: string): Promise<string> {
    let pointerSomething= ref.allocCString("");
    let code = this.dll.CardEraseA(Number(hotelId),pointerSomething)
    await delay(400)
    if(code ==1 ){
      throw new LockException("发卡器没有连接")
    }
    if(code == -2 ){
      throw new LockException("没有读到有效卡片")
    }
    await this.buzzer(500)
    let cardHex = pointerSomething.readCString(0)
    return cardHex
  }
  
  async loadCard(hotelId: string): Promise<loadCardResult> {
    let cardHexStrRef= ref.allocCString("");
    let infoRef= ref.allocCString("");
    let code = this.dll.GetGuestCardinfoA(Number(hotelId),cardHexStrRef,infoRef)
    await delay(400)
    if(code != 0 ){
      throw CardInfoErros[code]
    } 
    await this.buzzer(500)
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
    let pointerSomething= ref.allocCString("");
    let vr = this.dll.ReadCard(pointerSomething)
    if(vr != 0){
      throw new LockException("卡片读取失败")
    }
    await this.buzzer(500)
    let cardHex = pointerSomething.readCString(0) 
    return this.getCardNo(cardHex)
  }
 

}