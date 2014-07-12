//See LICENSE file for licensing details, available in the "psdle" repository on GitHub. TL;DR: MIT, do what you want.

try { repod; } catch(e) { repod = {}; }
repod.muh_games = {
	gamelist: [],
	init: function() {
		this.config = {
			totalgames: parseInt($(".statsText").text().match(/(\d+)/g).pop()),
			past: "",
			timerID: 0,
			delay: 3000,
			lastsort: "sort_date"
		}
		this.injectCSS();
		this.genDisplay();
		this.startTimer();
		return 1;
	},
	parsePage: function() {
		if ($(".gridViewportPaneWrapper").html() !== this.config.past) {
			this.config.past = $(".gridViewportPaneWrapper").html();
			$("li.cellDlItemGame").each(function() {
				var info = $(this).find(".mediaInfo");
				var gametitle = info.find(".gameTitle").text();
				var size = info.find(".size").text().replace("|","");
				var platform = [];
				var date = info.find(".purchaseDate").text().replace("|","");
				var icon = $(this).find(".thumbPane").find("img").attr("src");
				var url = $(this).find(".thumbPane").parent().attr("href");
				info.find(".playableOn").children("a").each(function() { platform.push($(this).text()) });
				repod.muh_games.gamelist.push({id:(repod.muh_games.gamelist.length +1),title:gametitle,size:size,platform:platform,date:date,url:url,icon:icon});
			});
			$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((repod.muh_games.gamelist.length / repod.muh_games.config.totalgames) * 100)+"%"});
			$("#psdle_status").text((this.gamelist.length/24+1)+" / "+Math.ceil(this.config.totalgames/24));
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
		var delay = (delay) ? delay : this.config.delay;
		this.config.timerID = setInterval(function(){repod.muh_games.parsePage();},delay);
		return 1;
	},
	nextPage: function() {
		$(".navLinkNext").trigger("click"); //Anonymous functions, please.
		return 1;
	},
	genDisplay:function() {
		$("body").append("<div id='muh_games_container' />");
		$("#muh_games_container").append("<div id='sub_container'><span style='display:inline-block;font-size:300%;font-weight:bold'>psdle</span><br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>1 / "+Math.ceil(this.config.totalgames/24)+"</span></div>");
		$("#muh_games_container").slideDown('slow');
		return 1;
	},
	genTable: function() {
		$("#psdle_bar").animate({"width":"0%"});
		$("#sub_container").html(repod.muh_games.genSearchOptions()); repod.muh_games.toggleSort("span#sort_date");
		$("#sub_container").append("<table id='muh_table' style='display:inline-block;text-align:left'>"+repod.muh_games.genTableContents()+"</table>");
		return 1;
	},
	regenTable: function() {
		$("#muh_table > tbody").html(this.genTableContents());
		return 1;
	},
	genTableContents: function() {
		var temp = "<tr><th>Icon</th><th style='min-width:600px'>Name</th><th title='Approximate, check store page for all supported platforms.'>Platform</th><th>Size</th><th>Date</th></tr>";
		var safesys = this.safeSystemCheck();
		$.each(repod.muh_games.gamelist,function(index,val) {
			var sys = repod.muh_games.safeGuessSystem(val['platform']);
			if ($.inArray(sys,safesys) > -1) { 
				//Valid system.
				var a = true; var t = val['title'];
				if ($("#filter_avatar").hasClass("toggled_off") && / Avatar$/i.test(t)) a = false; 
				if ($("#filter_demo").hasClass("toggled_off") && / Demo$/i.test(t)) a = false;
				if ($("#filter_unlock").hasClass("toggled_off") && / Unlock$/i.test(t)) a = false;
				if ($("#filter_pass").hasClass("toggled_off") && / Pass$/i.test(t)) a = false;
				if ($("#filter_pack").hasClass("toggled_off") && / Pack$/i.test(t)) a = false;
				if ($("#filter_theme").hasClass("toggled_off") && / Theme$/i.test(t)) a = false;
				if (a) {
					var u = val['url'];
					temp += "<tr><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+u+"'><img src='"+val['icon']+"' class='psdle_game_icon' /></a></td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+t+"</a></td><td>"+sys+"</td><td>"+val['size']+"</td><td>"+val['date']+"</td></tr>";
				}
			}
		});
		return temp;
	},
	genSearchOptions: function() {
		//TO-DO: Make scalable.
		$(document).on("click","span[id^=system_], span[id^=filter_]", function() { repod.muh_games.toggleButton($(this)); repod.muh_games.regenTable(); });
		$(document).on("click","span[id^=sort_]", function(e) { repod.muh_games.toggleSort($(this)); });
		//$(document).on("click","span#psdle_regen", function() { repod.muh_games.regenTable(); });
		var temp = '<div style="text-align:center;width:100%">' +
					'<span id="system_ps3">PS3</span>' +
					'<span id="system_ps4">PS4</span>' +
					'<span id="system_psp">PSP</span>' +
					'<span id="system_psv">PS Vita</span>' +
					'<hr style="display:inline-block;width:20px">' +
					'<span id="filter_avatar">Avatars</span>' +
					'<span id="filter_demo">Demos</span>' +
					'<span id="filter_unlock">Unlocks</span>' +
					'<span id="filter_pass">Passes</span>' +
					'<span id="filter_pack">Packs</span>' +
					'<span id="filter_theme">Themes</span>' +
					'<hr style="display:inline-block;width:20px">' +
					//'<span id="psdle_regen">Regenerate</span>' +
					'<span id="sort_date">New ... Old</span>' +
					'<span id="sort_az">A ... Z</span>' +
					'</div>';
		return temp;
	},
	sortGamelist: function(e) {
		var e = (e) ? e : $("span[id^=sort_]:not('.toggled_off')").attr("id");
		if (e !== this.config.lastsort) {
			if (e == "sort_date") {
				this.gamelist.sort(function (a, b) {
					if (a.id > b.id) return 1;
					if (a.id < b.id) return -1;
					return 0;
				});
			}
			if (e == "sort_az") {
				this.gamelist.sort(function (a, b) {
					if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()) return 1;
					if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) return -1;
					return 0;
				});
			}
			this.config.lastsort = e;
			this.regenTable();
		}
	},
	toggleButton: function(e) {
		$(e).toggleClass("toggled_off");
		return 1
	},
	toggleSort: function(e) {
		$("span[id^=sort_]").addClass("toggled_off");
		$(e).removeClass("toggled_off");
		this.sortGamelist();
	},
	safeSystemCheck: function() {
		var temp = [];
		$("span[id^=system_]:not('.toggled_off')").each(function() {
			temp.push($(this).text());
		});
		return temp;
	},
	safeGuessSystem: function(e) {
		//Quick, dirty, and easy.
		var sys = e.join(" ");
		if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP") sys = "PSP";
		if (sys == "PS3 PS Vita") sys = "PS Vita";
		if (sys == "PS3") sys = sys;
		if (sys == "PS4") sys = sys;
		return sys;
	},
	injectCSS: function() {
		var temp = "#muh_games_container { display:none;position:absolute;top:0px;bottom:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { background-color:#fff; padding:20px; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#ccc;width:0%;height:100%;border-radius:10px; }" + //Startup
					"table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;} td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding-left:2px;} th, tr:hover{background-color:#ccc;}" + //Table
					"span[id^=system_], span[id^=filter_], span#psdle_regen, span[id^=sort_] { border-radius:5px;border:1px solid #fff;font-weight:bold;text-transform:uppercase;font-size:small;color:#fff;padding:1px 3px;bottom:3px;display:inline-block;vertical-align:20%;background-color:#000;cursor:pointer; } .toggled_off { opacity:0.4; }" + //Search buttons
					".psdle_game_icon { max-width:100%;vertical-align:middle }"; //Content icons
		$("<style type='text/css'>"+temp+"</style>").appendTo("head");
		return 1;
	}
}
repod.muh_games.init();
