console.info("PSDLE Chrome | *radio static* I'm in",window,document)

const URLS = {
    VALKYRIE: "transact.playstation.com",
    GOTHAM: "library.playstation.com"
}
var isValkyrie = !!location.hostname.match(URLS.VALKYRIE)
var variant = isValkyrie ? "valkyrie" : "gotham"

function injectScript (src) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(src);
    s.onload = () => s.remove();
    (document.head || document.documentElement).append(s);
}

if (!isValkyrie) {
    var qualityElementDetector5000 = setInterval(function() {
        if (document.querySelector(".psw-drawer")) {
            clearInterval(qualityElementDetector5000)
            document.querySelector(".psw-drawer").style['max-width'] = '95%'
            document.querySelector(".psw-drawer").style['min-width'] = '95%'
            document.querySelector(".psw-drawer").style['width'] = '100%'
        }
    }, 1000)
}

injectScript(`js/psdle.${variant}.js`)