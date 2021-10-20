// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
let tray = null;

let contextMenu = Menu.buildFromTemplate([
  {
    label: 'Show App', click: function () {
      mainWindow.show();
    }
  },
  {
    label: 'Quit', click: function () {
      application.isQuiting = true;
      application.quit();
    }
  }
]);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maximizable: true,
    titleBarStyle: "hidden",
    title: "Azure Devops Client",
    backgroundColor: "#201f1e",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      allowRunningInsecureContent: true,
      nativeWindowOpen: true,
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools();

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!application.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  tray = new Tray('./images/icon.png');
  tray.setContextMenu(contextMenu);
  tray.setTitle('Devops');
}


app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('web-contents-created', function (webContentsCreatedEvent, contents) {
  if (contents.getType() === 'webview') {
    contents.on('new-window', function (newWindowEvent, url) {
      newWindowEvent.preventDefault();
      console.log(url);
      contents._loadURL(url, {});
      console.log('block');
    });
  }
});

app.commandLine.appendSwitch('disable-web-security');