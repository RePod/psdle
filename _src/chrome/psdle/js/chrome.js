console.info("PSDLE Chrome | *radio static* I'm in",window,document)
var isValkyrie = location.hostname == "transact.playstation.com"
var variant = isValkyrie ? "valkyrie" : "gotham"

if (!isValkyrie) {
    var qualityElementDetector5000 = setInterval(function() {
        clearInterval(qualityElementDetector5000)
        document.querySelector(".psw-drawer").style['max-width'] = '95%'
        document.querySelector(".psw-drawer").style['min-width'] = '95%'
        document.querySelector(".psw-drawer").style['width'] = '100%'
    }, 1000)
}