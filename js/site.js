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
	$("#inline_code").on("contextmenu",function() { ga('send', 'event', 'Method', 'Direct', 'contextmenu', 1); });
	$("#inline_userscript").on("click",function() { ga('send', 'event', 'Method', 'Userscript', 'click', 1); });
	$("#inline_userscript").on("contextmenu",function() { ga('send', 'event', 'Method', 'Userscript', 'contextmenu', 1); });
	$("#inline_bookmarklet").on("click",function() { ga('send', 'event', 'Method', 'Bookmarklet', 'click', 1); });
	$("#inline_bookmarklet").on("contextmenu",function() { ga('send', 'event', 'Method', 'Bookmarklet', 'contextmenu', 1); });
	
});

//function ga (a,b,c,d) { console.log(arguments); }