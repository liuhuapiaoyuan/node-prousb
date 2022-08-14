import * as dayjs from 'dayjs';
/*
 * @Description: 
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:19:48
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-15 00:52:29
 */
import { ProusbV9SmartLock } from "..";


console.log('=========BEGIN:=ProusbSmartLockV9==============')
let service = new ProusbV9SmartLock()
service.version().then(console.log)
console.log("测试客人开卡")
try{
  service.guestCard(
    "1",
    "100014",
    dayjs("2022-08-15 02:33").toDate() 
  ).catch(e=>{
    console.log("测试客人开卡失败",e.message)
  })
}catch(e){
  console.log(e)
}

console.log('==========END:=ProusbSmartLockV9==============')
 