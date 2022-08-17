/*
 * @Description: 
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:19:48
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-17 21:56:44
 */
import * as dayjs from "dayjs";
import { ProusbV9SmartLock } from "..";


async function action(){
  let service = new ProusbV9SmartLock() 
 console.log("测试12124132客人开卡")
try{
  await service.guestCard(
    "1",
    "100014",
    dayjs("2022-08-15 02:33").toDate() 
  ).catch(e=>{
    console.log("测试客人开卡失败",e.message)
  }).then((x)=>{
    console.log("操作成功")
  })
}catch(e){
  console.log(e)
}

} 
console.log('=========BEGIN:=ProusbSmartLockV9==============')

action().then(()=>{
  console.log('==========END:=ProusbSmartLockV9==============')
}).catch(e=>{
  console.error(e)
})
 