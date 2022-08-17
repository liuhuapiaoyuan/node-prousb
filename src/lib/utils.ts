/*
 * @Description: 
 * @version: 0.01
 * @Company: DCIT-SH
 * @Author: guohl
 * @Date: 2022-08-17 21:43:17
 * @LastEditors: guohl
 * @LastEditTime: 2022-08-17 21:43:36
 */


export function delay(timeout:number){
  return new Promise(resolve=>setTimeout(resolve , timeout))
}