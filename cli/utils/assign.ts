type anyObjectType = {[ key: string|number|symbol ]: any}

const typeString = (object: any) => {
  return Object.prototype.toString.call(object)
}

function assign(object1: anyObjectType, object2: anyObjectType){
  // 如果两个都不存在
  if(!object1 && !object2){
    throw new Error('Error: Cannot convert undefined or null to object')
  }
  // 如果1不存在
  if(!object1) return object2
  // 如果2不存在
  if(!object2) return object1
  console.log(typeString(object1));
  
  if(typeString(object1) === '[object array]'){

  }
}