const { ipcRenderer } = require('electron');


ipcRenderer.on('runFetchFunction', () => {

    console.log(document.getElementById('sidePanel'));
    try {
        var req = new XMLHttpRequest();

        var panel = document.getElementById('sidePanel');

        req.addEventListener('load', () => {
            console.log(req);
            JSON.parse(req.response).images.forEach(element => serveImage(element));
        })
        req.open('POST', 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=5&mkt=en-US', true);
        req.send();
    } catch (error) {
        console.error(error);
    }



})

function serveImage(dat) {
    console.log(dat);

    document.getElementById('sidePanel').insertAdjacentHTML(
        'beforeend',
        '<div class="col-12 p-0 previewImageContainer mt-3" >' +
        `<img src="https://bing.com/${dat.url}" class = "previewImage"><span class="tooltiptext tooltip-bottom">${dat.title}</span></div>`);
    //debugger;
    var lastChild = document.getElementById('sidePanel').lastChild;


    console.log();
    console.log();
    /*window.getComputedStyle(document.querySelector('#sidePanel').lastChild.lastChild, null)['width'] */
    console.log(window.getComputedStyle(document.querySelector('#sidePanel').lastChild.lastChild, null)['width']);
    var offset = (-parseInt(window.getComputedStyle(document.querySelector('#sidePanel').lastChild.lastChild, null)['width'])/2).toString();
    lastChild.lastChild.style.marginLeft = offset;
    console.log(offset);
    console.log(document.querySelector('#sidePanel').lastChild.lastChild.style.marginLeft)
    /*console.log(lastChild.firstChild.style.maxWidth);
    console.log(lastChild.lastChild.style.maxWidth);*/


    //lastChild.lastChild.style.marginLeft = -lastChild.offsetWidth / 2;
}