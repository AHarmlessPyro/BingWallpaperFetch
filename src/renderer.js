const { ipcRenderer } = require('electron');
const { URLBASE, IMAGE_COUNT, IMAGE_TO_SKIP, MARKET, IMGBASE } = require('./js/constants')

const listOfImages = [];

ipcRenderer.on('runFetchFunction', () => {

    const START_DATE = 40;

    const END_DATE = 10;

    const MARKET_TO_USE = 'en-US'

    let request_url = `${URLBASE}&${IMAGE_COUNT}${END_DATE}&${IMAGE_TO_SKIP}${START_DATE}&${MARKET}${MARKET_TO_USE}`;

    console.log(request_url);

    try {
        let req = new XMLHttpRequest();

        req.addEventListener('load', () => {
            JSON.parse(req.response).images.forEach(element => serveImage(element));
        })
        req.open('POST', request_url, true);
        req.send();
    } catch (error) {
        console.error(error);
    }

})

function serveImage(dat) {

    let req = new XMLHttpRequest();

    try {
        req.addEventListener('load', () => {
            listOfImages.push({
                image: req
            });
            console.log(req);
            console.log(listOfImages);

            document.getElementById('sidePanel').insertAdjacentHTML(
                'beforeend',
                `<div class="col-12 p-0 previewImageContainer mt-3" > 
                    <img src="${IMGBASE + dat.url}" class = "previewImage"> 
                        <div class="tooltiptext tooltip-bottom">${dat.title} 
                    </div> 
                </div>`);

        })
    } catch (error) {

    }

    req.open('GET', IMGBASE + dat.url);
    req.send();
}