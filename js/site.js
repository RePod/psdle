$(document).ready(function(){
 $("#method_select > label").click(function(){
  var t=$(this).data("target")
  $("#method_holder .collapse.in").not(t).collapse("hide")
  $("#method_holder "+t).collapse("show")
  ga('send','event','Getting Started','click',$(this).text().trim())
 })
 if(window.chrome&&window.navigator.vendor==="Google Inc."){$("label[data-target=#method_extension]").click()}
 $("#paq_more").click(function(){ga('send','event','P.A.Q.','click','More...')})
 $(".navbar-toggle").click(function(){ga('send','event','Navbar','click','Toggle')})
 $("nav li").click(function(){ga('send','event','Navbar','click',$(this).text().trim())})
 $("#inline_code").on("contextmenu",function(){ga('send','event','Method','contextmenu','Direct',1)})
 $("#inline_bookmarklet,#inline_userscript").on("contextmenu click",function(e){ga('send','event','Method',e.type,$(this).attr("id").split("_").pop(),1)})
})