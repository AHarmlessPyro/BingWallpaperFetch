let regedit = require('regedit');
let fs = require('fs');
let mkdirp = require('mkdirp');
let appPath = require('electron').remote.app;
let { pathToRegistry, pathToFile, fileName } = require('./constants');

function GetWallpaper(path) {
    return new Promise((resolve, reject) => {
        let dat = "";
        regedit.list(path)
            .on('data', function (entry) {
                dat += entry;
            }).on('finish', function () {
                if (dat === "") {
                    reject({
                        result: null,
                        completion: false
                    });
                }
                resolve({
                    result: dat,
                    completion: true
                });
            })
            .on('error', function (error) {
                reject({
                    result: error,
                    completion: false
                });
            })
    })
}


function SetWallpaper(pathToCurrentImage, style = 4) {
    regedit.createKey(pathToRegistry, (error, results) => {
        if (error) {
            console.error(error);
        }
        console.log(results);
    })

    console.log("Attempting to add file to registry");
    AddImageToRegistry(pathToCurrentImage, style);
    
}

function AddImageToRegistry(pathToCurrentImage, style) {
    let fileDirActual = appPath.getPath('appData') + '\\' + pathToFile;
    let filePathActual = fileDirActual + '\\' + fileName;
    try {
        // extract only data from image stored in session data.
        let fileBase64 = JSON.parse(window.sessionStorage.getItem(pathToCurrentImage)).data;
        

        // Create a folder to %APPDATA/BingWallpaper.
        // Using mkdirp package as it creates folders recursively to target
        mkdirp(fileDirActual, (error) => {
            if (error) {
                console.error(error);
                // On error, return back, don't try to interfere with system stuff.
                return;
            }
        });

        // Buffers make it easy to store data and save it to a file.
        var imageBuffer = Buffer.from(fileBase64, 'base64');

        // Write file synchronously. Best way right now.
        // Maybe in future do it async
        fs.writeFileSync(filePathActual, imageBuffer, 'utf-8', (error) => {
            console.error(error);
            return;
        })

        // Add mapping to registry.
        // Also required for setting the image tiling (if any)
        regedit.putValue({
            [pathToRegistry]: {
                '@': {
                    value: 'some_value',
                    type: 'REG_DEFAULT'
                },
                'Wallpaper': {
                    value: filePathActual,
                    type: 'REG_SZ'
                }, 'WallpaperStyle': {
                    value: style,
                    type: 'REG_SZ'
                }
            }
        }, (error) => {
            // required as even on setting, an undefined error is provided as default. Ignore in that case.
            if (error) {
                console.error(error);
            }
        })
        //}
    } catch (err) {
        console.error(err)
    }

}

module.exports = {
    SetWallpaper: SetWallpaper,
    GetWallpaper: GetWallpaper
}