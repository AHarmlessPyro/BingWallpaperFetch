// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')

let win;

let data = new Object();

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1600,
        height: 900,
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
app.on('ready', createWindow)

app.on('ready', () => {
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

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
    //webFrame.setZoomFactor(1);  
})

function init_Data() {
    data["scout"] = new Object();
    data["soldier"] = new Object();
    data["pyro"] = new Object();
    data["demoman"] = new Object();
    data["heavy"] = new Object();
    data["engineer"] = new Object();
    data["medic"] = new Object();
    data["sniper"] = new Object();
    data["spy"] = new Object();
    data["general"] = new Object();
}