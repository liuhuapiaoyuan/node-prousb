/*
 * @Description: 智能锁
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 21:41:26
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-15 00:40:34
 */

import { LockException } from "./LockException"

export type loadCardResult = {
  /* 读取的卡片ID */
  cardHexStr:string

  /* 6位的锁号 */
  lockNo:string

  /* 发卡时间 */
  createTime:Date
  /* 到期时间 */
  endTime:Date

  /* 1能开反锁，0不能开反锁； */
  llock:1|0

  /* 订单的流水卡号 */
  cardOrderNo:string

}


/* 读取客人卡的卡片 */
export const CardInfoErros = {
  "1":new LockException("没有连接发卡器"),
  "-2":new LockException("没有读到有效卡片"),
  "-3":new LockException("此卡非本酒店卡，或酒店标识没有匹配"),
  "-4":new LockException("表示空白卡或者已经注销的卡片"),
  "-5":new LockException("不是客人卡"),
}


export interface ISmartLock{

  /* 获得版本号 */
  version():Promise<string>

  /**
   * 时间
   * @param time （单位：ms)
   */
  buzzer(time:number):Promise<void>

  /**
   * 客人开卡
   * @param hotelId 
   * @param lockNo 
   * @param eTime 
   * @return 返回卡的序列号(CardHexStr)
   */
  guestCard(hotelId:string,lockNo:string,eTime:Date):Promise<string>



  /**
   * 注销卡片
   * @param hotelId 
   * @return   返回注销的卡的序列号(CardHexStr)
   */
  eraseCard(hotelId:string):Promise<string>


  /**
   * 读取卡号
   * @param hotelId 
   */
  loadCard(hotelId:string):Promise<loadCardResult>

  /**
   * 读取卡片的号码
   */
  readCardNo():Promise<string>

}