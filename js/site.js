$(document).ready(function(){
 $("#method_select > label").click(function(){
  var t=$(this).data("target")
  $("#method_holder .collapse.in").not(t).collapse("hide")
  $("#method_holder "+t).collapse("show")
  ga('send','event','Getting Started','click',$(this).text().trim())
 })
 var chrome=(window.chrome&&window.navigator.vendor==="Google Inc."),
     mobile=(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|mobile/ig.test(navigator.userAgent));
 if(chrome && !mobile){$("label[data-target=#method_extension]").click()}
 else if(chrome && mobile){}//Direct
 else if (!chrome && mobile){$("label[data-target=#method_bookmarklet]").click()}
 else if (mobile){$("label[data-target=#method_direct]").click()}
 $("#paq_more").click(function(){ga('send','event','P.A.Q.','click','More...')})
 $(".navbar-toggle").click(function(){ga('send','event','Navbar','click','Toggle')})
 $("nav li").click(function(){ga('send','event','Navbar','click',$(this).text().trim())})
 $("#inline_code").on("contextmenu",function(){ga('send','event','Method','contextmenu','Direct',1)})
 $("#inline_bookmarklet,#inline_userscript").on("contextmenu click",function(e){ga('send','event','Method',e.type,$(this).attr("id").split("_").pop(),1)})
})