// Whoa so dynamic. Keep a backup since this won't last long enough to warrant changing the fickle "build system".
(()=>{
    const legacy = location.href.indexOf("psapp") > 0 ? "3" : "4";
    const psdleURL = `//repod.github.io/psdle/psdle${legacy}.js`
    const script = document.createElement('script');
    script.async = true;
    script.src = psdleURL;
    document.body.appendChild(script);
})()