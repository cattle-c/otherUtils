export default function invokeHandle(obj: any, param?: any){
  // // 不存在时
  // if(!obj){
  //   return {}
  // }
  // 如果是function
  if(typeof obj === 'function') {
    return obj(param ?? {})
  }else{ // 存在且不是function
    return Object.assign(param ?? {}, obj ?? {})
  }
}