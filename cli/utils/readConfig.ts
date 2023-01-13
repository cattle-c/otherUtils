import path from 'path'
import { CONFIG_FILE_NAME } from './const'
import { projectPath } from './paths'
import type { IConfig } from './Config'

function readConfig() {
  return new Promise<IConfig>((resolve, reject) => {
    const configPath = path.resolve(projectPath, CONFIG_FILE_NAME)
    import(configPath).then(config => {
      resolve(config.default)
    }).catch(err => {
      reject(err)
    })
  })
}

export default readConfig