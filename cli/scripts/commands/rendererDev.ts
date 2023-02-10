import { existsSync } from 'fs'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { merge } from 'webpack-merge'
import address from 'address'
import chalk from 'chalk'
import { CliConfig } from '../../../typings'
import paths from '../../utils/paths'
import rendererBaseConfig from '../../webpack/renderer.base.config'
import rendererDevConfig from '../../webpack/renderer.dev.config'
import clearConsole from '../../utils/clearConsole'


export default function rendererDev(){
  return new Promise<void>(async (resolve,reject) => {

    
    // 读取用户配置
    let userConfig:CliConfig = {}
    if(existsSync(paths.appCliConfig)) {
      userConfig = import(paths.appCliConfig).then(res => res.default) as CliConfig
    }

    // 生成webpack配置
    const webpackOption = rendererBaseConfig('development', userConfig.renderer)

    // 用户提供的webpack配置
    let userWebpackOption = {}
    if(userConfig.renderer?.webpackConfig){
      userWebpackOption = typeof userConfig.renderer.webpackConfig === 'function' ? userConfig.renderer.webpackConfig(webpackOption) : userConfig.renderer.webpackConfig
    }

    // 合并生成最后的配置
    const webpackConfig = merge(webpackOption,userWebpackOption)

    // 获取开发配置
    const webpackDevOption = await rendererDevConfig('development', userConfig.renderer)

    // 获取用户提供的开发配置
    let userWebpackDevOption = userConfig.renderer?.devServer ?? {}
    

    // 合并生成开发配置

    const webpackDevServer = merge({ devServer: webpackDevOption }, { devServer: userWebpackDevOption })

    // 生成编译器
    const compiler = webpack(webpackConfig)

    compiler.hooks.done.tap('done', (stats) => {
      if(process.stdout.isTTY){
        clearConsole()
      }
      console.log('\n\nYour application is running here: ');
      console.log(`\n\tLocal:   ${chalk.blue('http://' + address.ip() + ':' + webpackDevServer.devServer.port + '/')}`);
      console.log(`\tNetwork: ${chalk.blue('http://localhost:' + webpackDevServer.devServer.port + '/')}\n`);
      console.log('Note that the development build is not optimized');
      console.log(`To create a production build, run ${chalk.green('npm run build')}.\n`);
      
    })

    // 生成开发服务器
    const devServer = new WebpackDevServer(webpackDevServer.devServer, compiler)

    // 启动开发服务器
    devServer.start().then(result => {
      console.log('then');
      resolve()
    }, err => {
      console.log('catch', err);
      reject()
    })
  })
}