const { ipcRenderer, shell } = require('electron');
const { URLBASE, URLBASEEXTENSION, IMAGE_COUNT, IMAGE_TO_SKIP, MARKET, IMGBASE } = require('./constants')
const request = require('request').defaults({ encoding: null });
const { SetWallpaper } = require('./Windows_Wallpaper_interface');

ipcRenderer.on('runFetchFunction', () => {
    const fetchedImage = 10;
    const skippedImage = 3;
    const MARKET_TO_USE = 'en-US'

    let request_url = `${URLBASE}${URLBASEEXTENSION}&${IMAGE_COUNT}${skippedImage}&${IMAGE_TO_SKIP}${fetchedImage}&${MARKET}${MARKET_TO_USE}`;
    try {
        let req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            console.log(JSON.parse(req.response));

            JSON.parse(req.response).images.forEach(element => { serveImage(element) });
        })
        req.open('POST', request_url, true);
        req.send();
    } catch (error) {
        console.error(error);
    }
})

function serveImage(dat) {
    var prom = new Promise((resolve, reject) => {
        getImageBase64(resolve, reject, (IMGBASE + dat.url.replace('1920x1080', '1366x768')), dat)
    });

    prom.then((value) => {
        embedImageinSidePanel(dat, value);
        console.log(document.getElementById(dat.hsh));
        previewImageOnClick(document.getElementById(dat.hsh));
    }).catch(
        (reason) => {
            console.error(reason);
        }
    )
}

function getImageBase64(resolve, reject, url, miscInfo) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            header = "data:" + response.headers["content-type"] + ";base64,";
            data = Buffer.from(body).toString('base64');
            resolve({
                header: header,
                data: data,
                misc: miscInfo,
            });
        } else {
            reject(error);
        }
    });
}

function embedImageinSidePanel(dat, image) {
    sessionStorage.setItem(dat.hsh,
        JSON.stringify(image)
    );
    console.log("Image element created");
    document.getElementById('sidePanel').insertAdjacentHTML(
        'beforeend',
        `<div class="col-12 p-0 previewImageContainer mb-3"> 
            <img src="${image.header + image.data}" class = "previewImage" id=${dat.hsh}> 
            <div class="tooltiptext tooltip-bottom">
            ${dat.title} 
            </div> 
        </div>`);
}



function previewImageOnClick(element) {
    element.addEventListener('click', function (event) {

        let imageValues = JSON.parse(window.sessionStorage.getItem(event.target.id.toString()))

        console.log(imageValues);

        document.getElementById('infoBox').style.display = 'flex';

        document.getElementById('quizLink').onclick = () => { shell.openExternal(`${URLBASE + imageValues.misc.quiz}`); };
        document.getElementById('description').innerHTML = `${imageValues.misc.copyright}`


        document.getElementById('selectedImageViewer').src = imageValues.header + imageValues.data;
        document.getElementById('selectedImageViewer').value = (event.target.id.toString());
        document.getElementById("setWallpaper").removeEventListener('click', SetWallpaperFunction);
        document.getElementById("setWallpaper").addEventListener('click', SetWallpaperFunction);
    }, false)
}

function SetWallpaperFunction() {
    SetWallpaper(document.getElementById('selectedImageViewer').value.toString());
}

