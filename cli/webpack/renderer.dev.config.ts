import { Configuration } from "webpack"
import WebpackDevServer from 'webpack-dev-server'
import portfinder from 'portfinder'
import { CliConfig } from "../../typings"
import paths from "../utils/paths"


export default async function rendererDevConfig(webpackEnv: Configuration['mode'], userConfig: CliConfig['renderer']):Promise<WebpackDevServer.Configuration>{
  const port = await portfinder.getPortPromise({ port: (userConfig?.devServer?.port as number) ?? 3000 })
  return {
    port,
    host: userConfig?.devServer?.host ?? '0.0.0.0',
    hot: true,
    static: {
      directory: paths.appPublic,
      publicPath: paths.publicPath,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    historyApiFallback: {
      disableDotRule:true,
      index: paths.appIndexHtml
    }
  }
}