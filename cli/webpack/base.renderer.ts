import path from "path";
import { VueLoaderPlugin } from 'vue-loader'
import { Configuration, WebpackPluginInstance } from "webpack";
import HtmlWebpackPlugin from 'html-webpack-plugin'
import babelRenderer from "../options/babel.renderer";
import { projectPath } from "../utils/paths";

const baseRenderer:Configuration = {
  mode:'development',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts','.node','.jsx','.tsx','.js', '.json', '.wasm'],
  },
  entry: {
    main: path.resolve(projectPath, './src/renderer/renderer.ts'),
  },
  output: {
    path: path.resolve(projectPath, 'build/renderer'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        options: babelRenderer,
        exclude: /node-modules/
      },
      {
        test: /\.(png|jpe?g|gif|bmp|webp|avif)$/,
        type:'asset',
        generator: {
          filename: 'images/[name][ext]'
        },
        parser:{
          datUrlCondition:{
            maxSize: 1024 * 10
          }
        }
      },
      {
        test: /\.(mp4|mp3|flac|aac|webm|wav)$/,
        type:'asset',
        generator: {
          filename: 'medias/[name][ext]'
        },
        parser:{
          datUrlCondition:{
            maxSize: 1024 * 10
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type:'asset',
        generator: {
          filename: 'fonts/[name][ext]'
        },
        parser:{
          datUrlCondition:{
            maxSize: 1024 * 10
          }
        }
      },
      {
        test: /\.node$/,
        loader:'node-loader'
      }
    ]
  },
  plugins:[
    new VueLoaderPlugin() as WebpackPluginInstance,
    new HtmlWebpackPlugin({
      template: path.resolve(projectPath, 'public/index.html')
    })
  ]
}

export default baseRenderer