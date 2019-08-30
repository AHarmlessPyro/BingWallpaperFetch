const { ipcRenderer } = require('electron');
const { URLBASE, IMAGE_COUNT, IMAGE_TO_SKIP, MARKET, IMGBASE } = require('./js/constants')
const request = require('request').defaults({ encoding: null });

ipcRenderer.on('runFetchFunction', () => {
    const fetchedImage = 10;
    const skippedImage = 3;
    const MARKET_TO_USE = 'en-US'

    let request_url = `${URLBASE}&${IMAGE_COUNT}${skippedImage}&${IMAGE_TO_SKIP}${fetchedImage}&${MARKET}${MARKET_TO_USE}`;
    try {
        let req = new XMLHttpRequest();
        req.addEventListener('load', () => {
            console.log(JSON.parse(req.response));

            JSON.parse(req.response).images.forEach(element => { serveImage(element) });

            document.getElementsByClassName('previewImage').array.forEach(element => {
                element.addEventListener('onclick')
            });
        })
        req.open('POST', request_url, true);
        req.send();
    } catch (error) {
        console.error(error);
    }

})

function serveImage(dat) {

    var prom = new Promise((resolve, reject) => {
        getImageBase64(resolve, reject, (IMGBASE + dat.url.replace('1920x1080', '1366x768')))
    }
    );

    prom.then((value) => embedImageinSidePanel(dat, value)).catch(
        (reason) => {
            console.error(reason);
        }
    )
    //console.log(window.sessionStorage.getItem(dat.url));
}

function getImageBase64(resolve, reject, url) {
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
            resolve(data);
        } else {
            reject(error);
        }
    });
}

function embedImageinSidePanel(dat, image) {
    sessionStorage.setItem(dat.hsh, {
        image: image,

    });
    document.getElementById('sidePanel').insertAdjacentHTML(
        'beforeend',
        `<div class="col-12 p-0 previewImageContainer mb-3"> 
            <img src="${image}" class = "previewImage" value=${dat.hsh} onclick=""> 
            <div class="tooltiptext tooltip-bottom">
            ${dat.title} 
            </div> 
        </div>`);
}
