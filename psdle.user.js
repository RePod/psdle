// ==UserScript==
// @author		RePod
// @name		PSDLE for Greasemonkey (auto)
// @description	Automatically load PSDLE for Valkyrie or Gotham.
// @namespace	https://github.com/RePod/psdle
// @homepage	https://repod.github.io/psdle/
// @include		/https://store.playstation.com/*/
// @include		/https://library.playstation.com/*/
// @exclude		/https://store.playstation.com/(cam|liquid)/*/
// @updateURL	https://repod.github.io/psdle/psdle.user.js
// @downloadURL	https://repod.github.io/psdle/psdle.user.js
// @icon		https://repod.github.io/psdle/logo/6_psdle_64px.png
// @grant		none
// @noframes
// ==/UserScript==

(()=>{
  setTimeout(function() {
      psdleSkip=true
      const variant=(typeof Ember === "object")>0?"valkyrie":"gotham"
      const psdleURL=`//repod.github.io/psdle/psdle.${variant}.min.js`
      const script=document.createElement('script')
      script.async=true
      script.src=psdleURL
      document.body.appendChild(script)
    },2000) //Temporary
})()