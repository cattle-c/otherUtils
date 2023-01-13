import { app, BrowserWindow } from 'electron'


app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })
  win.webContents.openDevTools()
})