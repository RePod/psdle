$(document).ready(function(){
 $("#paq_container").addClass("collapse") //Auto-collapse when we can script
 $("#method_select > label").click(function(){
  var t=$(this).data("target")
  $("#method_holder > *").not(t).collapse("hide")
  $("#method_holder "+t).collapse("show")
  //ded: ga('send','event','Getting Started','click',$(this).text().trim())
 });
 var ff57regex = /(?:rv:|Firefox\/)([\d\.]+)/i,
     ff57 = (ff57regex.test(navigator.userAgent) && parseInt(navigator.userAgent.match(ff57regex).pop()) >= 57),
     chrome=(window.chrome&&window.navigator.vendor==="Google Inc."),
     mobile=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|mobile/ig.test(navigator.userAgent))
 if((chrome || ff57) && !mobile){$("label[data-target=#method_extension]").click()}
 if (mobile){var a=$("#psdle_bit");a.text(a.text().replace(".js",".min.js"));}//min on mobile.
 /*
 $("#paq_more").click(function(){ga('send','event','P.A.Q.','click','More...')})
 $(".navbar-toggle").click(function(){ga('send','event','Navbar','click','Toggle')})
 $("nav li").click(function(){ga('send','event','Navbar','click',$(this).text().trim())})
 $("#inline_code").on("contextmenu",function(){ga('send','event','Method','contextmenu','Direct',1)})
 $("#inline_bookmarklet,#inline_userscript").on("contextmenu click",function(e){ga('send','event','Method',e.type,$(this).attr("id").split("_").pop(),1)})
 */
})