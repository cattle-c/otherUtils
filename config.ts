import type { IConfig } from "./cli/utils/Config"
import postcssNested from 'postcss-nested'

export default {
  /* 
    node进程入口文件
  */
  mainEntry: './src/main/main.ts',
  // 渲染进程入口
  rendererEntry: './src/renderer/renderer.ts',
  /*
  初始化方法， 在所有任务调用前执行
   */
  init: () => {
    console.log('init');
  },
  // 生产时的main的输出目录
  mainBuildPath: './build/main',
   // 生产时的renderer的输出目录
  rendererBuildPath: './build/renderer',
  // 开发时的main的输出目录
  mainDevPath: './.cache/main',
  // 主进程的babel配置
  mainBabelOption: (babelConfig) => {
    return babelConfig
  },
  rendererBabelOptions: {},
  postcssOption: {
    plugins:[
      postcssNested,
    ]
  },
  // 别名配置
  alias: {
    '@renderer': './src/renderer'
  }

} as IConfig