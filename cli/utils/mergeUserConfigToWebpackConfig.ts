import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { merge } from 'webpack-merge'
import { Configuration, web } from "webpack"
import  Config from "./Config"
import baseMain from "../webpack/base.main"
import baseRenderer from '../webpack/base.renderer'

/* 合并用户配置到webpack的配置中 */
function mergeUserConfigToWebpackConfig(type: 'main' | 'renderer', userConfig: Config){
  let config: Configuration = {}
  switch(type){
    case 'main': 
      config = mergeMain(userConfig)
    break
    case 'renderer':
      config = mergeRenderer(userConfig)
    break
  }
  return config
}

function mergeMain(userConfig: Config){
  const webpackConfig:Configuration = {
    resolve: {
      alias: userConfig.alias
    },
    entry: {
      main: userConfig.mainEntry
    },
    output: {
      path: userConfig.mainDistPath
    },
    module: {
      rules: [
        {
          test: /\.(t|j)s$/,
          loader: 'babel-loader',
          options: userConfig.mainBabelOption,
          exclude: /node_modules/
        }
      ]
    }
  }
  return merge(baseMain, webpackConfig)

}

function mergeRenderer(userConfig: Config){
  const isDev = process.env.NODE_ENV === 'development'
  const cssUse = [
    isDev ? 'vue-style-loader': MiniCssExtractPlugin.loader,
    'css-loader',
    {
      loader: 'postcss-loader',
      options: userConfig.postcssOption
    }
  ]

  const webpackConfig:Configuration = {
    resolve:{
      alias: userConfig.alias
    },
    entry: {
      main: userConfig.rendererEntry
    },
    output: {
      path: userConfig.rendererDistPath
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'babel-loader',
          options: userConfig.rendererBabelOption, 
          exclude: /node_module/
        },
        {
          test: /\.css$/,
          use: cssUse
        },
        {
          test: /\.s(c|a)ss$/,
          use:[...cssUse, 'sass-loader']
        },
        {
          test: /\.less$/,
          use:[...cssUse, 'less-loader']
        }
      ]
    },
    plugins: []
  }

  if(!isDev) {
    webpackConfig.plugins?.push(new MiniCssExtractPlugin())
  }

  return merge(baseRenderer, webpackConfig)

}


export default mergeUserConfigToWebpackConfig