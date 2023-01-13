import path from "path";
import { Configuration, webpack } from "webpack";
import { merge } from 'webpack-merge'
import WebpackDevServer from 'webpack-dev-server'
import Config from '../utils/Config'
import mergeUserConfig from "../utils/mergeUserConfig";
import mergeUserConfigToWebpackConfig from "../utils/mergeUserConfigToWebpackConfig";
import devMain from "../webpack/dev.main";
import devRenderer from "../webpack/dev.renderer";
import baseRenderer from '../webpack/base.renderer'
import electron from 'electron'
import ChildProcess from 'child_process'
import type { ChildProcessWithoutNullStreams } from 'child_process'
import { projectPath } from "../utils/paths";


let electronProcess: ChildProcessWithoutNullStreams | null = null

async function main(){
  process.env.NODE_ENV = 'development'
  const userConfig = await mergeUserConfig()
  // 初始化
  userConfig.init()
  
  // 合并配置
  const devMainConfig = merge(mergeUserConfigToWebpackConfig('main', userConfig), devMain)
  const devRendererConfig = merge(mergeUserConfigToWebpackConfig('renderer', userConfig), devRenderer)
  // console.log(devRendererConfig);
  
  // 启动任务
  // startMain(devMainConfig)
  Promise.all([startMain(devMainConfig), startRenderer(devRendererConfig)]).then(() => {
    startElectron()
  })
  startRenderer(devRendererConfig)
  // 任务完成
}

function startMain(devConfig: Configuration){
  return new Promise((resolve, reject) => {
    const mainCompiler = webpack(devConfig)
    mainCompiler.watch({}, (err, stats) => {
      if(err){
        console.log(err);
        return
      }

      console.log('main build success');
      resolve('startMain')
    })
  })
}

function startRenderer(devConfig: Configuration){
  return new Promise((resolve, reject) => {
    const rendererServer = new WebpackDevServer({}, webpack(devConfig))

    rendererServer.startCallback((err) => {
      if(err){
        console.log('renderer run fail', err);
        return
      }
      console.log('renderer run success');
      resolve('startRenderer')
    })
  })
}

function startElectron(){
  electronProcess = ChildProcess.spawn(electron as unknown as string, [path.resolve(projectPath, './.cache/main/main.js')])
  electronProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  electronProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  electronProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}


main()