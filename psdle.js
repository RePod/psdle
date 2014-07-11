try { repod; } catch(e) { repod = {}; }
repod.muh_games = {
	gamelist: [],
    init: function() {
		this.config = {
			totalgames: parseInt(/(\d+) Matches$/.exec($(".statsText").text())[1]),
			past: "",
            timerID: 0,
            delay: 3000
		}
		this.injectCSS();
		this.genDisplay();
        this.startTimer();
        return 1;
	},
	parsePage: function() {
		if ($(".gridViewportPaneWrapper").html() !== this.config.past) {
            this.config.past = $(".gridViewportPaneWrapper").html();
			$("#sub_container").html("Parsing page "+(this.gamelist.length/24+1)+" out of "+Math.ceil(this.config.totalgames/24)+". ("+Math.round((repod.muh_games.gamelist.length / repod.muh_games.config.totalgames) * 100)+"%)");
			$("li.cellDlItemGame").each(function() {
				var info = $(this).find(".mediaInfo");
				var gametitle = info.find(".gameTitle").text();
				var size = info.find(".size").text().replace("|","");
				var platform = [];
				var date = info.find(".purchaseDate").text().replace("|","");
				var icon = $(this).find(".thumbPane").find("img").attr("src");
				var url = $(this).find(".thumbPane").parent().attr("href");
				info.find(".playableOn").children("a").each(function() { platform.push($(this).text()) });
				repod.muh_games.gamelist.push({title:gametitle,size:size,platform:platform,date:date,url:url,icon:icon});
			});
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
		$("body").append("<div id='muh_games_container' style='position:absolute;top:0px;bottom:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center' />");
		$("#muh_games_container").append("<div id='sub_container' style='background-color:#fff'/>");
		return 1;
	},
	genTable: function() {
		$("#sub_container").html(this.genSearchOptions());
		$("#sub_container").hide().append("<table id='muh_table' style='display:inline-block;text-align:left'>"+this.genTableContents()+"</table>").show();
		return 1;
	},
	regenTable: function() {
		$("#muh_table > tbody").html(this.genTableContents());
		return 1
	},
	genTableContents: function() {
		var temp = "<tr><th>Icon</th><th style='min-width:600px'>Name</th><th title='Approximate, check store page for all supported platforms.'>Platform</th><th>Size</th><th>Date</th></tr>";
		var safesys = this.safeSystemCheck();
		$.each(repod.muh_games.gamelist,function(index,val) {
			var sys = repod.muh_games.safeGuessSystem(val['platform']); 
			if ($.inArray(sys,safesys) > -1) { 
				//Valid system.
				var a = true;
				var t = val['title'];
				if ($("#filter_avatar").hasClass("toggled_off") && t.indexOf("Avatar") > -1) a = false; 
				if ($("#filter_demo").hasClass("toggled_off") && t.indexOf("Demo") > -1) a = false;
				if ($("#filter_unlock").hasClass("toggled_off") && t.indexOf("Unlock") > -1) a = false;
				if ($("#filter_pass").hasClass("toggled_off") && t.indexOf("Unlock") > -1) a = false;
				if ($("#filter_pack").hasClass("toggled_off") && t.indexOf("Pack") > -1) a = false;
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
		$(document).on("click","span[id^=system_], span[id^=filter_]", function() { repod.muh_games.toggleButton($(this)); });
		$(document).on("click","span#psdle_regen", function() { repod.muh_games.regenTable(); });
		var temp = '<div style="text-align:center;width:100%">' +
					'<span id="system_ps3">PS3</span>' +
					'<span id="system_ps4">PS4</span>' +
					'<span id="system_psp">PSP</span>' +
					'<span id="system_psv">PS Vita</span>' +
					'<hr style="display:inline-block" width="50">' +
					'<span id="filter_avatar">Avatars</span>' +
					'<span id="filter_demo">Demos</span>' +
					'<span id="filter_unlock">Unlocks</span>' +
					'<span id="filter_pass">Passes</span>' +
					'<span id="filter_pack">Packs</span>' +
					'<hr style="display:inline-block" width="50">' +
					'<span id="psdle_regen">Regenerate</span>' +
					'</div>';
		return temp;
	},
	toggleButton: function(e) {
		$(e).toggleClass("toggled_off");
		return 1
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
		var temp = "";
		temp += "table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;} td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding-left:2px;} td a:hover{background-color:#ccc;}"; //Table
		temp += "span[id^=system_], span[id^=filter_], span#psdle_regen { border-radius:5px;border:1px solid #fff;font-weight:bold;text-transform:uppercase;font-size:small;color:#fff;padding:1px 3px;bottom:3px;display:inline-block;vertical-align:20%;background-color:#000;cursor:pointer; } .toggled_off { opacity:0.7; }"; //Search buttons
		temp += ".psdle_game_icon { max-width:100%;vertical-align:middle }"; //Content icons
		$("<style type='text/css'>"+temp+"</style>").appendTo("head");
		return 1;
	}
}
repod.muh_games.init();
