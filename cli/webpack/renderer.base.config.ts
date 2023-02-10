import webpack, { Configuration,WebpackPluginInstance } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WebpackBar from 'webpackbar'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin'

import paths from '../utils/paths'
import { CliConfig } from '../../typings'
import invokeHandle from '../utils/invokeHandle'


const rendererBaseConfig = (webpackEnv: Configuration['mode'], userConfig: CliConfig['renderer']): Configuration => {
  const isPrd = webpackEnv === 'production'

  
  const styleLoader = [
    {
      loader: isPrd ? MiniCssExtractPlugin.loader : 'vue-style-loader'
    },
    {
      loader: 'css-loader',
      options: invokeHandle(userConfig?.loaderOptions?.cssLoader)
    },
    {
      loader: 'postcss-loader',
      options: invokeHandle(userConfig?.loaderOptions?.postcssLoader,  {
          postcssOptions: {
            presets: [
              'postcss-flexbugs-fixes',
              ['postcss-preset-env', {
                autoprefixer: {
                  flexbox:'no-2009'
                }
              }],
              'postcss-normalize'
            ]
          }
        })
    }
  ]

  return {
    mode: isPrd ? 'production' : 'development',
    stats: 'errors-warnings',
    devtool: isPrd ? false : 'cheap-module-source-map',
    performance:false,
    infrastructureLogging: {
      level: 'none'
    },
    bail: isPrd,
    cache: {
      type: 'filesystem',
      store: 'pack'
    },
    target: 'electron-renderer',
    entry: {
      renderer: paths.appRendererEntry,
    },
    output: {
      path: paths.appRendererBuild,
      filename: 'static/js/[name].[contenthash:4].js',
      chunkFilename: 'static/js/[name].[contenthash:4].chunk.js',
      assetModuleFilename: 'static/assets/others/[name].[contenthash:4][ext]',
      publicPath:paths.publicPath,
      clean:true,
    },
    module: {
      strictExportPresence: false,
      rules: [
        {
          test:/\.css$/,
          use: styleLoader
        },
        {
          test:/\.s(a|c)ss$/,
          use: [...styleLoader, {
            loader:'sass-loader',
            options: invokeHandle(userConfig?.loaderOptions?.sassLoader)
          }]
        },
        {
          test: /\.vue$/,
          use:[
            {
              loader: 'vue-loader',
              options: invokeHandle(userConfig?.loaderOptions?.sassLoader)
            }
          ]
        },
        {
          test: /\.(ts|js|mjs|tsx|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: invokeHandle(userConfig?.loaderOptions?.babelLoader, {
                presets: [
                  ['@babel/preset-env', {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  }],
                  '@babel/preset-typescript'
                ]
              })
            }
          ]
        },
        
        /* .png, .jpeg, jpg, gif, bmp, svg, webp,  */
        {
          test: /\.(png|jpe?g|gif|bmp|svg|webp)$/,
          type: 'asset',
          generator: {
            filename: 'static/assets/images/[name].[contenthash:4][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: userConfig?.limit ?? 1024 * 10
            }
          }
        },
        /* .mp4, mp3, .wav, .webm, .flv, .flac, .ogg, .aac   */
        {
          test: /\.(mp3|mp4|wav|webm|flv|flac|ogg|aac)$/,
          type: 'asset',
          generator: {
            filename: 'static/assets/media/[name].[contenthash:4][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: userConfig?.limit ?? 1024 * 10
            }
          }
        },
        /* .woff, .woff2, otf, ttf */
        {
          test: /\.(woff2?|otf|ttf)$/,
          type: 'asset',
          generator: {
            filename: 'static/assets/fonts/[name].[contenthash:4][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: userConfig?.limit ?? 1024 * 10
            }
          }

        }
      ]
    },
    plugins: [
      // vue热更新
      new VueLoaderPlugin() as WebpackPluginInstance,
      // html文件
      new HtmlWebpackPlugin(
        invokeHandle(
          userConfig?.pluginOptions?.htmlWebpackPlugin, 
          Object.assign({
            inject:true,
            template: paths.appIndexHtml,
            },
            isPrd ? {
              minify: {
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
              }
            } : {})
        )
      ),
      // css提取
      isPrd && new MiniCssExtractPlugin(invokeHandle(userConfig?.pluginOptions?.miniCssExtractPlugin)),
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
      new CssMinimizerWebpackPlugin(invokeHandle(userConfig?.pluginOptions?.cssMinimizerWebpackPlugin))
      ]
    }
  }
}

export default rendererBaseConfig