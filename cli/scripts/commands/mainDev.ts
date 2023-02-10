import { existsSync } from 'fs'
import webpack from 'webpack'
import { merge } from 'webpack-merge'
import chalk from 'chalk'
import { CliConfig } from '../../../typings'
import paths from '../../utils/paths'
import mainBaseConfig from '../../webpack/main.base.config'
import clearConsole from '../../utils/clearConsole'


export default function mainDev(change?: (() => void)){
  let firstStart = true

  return new Promise<void>(async (resolve,reject) => {

    // 读取用户配置
    let userConfig:CliConfig = {}
    if(existsSync(paths.appCliConfig)) {
      userConfig = import(paths.appCliConfig).then(res => res.default) as CliConfig
    }

    // 生成webpack配置
    const webpackOption = mainBaseConfig('development', userConfig.main)

    // 用户提供的webpack配置
    let userWebpackOption = {}
    if(userConfig.main?.webpackConfig){
      userWebpackOption = typeof userConfig.main.webpackConfig === 'function' ? userConfig.main.webpackConfig(webpackOption) : userConfig.main.webpackConfig
    }

    // 合并生成最后的配置
    const webpackConfig = merge(webpackOption,userWebpackOption)


    // 生成编译器
    const compiler = webpack(webpackConfig)

    compiler.hooks.done.tap('done', stats => {
      if(process.stdout.isTTY){
        clearConsole()
      }
      console.log(stats.toJson({
        all:false,
        errors: true,
      }));
      
    })

    // 开启监听
    compiler.watch({}, err => {
      if(err) {
        console.error(err);
        return 
      }
      if(firstStart){
        resolve()
      }
      typeof change === 'function' && change()
      console.log(`main compiler ${chalk.green('success')}`);
      firstStart = false
      
    })
  })
}