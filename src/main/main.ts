import { app, BrowserWindow } from 'electron'
import path from 'path'


app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width:800,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/preload.js'),
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.loadURL('http://localhost:3000')

}).catch(err => {
  console.log(err);
  
})