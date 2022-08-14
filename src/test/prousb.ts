/*
 * @Description: 
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-14 22:19:48
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-14 23:27:30
 */

import { ProusbSmartLock } from "@/adapter/Prousb/ProusbSmartLock"


console.log('===========ProusbSmartLock==============')
let service = new ProusbSmartLock()
service.version().then(console.log)
console.log('===========ProusbSmartLock==============')