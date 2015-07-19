/*
    Default javascript for PSDLE's website.
    How inefficient could it possibly be?
    
    Since we don't need namespace/external access a single module should be fine.
    
    Debating switching the entire page generation to Javascript/jQuery to make it scalable.
*/

$(document).ready(function() {
    // Select method
    $("#method_select > label").click(function() {
        $("#method_holder .collapse.in").not($(this).data("target")).collapse("hide");
        $("#method_holder "+$(this).data("target")).collapse("show");
        ga('send', 'event', 'Getting Started', 'click', $(this).text().trim());
    });
    
    // Events
    $("#paq_more").click(function() { ga('send', 'event', 'P.A.Q.', 'click', 'More...'); });
    
    // Navbar
    $(".navbar-toggle").click(function() { ga('send', 'event', 'Navbar', 'click', 'Toggle'); });
    $("nav li").click(function() { ga('send', 'event', 'Navbar', 'click', $(this).text().trim()); });
    
    // Conversions
    $("#inline_code").on("contextmenu",function() { ga('send', 'event', 'Method', 'contextmenu', 'Direct', 1); });
    $("#inline_userscript").on("click",function() { ga('send', 'event', 'Method', 'click', 'Userscript', 1); });
    $("#inline_userscript").on("contextmenu",function() { ga('send', 'event', 'Method', 'contextmenu', 'Userscript', 1); });
    $("#inline_bookmarklet").on("click",function() { ga('send', 'event', 'Method', 'click', 'Bookmarklet', 1); });
    $("#inline_bookmarklet").on("contextmenu",function() { ga('send', 'event', 'Method', 'contextmenu', 'Bookmarklet', 1); });
    
    var isChromium = window.chrome, vendorName = window.navigator.vendor;
    if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc.") {
       $("label[data-target=#method_extension]").click();
    }
});

//function ga (a,b,c,d) { console.log(arguments); }