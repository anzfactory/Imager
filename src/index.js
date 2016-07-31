'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = electron.dialog
const fs = require('fs')
const path = require('path')
const C = require('./C.js')
const ipcMain = electron.ipcMain;
const self = this
let win;
let menuTemplate = [{
  label: 'Imager',
  submenu: [
    {label: 'Abount'},
    { type: 'separator' },
    {label: 'Open Folder', click: function() {
      openFolderChoiceDialog()
    }},
    { type: 'separator' },
    {label: 'Quite', accelerator: 'CmdOrCtrl+Q', click: function() { app.quit(); }}
  ]
}]
let menu = Menu.buildFromTemplate(menuTemplate)

function createWindow() {
  Menu.setApplicationMenu(menu);
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL(`file://${__dirname}/index.html`);
  if (process.env.NODE_ENV !== 'prod') {
    win.webContents.openDevTools();
  }
  win.on('closed', () => {
    win = null;
  });
}

function openFolderChoiceDialog() {
  let focusWindow = BrowserWindow.getFocusedWindow()
  dialog.showOpenDialog(focusWindow, {
    properties: ['openDirectory']
  }, function(directories) {
    if (directories) {
      directories.forEach(function(directoryPath) {
        let openFiles = fs.readdirSync(directoryPath)
        for (let i = 0; i < openFiles.length; i++) {
          let path = openFiles[i]
          if (/(png|jpg|jpge|gif)$/i.exec(path)) {
            // 1つでも画像ファイルがあったので有効ディレクトリとする
            win.webContents.send(C.ipc.selectedDirectory, directoryPath)
            return
          }
        }
      })
    }

  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('will-quit', (event) => {
  if (process.env.NODE_ENV !== 'prod') {
    win.webContents.send(C.ipc.clearStorage)
  }
})
