import electron from "electron";
import childProcess from 'child_process'
import paths from "../../utils/paths"
import mainDev from "./mainDev"
import preloadDev from './preloadDev'
import rendererDev from "./rendererDev"
import path from "path"
let electronProcess:childProcess.ChildProcessWithoutNullStreams


export default async function electronDev(){
  await rendererDev()
  await preloadDev(startElectron)
  await mainDev(startElectron)

}


function startElectron(){

  if(electronProcess && electronProcess.pid) {
    process.kill(electronProcess.pid)
  }

  electronProcess = childProcess.spawn(electron as unknown as string, [path.resolve(process.cwd(), './.cache/main/main.js')])

  
  electronProcess.stdout.on('data', data => {
    console.log('stdout', String(data), data);
  })

  electronProcess.stderr.on('data', data => {
    console.log('stderr', String(data), data);
  })

  electronProcess.on('close', code => {
  

  })
  
}
