// Modules to control application life and create native browser window
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const { windowWidth, windowHeight } = require('./js/constants');

let win;

let data = new Object();

function createWindow() {
    // Create the browser window.
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize

    console.log({
        width: (windowWidth > width ? width : windowWidth),
        height: (windowHeight > height ? height : windowHeight),
    });

    win = new BrowserWindow({
        width: (windowWidth > width ? width : windowWidth),
        height: (windowHeight > height ? height : windowHeight),
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // set internal size of page to 800x600.
    //win.setContentSize(1600, 900);
    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
    //console.log(screen.getPrimaryDisplay());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

    createWindow();

    console.log("app ready");
    win.webContents.on('did-finish-load', () => {
        console.log("window ready");
        win.webContents.send('runFetchFunction');
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (win === null) {
//         createWindow()
//     }
//     //webFrame.setZoomFactor(1);  
// })