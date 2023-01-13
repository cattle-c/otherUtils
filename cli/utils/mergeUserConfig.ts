import Config from './Config'
import readConfig from "./readConfig"

async function mergeUserConfig(){
  const userConfig = await readConfig()
  const config = new Config(userConfig)
  
  return config
}

export default mergeUserConfig

// 初始化
// 合并配置
// 启动任务
// 流程结束