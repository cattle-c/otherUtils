import path from 'path'
import { projectPath } from '../utils/paths'
import type { Configuration } from 'webpack'


export default {
  target: 'electron-main',
  resolve: {
    alias: {
      '@main': path.resolve(projectPath, 'src/main'),
    },
    extensions: ['.ts', '.js', '.node']
  },
  entry: {
    main: path.resolve(projectPath, 'src/main/main.ts')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(projectPath, './build/main'),
    clean: true,
    library:{
      type: 'commonjs2'
    }
  },
  module:{
    rules:[
      {
        test: /\.node$/,
        loader:'node-loader'
      }
    ]
  }
} as Configuration