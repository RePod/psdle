//Default javascript for PSDLE's website. Generally Google Analytics integration and fancy stuff.
$(document).ready(function() {
    //Select method
    $("#method_select > label").click(function() {
        $("#method_holder .collapse.in").not($(this).data("target")).collapse("hide");
        $("#method_holder "+$(this).data("target")).collapse("show");
        ga('send','event','Getting Started','click',$(this).text().trim());
    });
    if(window.chrome !== null && window.chrome !== undefined && window.navigator.vendor === "Google Inc."){$("label[data-target=#method_extension]").click();}
    //Events
    $("#paq_more").click(function(){ga('send','event','P.A.Q.','click','More...');});
    //Navbar
    $(".navbar-toggle").click(function(){ga('send','event','Navbar','click','Toggle');});
    $("nav li").click(function(){ga('send','event','Navbar','click',$(this).text().trim());});
    //Conversions
    $("#inline_code").on("contextmenu",function(){ga('send','event','Method','contextmenu','Direct',1);});
    $("#inline_userscript").on("click",function(){ga('send','event','Method','click','Userscript',1);});
    $("#inline_userscript").on("contextmenu",function(){ga('send','event','Method','contextmenu','Userscript',1);});
    $("#inline_bookmarklet").on("click",function(){ga('send','event','Method','click','Bookmarklet',1);});
    $("#inline_bookmarklet").on("contextmenu",function(){ga('send','event','Method','contextmenu','Bookmarklet',1);});
});