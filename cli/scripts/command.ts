import { Command } from 'commander'
import { existsSync } from 'fs'
import paths from '../utils/paths'
import rendererDev from './commands/rendererDev'
import mainDev from './commands/mainDev'
import electronDev from './commands/electronDev'
import preloadDev from './commands/preloadDev'

(async () => {
  

  const commander = new Command('cli')
  

  if(existsSync(paths.appPackageJson)){
    const packageJson = await import(paths.appPackageJson).then(res => res.default)
    commander.version(packageJson.version)
  }

  commander.command('renderer:dev').description('运行 renderer 进程').action(rendererDev)
  commander.command('main:dev').description('运行 renderer 进程').action(mainDev)
  commander.command('preload:dev').description('运行 renderer 进程').action(preloadDev)
  commander.command('electron:dev').description('运行 renderer 进程').action(electronDev)
  
  commander.parse(process.argv)


})()