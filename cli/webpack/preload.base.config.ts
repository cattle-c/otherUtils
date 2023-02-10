import webpack, { Configuration,WebpackPluginInstance } from 'webpack'
import WebpackBar from 'webpackbar'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

import paths from '../utils/paths'
import { CliConfig } from '../../typings'
import invokeHandle from '../utils/invokeHandle'


const preloadBaseConfig = (webpackEnv: Configuration['mode'], userConfig: CliConfig['main']): Configuration => {
  const isPrd = webpackEnv === 'production'

  
  return {
    mode: isPrd ? 'production' : 'development',
    stats: 'errors-warnings',
    devtool: false,
    performance:false,
    infrastructureLogging: {
      level: 'none'
    },
    bail: isPrd,
    target: 'electron-renderer',
    entry: {
      preload: paths.appPreloadEntry,
    },
    output: {
      path: isPrd ? paths.appPreloadBuild : paths.appPreloadDevCache,
      filename: '[name].js',
      chunkFilename: 'chunks/[name].[contenthash:4].chunk.js',
      assetModuleFilename: 'assets/[name].[contenthash:4][ext]',
      publicPath:paths.publicPath,
      clean:true,
    },
    module: {
      strictExportPresence: false,
      rules: [
        {
          test: /\.(ts|js|mjs)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: invokeHandle(userConfig?.loaderOptions?.babelLoader, {
                presets: [
                  ['@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: 3,
                    targets: 'node 16'
                  }],
                  '@babel/preset-typescript'
                ]
              })
            }
          ]
        },
      ]
    },
    plugins: [
      // 复制资源
      isPrd && new CopyWebpackPlugin(
        invokeHandle(userConfig?.pluginOptions?.copyWebpackPlugin, {
          patterns: [
            {
              from: paths.appPublic,
              filter: (resourcePath: string)=> {
                console.log();
                return !/index\.html/.test(resourcePath)
              },
              globOptions:{
                ignore: ['*.html'],
              }
            }
          ],
        })
      ),
      // 环境插件
      new webpack.EnvironmentPlugin(
        invokeHandle(userConfig?.pluginOptions?.environmentPlugin, {
          // NODE_ENV: 'development'
        })
        
      ),
      // 打包进度
      new WebpackBar(invokeHandle(userConfig?.pluginOptions?.webpackBar, {
      })),
      new FriendlyErrorsWebpackPlugin()

    ].filter(Boolean) as WebpackPluginInstance[],
    optimization: {
      minimize: isPrd,
      minimizer: [
        new TerserWebpackPlugin(
          invokeHandle(userConfig?.pluginOptions?.terserWebpackPlugin, {
            terserOptions: {
              parse: {
                ecma: 2018
              },
              compress: {
                ecma: 5,
                inline: 2,
                comparisons: false,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                ascii_only: true,
                comments: false,
              }
            }
          })
        ),
      ]
    }
  }
}

export default preloadBaseConfig