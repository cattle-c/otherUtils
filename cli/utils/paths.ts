import { realpathSync } from "fs"
import { resolve } from "path"

const cwd = realpathSync(process.cwd())
const resolveApp = (relativePath:string): string => resolve(cwd, relativePath)

/**
 * 应用程序相关路径信息的默认值
*/
export default {
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  
  appRenderer: resolveApp('src/renderer'),
  appRendererEntry: resolveApp('src/renderer/renderer.ts'),
  appRendererBuild: resolveApp('build/renderer'),

  appMain: resolveApp('src/main'),
  appMainEntry: resolveApp('src/main/main.ts'),
  appMainDevCache:resolveApp('./.cache/main'),
  appMainDevCacheEntry: resolveApp('./.cache/main/main.js'),
  appMainBuild: resolveApp('build/main'),


  appPreload: resolveApp('src/preload'),
  appPreloadEntry: resolveApp('src/preload/preload.ts'),
  appPreloadDevCache:resolveApp('./.cache/preload'),
  appPreLoadDevCacheEntry: resolveApp('./.cache/preload/preload.js'),
  appPreloadBuild: resolveApp('build/preload'),

  appPublic: resolveApp('public'),
  appIndexHtml: resolveApp('public/index.html'),

  appCliConfig: resolveApp('cli.config.ts'),


  publicPath: '/'
}