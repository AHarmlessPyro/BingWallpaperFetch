const URLBASE = "https://www.bing.com";
const URLBASEEXTENSION = "/HPImageArchive.aspx?format=js";
const IMAGE_COUNT = "idx=";
const IMAGE_TO_SKIP = "n=";
const MARKET = "mkt=";
const IMGBASE = "https://www.bing.com";

const windowWidth = 1600;
const windowHeight = 900;

const pathToRegistry = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System';
const pathToFile = 'BingWallpaper'
const fileName = 'Output'

module.exports = Object.freeze({
    URLBASE,
    URLBASEEXTENSION,
    IMAGE_COUNT,
    IMAGE_TO_SKIP,
    MARKET,
    IMGBASE,
    windowWidth,
    windowHeight,
    pathToRegistry,
    pathToFile,
    fileName,
})