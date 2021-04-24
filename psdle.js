(()=>{
psdleSkip=true//Temporary..?
const variant=(typeof Ember === "object")>0?"valkyrie":"gotham"
const psdleURL=`//repod.github.io/psdle/psdle.${variant}.min.js`
const script=document.createElement('script')
script.async=true
script.src=psdleURL
document.body.appendChild(script)
})()