import path from 'path'
import { projectPath } from "./paths";
import babelMain from "../options/babel.main";
import babelRenderer from '../options/babel.renderer';
import postcssConfig from '../options/postcss.config';

export interface IConfig {
  mainEntry?: string;
  rendererEntry?: string;
  init?: () => void;
  mainBuildPath?: string;
  rendererBuildPath?: string;
  mainDevPath?: string;
  mainBabelOption?: objectType | ((config: objectType) => objectType);
  rendererBabelOptions?: objectType | ((config: objectType) => objectType);
  postcssOption?: objectType | ((config: objectType) => objectType);
  alias?: objectString;
}

type objectType = {
  [key: string]: any
}
type objectString = {
  [key:string]: string
}


class Config {
  init: () => void
  mainEntry: string
  rendererEntry:string
  mainDistPath: string
  rendererDistPath:string
  mainBabelOption: objectType
  rendererBabelOption: objectType
  postcssOption: objectType
  alias: objectString
  constructor(options: IConfig){
    // 入口
    this.mainEntry = this.pathHandler(options.mainEntry) ?? this.pathHandler('./src/main/main.ts')!
    this.rendererEntry = this.pathHandler(options.rendererEntry) ?? this.pathHandler('./src/renderer/renderer.ts')!
    // 初始化
    this.init = options.init ?? (function(){})

    if(process.env.NODE_ENV === 'development'){
      // Main开发时的输出目录
      this.mainDistPath = this.pathHandler(options.mainDevPath) ?? this.pathHandler('./.cache/main')!
    }else{
      // Main打包时的输出目录
      this.mainDistPath = this.pathHandler(options.mainBuildPath) ?? this.pathHandler('./build/main')!
    }
    this.rendererDistPath = this.pathHandler(options.rendererBuildPath) ?? this.pathHandler('build/renderer')!
    // main 的 babel 配置
    if(typeof options.mainBabelOption === 'function') {
      this.mainBabelOption = options.mainBabelOption(babelMain)
    }else{
      this.mainBabelOption = Object.assign(babelMain, options.mainBabelOption)
    }
    // render 的 babel 配置
    if(typeof options.rendererBabelOptions === 'function') {
      this.rendererBabelOption = options.rendererBabelOptions(babelRenderer)
    }else{
      this.rendererBabelOption = Object.assign(babelRenderer, options.rendererBabelOptions)
    }
    // postcss 配置
    if(typeof options.postcssOption === 'function') {
      this.postcssOption = options.postcssOption(postcssConfig)
    }else{
      this.postcssOption = options.postcssOption!.plugins ? this.mergePostcssOption(options.postcssOption!) : postcssConfig.plugins
    }
    // 别名配置 
    this.alias = this.objectPathHandler(options.alias)
  }
  // 路径处理
  pathHandler(relativePath: string | undefined){
    if(!relativePath){
      return relativePath
    }
    return path.resolve(projectPath,relativePath)
  }
  // 路径对象处理
  objectPathHandler(pathObject:objectString | undefined | null){
    if(!pathObject){
      return {}
    }
    const aliasConfig:objectString = {}
    Object.keys(pathObject).forEach(key => {
      aliasConfig[key] = this.pathHandler(pathObject[key])!
    })
    return aliasConfig
  }
  mergePostcssOption(options:objectType){
    const plugins = [...new Set(postcssConfig.plugins.concat(options.plugins))]
    return {
      plugins
    }
  }
}

export default Config