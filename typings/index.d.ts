import { Configuration as WebpackOption } from 'webpack'
import { Configuration as DevOption } from 'webpack-dev-server'


type anyObj = { [key: string]: any } 


type optionsType = anyObj | ((config:anyObj) => anyObj)

declare interface CliConfig {
  renderer?: {
    limit?: number
    webpackConfig?: WebpackOption | ((config: WebpackOption) => WebpackOption)
    devServer?: DevOption
    pluginOptions?: {
      htmlWebpackPlugin?: optionsType
      miniCssExtractPlugin?: optionsType
      copyWebpackPlugin?: optionsType
      environmentPlugin?: optionsType
      webpackBar?: optionsType
      terserWebpackPlugin?: optionsType,
      cssMinimizerWebpackPlugin?: optionsType
      [key: string]: any
    },
    loaderOptions?: {
      cssLoader?: optionsType
      postcssLoader?: optionsType
      sassLoader?: optionsType
      babelLoader?: optionsType
      vueLoader?: optionsType
      [key: string]: any
    }
  }
  main?: {
    webpackConfig?: WebpackOption | ((config: WebpackOption) => WebpackOption)
    pluginOptions?: {
      copyWebpackPlugin?: optionsType
      webpackBar?: optionsType
      terserWebpackPlugin?: optionsType,
      [key: string]: any
    },
    loaderOptions?: {
      babelLoader?: optionsType
      [key: string]: any
    }
  }
  preload?: {
    webpackConfig?: WebpackOption | ((config: WebpackOption) => WebpackOption)
    pluginOptions?: {
      copyWebpackPlugin?: optionsType
      webpackBar?: optionsType
      terserWebpackPlugin?: optionsType,
      [key: string]: any
    },
    loaderOptions?: {
      babelLoader?: optionsType
      [key: string]: any
    }
  }
}

declare module '@soda/friendly-errors-webpack-plugin';