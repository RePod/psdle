//See LICENSE file for licensing details, available in the "psdle" repository on GitHub. TL;DR: MIT, do what you want.

var repod = {};
repod.muh_games = {
	gamelist: [],
	lang: {
		"en-us":{"startup":"Waiting on page to load.","columns":{"icon":"Icon","name":"Name","platform":"Platform","size":"Size","date":"Date"},"labels":{"avatar":"Avatars","demo":"Demos","unlock":"Unlocks","pass":"Passes","pack":"Packs","theme":"Themes","page":"Page"},"regex":{"avatar":" Avatar$","demo":" Demo$","unlock":" Unlock$","pass":" Pass$","pack":" Pack$","theme":" Theme$"}},
		"de-de":{"startup":"Seite wird geladen, bitte warten.","columns":{"icon":"Symbol","name":"Name","platform":"Plattform","size":"Größe","date":"Datum"},"labels":{"avatar":"Spielerbilder","demo":"Demos","unlock":"Freischaltbares","pass":"Pässe","pack":"Bündel","theme":"Themen","page":"Seite"},"regex":{"avatar":" (Avatare?|Spielerbilder)$","demo":" Demo$","unlock":" Freigeschaltet$","pass":" Pass$","pack":" (Kollektion|Bündel|Sammlung)$","theme":" Thema$"}} // Provided by /u/_MrBubbles
	}, 
	init: function() {
		this.config = {
			totalgames: 0,
			past: "",
			timerID: 0,
			delay: 3000,
			lastsort: "",
			lastsort_r: false,
			language: window.location.href.match(/\/([a-z]{2}\-(?:[a-z]{4}-)?[a-z]{2})\//i)[1]
		};
		this.lang = (this.config.language in this.lang) ? this.lang[this.config.language] : this.lang["en-us"];
		this.injectCSS();
		this.genDisplay();
		this.startTimer();
		return 1;
	},
	parsePage: function() {
		var that = this;
		this.config.totalgames = parseInt($(".statsText").text().match(/(\d+)/g).pop());
		if ($(".gridViewportPaneWrapper").html() !== this.config.past) {
			this.config.past = $(".gridViewportPaneWrapper").html();
			$("#psdle_status").text((this.gamelist.length/24+1)+" / "+Math.ceil(this.config.totalgames/24));
			$("li.cellDlItemGame").each(function() {
				var info = $(this).find(".mediaInfo");
				var gametitle = info.find(".gameTitle").text();
				var size = info.find(".size").text().replace("|","");
				var platform = [];
				var date = info.find(".purchaseDate").text().replace("|","");
				var icon = $(this).find(".thumbPane").find("img").attr("src");
				var url = $(this).find(".thumbPane").parent().attr("href");
				info.find(".playableOn").children("a").each(function() { platform.push($(this).text()) });
				that.gamelist.push({id:(that.gamelist.length +1),title:gametitle,size:size,platform:platform,date:date,url:url,icon:icon});
			});
			$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((this.gamelist.length/24) / Math.ceil(this.config.totalgames/24) * 100)+"%"});
			if (this.gamelist.length >= this.config.totalgames) {
				clearInterval(this.config.timerID);
				this.genTable();
			} else {
				this.nextPage();
			}
		}
		return 1;
	},
	startTimer: function(delay) {
		var that = this;
		var delay = (delay) ? delay : this.config.delay;
		this.config.timerID = setInterval(function(){that.parsePage();},delay);
		return 1;
	},
	nextPage: function() {
		$(".navLinkNext").trigger("click"); //Anonymous functions, please.
		return 1;
	},
	genDisplay:function() {
		$("body").append("<div id='muh_games_container' />");
		$("#muh_games_container").append("<div id='sub_container'><span style='display:inline-block;font-size:300%;font-weight:bold'>psdle</span><br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>"+this.lang.startup+"</span></div>");
		$("#muh_games_container").slideDown('slow');
		return 1;
	},
	genTable: function() {
		$("#sub_container").html(this.genSearchOptions());
		$("#sub_container").append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+this.lang.columns.icon+"</th><th id='sort_name'>"+this.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+this.lang.columns.platform+"</th><th id='sort_size'>"+this.lang.columns.size+"</th><th id='sort_date'>"+this.lang.columns.date+"</th></tr></thead><tbody>"+this.genTableContents()+"</tbody></table>");
		this.sortGamelist("#sort_date");
		return 1;
	},
	regenTable: function() {
		$("#muh_table > tbody").html(this.genTableContents());
		return 1;
	},
	genTableContents: function() {
		var that = this;
		var temp = "";
		var safesys = this.safeSystemCheck();
		$.each(this.gamelist,function(index,val) {
			var sys = that.safeGuessSystem(val.platform);
			if ($.inArray(sys,safesys) > -1) { 
				//Valid system.
				var a = true; var t = val.title;
				if ($("#filter_avatar").hasClass("toggled_off") && new RegExp(that.lang.regex.avatar,"i").test(t)) a = false; 
				if ($("#filter_demo").hasClass("toggled_off") && new RegExp(that.lang.regex.demo,"i").test(t)) a = false;
				if ($("#filter_unlock").hasClass("toggled_off") && new RegExp(that.lang.regex.unlock,"i").test(t)) a = false;
				if ($("#filter_pass").hasClass("toggled_off") && new RegExp(that.lang.regex.pass,"i").test(t)) a = false;
				if ($("#filter_pack").hasClass("toggled_off") && new RegExp(that.lang.regex.pack,"i").test(t)) a = false;
				if ($("#filter_theme").hasClass("toggled_off") && new RegExp(that.lang.regex.theme,"i").test(t)) a = false;
				if (a) {
					var u = val.url;
					temp += "<tr><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+u+"'><img title='"+that.lang.labels.page+" #"+Math.ceil(val.id/24)+"' src='"+val.icon+"' class='psdle_game_icon' /></a></td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+t+"</a></td><td>"+sys+"</td><td>"+val.size+"</td><td>"+val.date+"</td></tr>";
				}
			}
		});
		return temp;
	},
	genSearchOptions: function() {
		//TO-DO: Make scalable.
		var that = this;
		$(document).on("click","span[id^=system_], span[id^=filter_]", function() { that.toggleButton($(this)); that.regenTable(); });
		$(document).on("click","th[id^=sort_]", function(e) { that.sortGamelist($(this)); });
		var temp = '<div style="text-align:center;width:100%">' +
					'<span id="system_ps3">PS3</span>' +
					'<span id="system_ps4">PS4</span>' +
					'<span id="system_psp">PSP</span>' +
					'<span id="system_psv">PS Vita</span>' +
					'<hr style="display:inline-block;width:20px">' +
					'<span id="filter_avatar">'+this.lang.labels.avatar+'</span>' +
					'<span id="filter_demo">'+this.lang.labels.demo+'</span>' +
					'<span id="filter_unlock">'+this.lang.labels.unlock+'</span>' +
					'<span id="filter_pass">'+this.lang.labels.pass+'</span>' +
					'<span id="filter_pack">'+this.lang.labels.pack+'</span>' +
					'<span id="filter_theme">'+this.lang.labels.theme+'</span>' +
					//"<br /><input type='text' id='psdle_search_text' placeholder='Search by game title (/regex/mod)' title='Non-regex searches are case-insensitive, regex searches can toggle.'/>"+
					'</div>';
		return temp;
	},
	sortGamelist: function(e) {
		var that = this;
		var e = $(e).attr("id");
		if (e == "sort_date") {
			this.gamelist.sort(function (a, b) {
				if (a.id > b.id) return 1;
				if (a.id < b.id) return -1;
				return 0;
			});
		}
		if (e == "sort_name") {
			this.gamelist.sort(function (a, b) {
				if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()) return 1;
				if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) return -1;
				return 0;
			});	
		}
		if (e == "sort_size") {
			this.gamelist.sort(function (a, b) {
				if (that.returnKB(a.size) > that.returnKB(b.size)) return 1;
				if (that.returnKB(a.size) < that.returnKB(b.size)) return -1;
				return 0;
			});
		}
		if (e == this.config.lastsort) { if (!this.config.lastsort_r) { this.gamelist.reverse(); } this.config.lastsort_r = !this.config.lastsort_r; }
		else { this.config.lastsort_r = false; }
		$("#psdle_sort_display").remove();
		$("#"+e).append("<span id='psdle_sort_display' class='psdle_sort_"+((this.config.lastsort_r)?"asc":"desc")+"' />");
		this.config.lastsort = e;
		this.regenTable();
		return 1;
	},
	toggleButton: function(e) {
		$(e).toggleClass("toggled_off");
		return 1;
	},
	safeSystemCheck: function() {
		var temp = [];
		$("span[id^=system_]:not('.toggled_off')").each(function() { temp.push($(this).text()); });
		return temp;
	},
	safeGuessSystem: function(e) {
		//Quick, dirty, and easy.
		var sys = e.join(" ");
		if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP") { sys = "PSP"; }
		if (sys == "PS3 PS Vita") { sys = "PS Vita"; }
		if (sys == "PS3") { sys = sys; }
		if (sys == "PS4") { sys = sys; }
		return sys;
	},
	injectCSS: function() {
		var temp = "#muh_games_container { display:none;position:absolute;top:0px;bottom:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { background-color:#fff; padding:20px; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#ccc;width:0%;height:100%;border-radius:10px; }" + //Startup
					"th[id^=sort] { cursor:pointer; } table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;} td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding:3px;} th, tr:hover{background-color:#ccc;}" + //Table
					"#psdle_search_text { margin:5px auto;padding:5px;font-size:large;width:100%; } span[id^=system_], span[id^=filter_], span#psdle_regen, span[id^=sort_] { border-radius:5px;border:1px solid #fff;font-weight:bold;text-transform:uppercase;font-size:small;color:#fff;padding:1px 3px;bottom:3px;display:inline-block;vertical-align:20%;background-color:#000;cursor:pointer; } .toggled_off { opacity:0.4; }" + //Search buttons
					".psdle_game_icon { max-width:100%;vertical-align:middle }" + //Content icons
					".psdle_sort_asc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid black; } .psdle_sort_desc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid black; }";
		$("<style type='text/css'>"+temp+"</style>").appendTo("head");
		return 1;
	},
	returnKB: function(e) {
		e = e.match(/([\d+\.]+)([a-z]+)/i);
		var f = e[1];
		if (e[2] == "GB") { f *= 1000000; }
		if (e[2] == "MB") { f *= 1000; }
		if (e[2] == "KB") { f *= 1; }
		return f;
	}
};
repod.muh_games.init();
