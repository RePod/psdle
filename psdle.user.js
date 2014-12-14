// ==UserScript==
// @author		RePod
// @name		PSDLE for Greasemonkey
// @description	Improving everyone's favorite online download list, one loop at a time. This will be updated infrequently, mostly for stability.
// @namespace	https://github.com/RePod/psdle
// @homepage	https://repod.github.io/psdle/
// @version		1.049
// @require		https://code.jquery.com/jquery-1.11.1.min.js
// @include		https://store.sonyentertainmentnetwork.com/*
// @updateURL	https://repod.github.io/psdle/psdle.user.js
// @downloadURL	https://repod.github.io/psdle/psdle.user.js
// @icon		https://repod.github.io/psdle/logo/6_psdle_64px.png
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2014 RePod

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//The license information above is also available in PSDLE's GitHub repository located here: https://github.com/RePod/psdle
//TO-DO:
// - All the things!

var repod = {};
repod.psdle = {
	gamelist: [], gamelist_cur: [],
	entitlement_cache: {}, sku_id_cache: {},
	lang: {},
	lang_cache: {
		"en": {
			"def": "us",
			"us": {"local":"English","startup":"Waiting on page to load.","columns":{"icon":"Icon","name":"Name","platform":"Platform","size":"Size","date":"Date"},"labels":{"export_view":"Export View","games":"Games","avatar":"Avatars","demo":"Demos","unlock":"Unlocks","pass":"Passes","pack":"Packs","theme":"Themes","addon":"Add-ons","app":"Applications","unknown":"Unknown","page":"Page"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"Error: Browser does not have JSON.stringify.","yes":"Yes","no":"No","use_api":"Use API for in-depth scanning? (Beta, buggy)","use_queue":"Enable Download Queue support? (accesses queue and activated consoles)","use_entitled_api":"Use Entitlements API? (For PS+/bundles/etc, contains purchase information)<br /><small><strong>Required for dates on Mobile site.</strong></small>","regex_search":"Search by game title (/regex/id)","dlQueue":"Queue","dlList":"List"}}
		},
		"es": {
			"def": "mx",
			"mx": {"local":"Español","startup":"Esperando en la página se cargue.","columns":{"icon":"Icono","name":"Nombre","platform":"Plataforma","size":"Tamaño","date":"Fecha"},"labels":{"export_view":"Exportar vista","games":"juegos","avatar":"avatares","demo":"población","unlock":"descubrir","pass":"adelantar","pack":"paquete","theme":"Temas","addon":"Complementos","app":"Aplicaciones","unknown":"Desconocido","page":"paje"},"strings":{"delimiter":"Ingrese delimitador:","stringify_error":"Error: Navegador no tiene JSON.stringify.","yes":"Sí","no":"No","use_api":"Utilice la API para la exploración en profundidad? (Beta, con errores)","regex_search":"Búsqueda por título del juego (/regex/id)"}} // Caaz, somebody.
		},
		"de": {
			"def": "de",
			"de": {"local":"Deutsch","startup":"Seite wird geladen, bitte warten.","columns":{"icon":"Symbol","name":"Name","platform":"Plattform","size":"Größe","date":"Datum"},"labels":{"export_view":"Exportiere Ansicht","games":"Spiele","avatar":"Spielerbilder","demo":"Demos","unlock":"Freischaltbares","pass":"Pässe","pack":"Bündel","theme":"Themen","addon":"Erweiterungen","app":"Anwendungen","unknown": "Unbekannt","page":"Seite"},"strings":{"delimiter":"Geben sie ein Trennzeichen ein","stringify_error":"Fehler: Browser fehlt \"JSON.stringify\".","yes":"Ja","no":"Nein","use_api": "Möchten Sie mit Hilfe der API einen Tiefenscan ausführen? (Beta Version, möglicherweise treten Fehler auf)","regex_search": "Spiele titel eingeben für direkte suche (/regex/id)"}} // Provided by /u/_MrBubbles
		},
		"ru": {
			"def": "ru",
			"ru": {"local":"Русский","startup":"Ожиданиезагрузкистраниц...","columns":{"icon":"Иконка","name":"Название","platform":"Платформа","size":"Размер","date":"Дата"},"labels":{"export_view":"ExportView","games":"Игры","avatar":"Аватары","demo":"Демо-версии","unlock":"Разблокировки","pass":"Сезонныепропуски","pack":"Набор","theme":"Темы","addon":"Дополенния","app":"Приложения","unknown":"Неизвестно","page":"Страница"},"strings":{"delimiter":"Введитеразделитель: ","stringify_error":"Ошибка: вбраузереотсутствуетJSON.stringify.","yes":"Да","no":"Нет","use_api":"ИспользоватьAPIдляглубокогосканирования?(бета,работаетнестабильно)","regex_search":"Поискпоназваниюигры(/regex/id)"}} //Provided by MorbertDou (issue #2)
		},
		"ps": {
			"def": "pi",
			"pi": {"local":"Pirate","startup":"Ye be waitin on da page.","columns":{"icon":"Doubloon","name":"Title","platform":"Ship","size":"Boat","date":"Date"},"labels":{"export_view":"Compass","games":"Booty","avatar":"Shipmates","demo":"Plans","unlock":"Keys","pass":"Sails","pack":"Treasure Hoard","theme":"Paint","addon":"Cannons","app":"Galley","unknown":"Davey Jones' Locker","page":"Map"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"The sea don't have a JSON.stringify.","yes":"Yargh","no":"Nay","use_api":"Use da API fer deep digging? (Beta, buggy)","regex_search":"Set a course for booty (/regex/id)"}}, //Arcon
			"dz": {"local":"Dovahzul","startup":"Saraan fah deykel wah genun.","columns":{"icon":"Andiir","name":"For","platform":"Palaar","size":"Raaz","date":"Zahtiid"},"labels":{"export_view":"Sav Fahzon","games":"Kred","avatar":"Rahnunahst","demo":"Gor","unlock":"Bex","pass":"Rahn","pack":"Edrah","theme":"Niin","addon":"Malur","app":"Mii","unknown":"Vomindok","page":"Deykel"},"strings":{"delimiter":"Haav krenok:","stringify_error":"Tozein Hi dreh ni lost JSON.stringify","yes":"Geh","no":"Nid","use_api":"Nuft API fah ko rud tovit?  (Gor, lost diron)","regex_search":"Tovit naal kred tet (/qurnen/id)"}}, // Caaz
			"ha": {"local":"H4k3r","startup":"G4th3ring rez0urc3s.","columns":{"icon":"1con","name":"H4ndle","platform":"P|a+f0rm","size":"S1z3","date":"D4te"},"labels":{"export_view":"D0x","games":"W4rez","avatar":"4va+ar","demo":"Freeware","unlock":"H4x","pass":"Pa55e5","pack":"Pax","theme":"R1cez","addon":"Add-0ns","app":"S0f+w4r3","unknown":"?","page":"P4g3"},"strings":{"delimiter":"5pli+ by:","stringify_error":"3rr0r: No JSON.stringify.","yes":"Y","no":"N","use_api":"D33p sc4n with API? (Beta, buggy)","regex_search":"grep (/regex/id)"}} //Caaz
		}
	},
	determineLanguage: function(e,f) {
		e = (e) ? e.split("-") : this.config.language.split("-");
		if (f === true) { this.lang = {}; this.lang = this.lang_cache.en.us; }
		if (e[0] in this.lang_cache) {
			if (e[1] in this.lang_cache[e[0]]) {
				if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][e[1]]); }
				e = e[0]+"-"+e[1];
			} else {
				if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][this.lang_cache[e[0]].def]); }
				e = e[0]+"-"+this.lang_cache[e[0]].def;
			}
		} else {
			e = "en-us";
		}
		return e;
	},
	generateLangBox: function(e) {
		var temp = "<select id='lang_select'>";
		e = (e) ? this.determineLanguage(e) : this.determineLanguage();
		for (var i in this.lang_cache) {
			for (var h in this.lang_cache[i]) {
				if (!!this.lang_cache[i][h].local) {
					var a = (e == i+"-"+h) ? "selected='selected'" : "";
					temp += "<option "+a+" value='"+i+"-"+h+"'>"+this.lang_cache[i][h].local+" ["+i+"-"+h+"]</option>";
				}
			}
		}
		temp += "</select>";
		return temp;
	},
	init: function() {
		console.log("PSDLE | Init.");
		var that = this;
		this.config = {
			game_page: "",
			game_api: SonyChi_SessionManagerSingleton.getBaseCatalogURL()+"/",
			entitled_api: SonyChi_SessionManagerSingleton.getInternalEntitlementhsAPI()+"?start=",
			totalgames: 1,
			delay: 1000,
			lastsort: "",
			lastsort_r: false,
			language: window.location.href.match(/\/([a-z]{2}\-(?:[a-z]{4}-)?[a-z]{2})\//i)[1],
			deep_search: false,
			deep_waiting: 0,
			deep_current: 0,
			api_url: "",
			last_search: "",
			check_entitlements: false, entitlements_count: 0, entitlements_total: 1, entitlements_plus: 0,
			dlQueue: { base: SonyChi_SessionManagerSingleton.getDLQueueBaseURL(), status: SonyChi_SessionManagerSingleton.getDLQueueStatusURL(), status2: SonyChi_SessionManagerSingleton.getDLQueueStatusURL2() },
			use_queue: 0, active_consoles: {},
			tag_line: "<br /><a class='psdle_tiny_link' href='//repod.github.io/psdle' target='_blank'>Website</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle' target='_blank'>Repository</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle/issues' target='_blank'>Report A Bug</a>"
		}; 
		this.determineLanguage(this.config.language,true);
		this.injectCSS();
		$(document).on('change', "#sub_container > select#lang_select", function() { that.config.language = $(this).val(); that.determineLanguage($(this).val(),true); that.genDisplay(); });
		this.genDisplay();
		this.exportTable.parent = this;
	},
	parsePage: function() {
		var that = this;
		if (this.gamelist.length >= this.config.totalgames) {
			clearInterval(this.config.timerID);
			this.checkEntitlements();
		} else if (Number($(".range").text().split("-")[0]) > this.gamelist.length) {
			var count = (chihiro.isMobile()) ? 50 : 24;
			$("#psdle_status").text((this.gamelist.length/count+1)+" / "+Math.ceil(this.config.totalgames/count));
			$("li.cellDlItemGame").each(function() {
				var entry = {}, id = (that.gamelist.length +1), t = $(this).clone(), p = [], n, d;
				/* Compatible on mobile and desktop versions. */
				entry.id = id;
				entry.icon = t.find(".thumbPane img").attr("src");
				entry.url = t.find(".cellCtnr a").eq(0).attr("href");
				entry.pid = entry.url.split("=").pop();
				entry.size = t.find(".size").text().match(/(\d+(?:\.\d+)?[gmk]b)/i)[0];
				entry.deep_type = "unknown";
				if (that.config.game_page == "") { that.config.game_page = entry.url.match(/(.+?=).+/).pop(); }
				if (chihiro.isMobile()) {
					/* Mobile */
					p = t.find(".platformList").text().split(" | ");
					n = t.find("h3").text();
					d = "?";
				} else { 
					/* Desktop */
					t.find(".playableOn > a").each(function() { p.push($(this).text()); });
					n = t.find(".gameTitle").text();
					d = t.find(".purchaseDate").text().replace("|","");
				}
				entry.platform = p; entry.plat_og = p;
				entry.title = n;
				entry.date = d;
				
				if (!that.entitlement_cache[entry.pid]) { that.entitlement_cache[entry.pid] = []; }
				that.entitlement_cache[entry.pid].push({"glid":(id -1),"gid":""});
				that.gamelist.push(entry);
				if (that.config.deep_search) {
					$.getJSON(that.config.game_api+entry.pid,function(data) { that.parseDeep(id,data); });
				}
			});
			$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((this.gamelist.length/count) / Math.ceil(this.config.totalgames/count) * 100)+"%"});
			if (this.gamelist.length >= this.config.totalgames) {
				//if (this.config.deep_waiting <= 1) {
					clearInterval(this.config.timerID);
					this.checkEntitlements();
				//}
			} else {
				this.nextPage();
			}
		}
	},
	startTimer: function(delay) {
		var that = this;
		delay = (delay) ? delay : this.config.delay;
		this.config.timerID = setInterval(function(){that.parsePage();},delay);
		return this.config.timerID;
	},
	nextPage: function() {
		//.trigger("click") wasn't working in Chrome, here's a native solution.
		$('.navLinkNext').eq(0)[0].dispatchEvent(new MouseEvent("click",{canBubble:true,cancelable:true}));
	},
	genDisplay:function(mode) {
		var that = this, yn = "<span class='psdle_fancy_bar'><span id='yes' class='psdle_btn'>"+that.lang.strings.yes+"</span> <span id='no' class='psdle_btn'>"+that.lang.strings.no+"</span></span>";
		if (!$("#muh_games_container").length) { $("body").append("<div id='muh_games_container' />"); }
		$(document).off("click",".psdle_btn");
		$("#muh_games_container").slideUp('slow', function() {
			var a = "<div id='sub_container'><a href='//repod.github.io/psdle/' target='_blank'><img src='//repod.github.io/psdle/logo/3_psdle_mini.png' style='display:inline-block;font-size:200%;font-weight:bold' alt='psdle' /></a></span>";
			var b = that.config.tag_line;
			
			switch (mode) {
				case "entitled_api":
					a += "<br />"+that.lang.strings.use_entitled_api+"<br />"+yn+b+"</div>";
					$(document).one('click',".psdle_btn",function () { that.config.check_entitlements = ($(this).attr("id") == "yes") ? true : false; that.genDisplay("use_queue"); });
					break;
				case "use_queue":
					a += "<br />"+that.lang.strings.use_queue+"<br />"+yn+b+"</div>";
					$(document).one('click',".psdle_btn",function () { that.config.use_queue = ($(this).attr("id") == "yes") ? true : false; that.genDisplay("progress"); });
					break;
				case "progress":
					if (that.config.use_queue) {
						var sys = {}, c = SonyChi_SessionManagerSingleton.getUserObject();
						if (c.getActiveVitaCount() > 0) { sys.vita = 1; }
						if (c.getActivePS3Count() > 0) { sys.ps3 = 1; }
						if (c.getActivePS4Count() > 0) { sys.ps4 = 1; }
						that.config.active_consoles = sys;
					}
					a += "<br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>"+that.lang.startup+"</span>";
					var t = 0;
					that.config.totalgames = Number($(".statsText").text().match(/(\d+)/g).pop());
					if (chihiro.isMobile()) {
						that.startTimer();
					} else {
						$("li.cellDlItemGame:even").each(function() {
							$("html, body").animate({scrollTop: $(this).offset().top}, 200).promise().done(function() {
								t++;
								if (t == $("li.cellDlItemGame:even").length) {	
									$('html, body').animate({scrollTop: 0}, 0);
									that.startTimer();
								}
							});
						});
					}
					break;
				default:
					a += "<br />"+that.lang.strings.use_api+"<br />"+yn+"<br />"+that.generateLangBox()+b+"</div>";
					$(document).one('click',".psdle_btn",function () { that.config.deep_search = ($(this).attr("id") == "yes") ? true : false; that.genDisplay("entitled_api"); $("#sub_container > select").off("change"); });
			}
			
			$("#muh_games_container").html(a).slideDown('slow');
		});
	},
	checkEntitlements: function() {
		$("#psdle_status").text(this.lang.startup);
		if (this.config.check_entitlements) {
			if (this.config.entitlements_count < this.config.entitlements_total) {
				var that = this;
				$.getJSON(this.config.entitled_api+this.config.entitlements_count+"&size=100&fields=game_meta%2Cdrm_def",function(e) { that.parseEntitlements(e); });
			} else {
				if (this.config.deep_search) {
					this.checkSkus();
				} else {
					this.table.gen();
				}
			}
		} else {
			this.table.gen();
		}
	},
	checkSkus: function() {
		var that = this;
		$.each(that.sku_id_cache,function(a,b) {
			$.each(b.reverse(), function(c,d) {
				if (that.entitlement_cache[a] && that.entitlement_cache[a][c]) {
					console.log(b[c]);
					//$.extend(true,that.gamelist[that.entitlement_cache[a][c].glid],b[c]);
					var id = that.entitlement_cache[a][c].glid;
					if (b[c].pid && b[c].pid.length > 0) { that.gamelist[id].pid = b[c].pid; }
					that.gamelist[id].plus = b[c].plus;
					if (that.gamelist[id].date == "?") { that.gamelist[id].date = b[c].date; }
					if (that.gamelist[id].icon && that.gamelist[id].icon.indexOf("pc/img/furniture") > -1 && b[c].icon && b[c].icon.length > 0) { that.gamelist[id].icon = b[c].icon; }
				}
			});
		});
		this.table.gen();
	},
	table: {
		bindSearch: function() {
			//Unbind for safety.
			$(document).off("click","#muh_table > tbody > tr, span[id^=system_], span[id^=filter_], span[id^=dl_], th[id^=sort_], span[id=export_view]").off("blur","#psdle_search_text");
			//Bind.
			$(document).keypress(function(e) { if (e.which == 13 && $("#psdle_search_text").is(":focus")) { repod.psdle.table.regen(); } });
			$("span[id^=system_], span[id^=filter_]").off("click").on("click", function() { $(this).toggleClass("toggled_off"); repod.psdle.table.regen(); });
			$("th[id^=sort_]").off("click").on("click", function() { repod.psdle.sortGamelist($(this)); });
			$("span[id=export_view]").off("click").on("click", function() { repod.psdle.exportTable.display(); });
			$("#psdle_search_text").off("blur").on("blur", function() { repod.psdle.table.regen(); });
			$("#dl_queue").one("click", function() { repod.psdle.dlQueue.generate.display(); });
			$(document).off("click", "#muh_table > tbody > tr").on("click", "#muh_table > tbody > tr", function(e) { e.preventDefault(); repod.psdle.dlQueue.batch.add.ask(this); });
		},
		gen: function() {
			clearInterval(repod.psdle.config.timerID); //Just in case.
			repod.psdle.config.lastsort = ""; repod.psdle.config.lastsort_r = false;
			$("#muh_games_container").css({"position":"absolute"});
			$("#sub_container").html(repod.psdle.genSearchOptions()).append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+repod.psdle.lang.columns.platform+"</th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table><br />"+repod.psdle.config.tag_line);
			this.regen(); this.bindSearch();
			this.margin();
			repod.psdle.sortGamelist("#sort_date");
		},
		regen: function(a) {
			if (a !== true) { repod.psdle.determineGames(); }
			var that = this, temp = "", plus = 0;
			$.each(repod.psdle.gamelist_cur,function (a,val) {
				var u = repod.psdle.config.game_page+val.pid, is_plus = "";
				var sys = repod.psdle.safeGuessSystem(val.platform);
				if (val.plus === true && repod.psdle.config.check_entitlements) { is_plus = "is_plus"; plus++; }
				temp += "<tr class='"+is_plus+"'><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+val.url+"'><img title='"+repod.psdle.lang.labels.page+" #"+Math.ceil(val.id/24)+"' src='"+val.icon+"' class='psdle_game_icon' /></a></td><td><a id='psdle_index_"+(val.id -1)+"' class='psdle_game_link' target='_blank' href='"+u+"'>"+val.title+"</a></td><td>"+sys+"</td><td>"+val.size+"</td><td>"+val.date+"</td></tr>";
			});
			$("#table_stats").html(repod.psdle.gamelist_cur.length+((repod.psdle.config.check_entitlements)?" (<div id='psdleplus' style='display:inline-block' /> "+plus+")":"")+" / "+repod.psdle.gamelist.length);
			if (repod.psdle.config.check_entitlements) {
				if (chihiro.isMobile()) {
					$("#psdleplus").html('<img class="psPlusIcon" src="mobile/img/furniture/psplusicon-small.a2ec8f23.png">');
				} else {
					$("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"});
				}
			}
			$("#muh_table > tbody").html(temp);
		},
		margin: function() {
			$("#muh_table").animate({"margin-top":$("#search_options").outerHeight() - $("#sub_container").css("padding-top").replace("px","")+"px"});
		}
	},
	determineGames: function() {
		this.exportTable.destroy();
		this.gamelist_cur = [];
		var that = this, temp = "", safesys = this.safeSystemCheck();
		var search = (!!$("#psdle_search_text")) ? $("#psdle_search_text").val() : this.config.last_search;
		/* Determine filters. */ var filters = {}; $.each($("[id^=filter_]"), function() {var n = $(this).attr("id").split("_").splice(1).join("_");filters[n] = $(this).hasClass("toggled_off");});
		$("#psdle_search_text").removeClass("negate_regex");
		$.each(this.gamelist,function(index,val) {
			var sys = that.safeGuessSystem(val.platform);
			if ($.inArray(sys,safesys) > -1) { 
				var a = true, t = val.title;
				if (that.config.deep_search) {
					if (filters[val.deep_type]) { a = false; }
				}				
				if (a == true && search !== "") {
					var regex = search.match(/^\/(.+?)\/([imgd]+)?$/i);
					a = (!!regex && !!regex[2] && regex[2].toLowerCase().indexOf("d") >= 0) ? true : false;
					if (a) { $("#psdle_search_text").addClass("negate_regex"); regex[2] = regex[2].replace("d",""); }
					if (!!regex) { if (RegExp((regex[1])?regex[1]:search,(regex[2])?regex[2]:"").test(t)) { a = !a; } }
					else if (t.toLowerCase().indexOf(search.toLowerCase()) >= 0) { a = !a; }
				}
				if (a == true) {
					that.gamelist_cur.push(val);
				}
			}
		});
		that.config.last_search = search;
	},
	genSearchOptions: function(dlQueue) {
		//TO-DO: Not this. Make scalable.
		var that = this;
		
		//Search options.
		var temp = '<div id="search_options">';
		if (!dlQueue) { temp += '<span><span class="psdle_fancy_but" id="export_view">'+this.lang.labels.export_view+'</span></span> '; }
		temp +=		'<span class="psdle_fancy_bar">';
		if (this.config.deep_search && !dlQueue) { temp += '<span id="system_ps1">PS1</span><span id="system_ps2">PS2</span>'; }
		temp +=		'<span id="system_ps3">PS3</span>' +
					'<span id="system_ps4">PS4</span>';
		if (!dlQueue) { temp += '<span id="system_psp">PSP</span>'; }
		temp +=		'<span id="system_psv">PS Vita</span></span>';
		if (this.config.use_queue) {
			if (!dlQueue) {
				temp += ' <span class="psdle_fancy_but" id="dl_queue">'+this.lang.strings.dlQueue+'</span>';
			} else {
				temp += ' <span><span class="psdle_fancy_but" id="dl_list">'+this.lang.strings.dlList+'</span></span>';
			}
		}
		if (this.config.deep_search && !dlQueue) {					
		temp +=		'<br /><span class="psdle_fancy_bar">' +
					'<span id="filter_downloadable_game">'+this.lang.labels.games+'</span>' +
					'<span id="filter_avatar">'+this.lang.labels.avatar+'</span>' +
					'<span id="filter_demo">'+this.lang.labels.demo+'</span>'+
					'<span id="filter_add_on">'+this.lang.labels.addon+'</span>' +
					'<span id="filter_application">'+this.lang.labels.app+'</span>' +
					'<span id="filter_theme">'+this.lang.labels.theme+'</span>' +
					'<span id="filter_unknown">'+this.lang.labels.unknown+'</span></span>';
		}
		if (!dlQueue) { temp += "<br /><input type='text' id='psdle_search_text' placeholder='"+this.lang.strings.regex_search+"' />"; }
		temp += '<br /><span id="table_stats"></span></div>';
		return temp;
	},
	sortGamelist: function(sort_method) {
		this.determineGames();
		var that = this;
		sort_method = $(sort_method).attr("id");
		switch (sort_method) {
			default:
			case "sort_date":
				this.gamelist_cur.sort(function (a, b) {
					if (a.id > b.id) { return 1; }
					if (a.id < b.id) { return -1; }
					return 0;
				});
				break;
			case "sort_name":
				this.gamelist_cur.sort(function (a, b) {
					if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()) { return 1; }
					if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) { return -1; }
					return 0;
				});	
				break;
			case "sort_size":
				this.gamelist_cur.sort(function (a, b) {
					if (that.returnKB(a.size) > that.returnKB(b.size)) { return 1; }
					if (that.returnKB(a.size) < that.returnKB(b.size)) { return -1; }
				return 0;
			});
				break;
		}
		
		if (sort_method == this.config.lastsort) {
			if (!this.config.lastsort_r) {
				this.gamelist_cur.reverse();
			}
			this.config.lastsort_r = !this.config.lastsort_r;
		} else {
			this.config.lastsort_r = false;
		}
		$("#psdle_sort_display").remove();
		$("#"+sort_method).append("<span id='psdle_sort_display' class='psdle_sort_"+((this.config.lastsort_r)?"asc":"desc")+"' />");
		this.config.lastsort = sort_method;
		this.table.regen(true);
	},
	safeSystemCheck: function() {
		var temp = [];
		$("span[id^=system_]:not('.toggled_off')").each(function() { temp.push($(this).text()); });
		return temp;
	},
	safeGuessSystem: function(sys_in) {
		//Quick, dirty, and easy.
		var sys = sys_in.join(" ").replace("™","");
		if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP") { sys = "PSP"; }
		if (sys == "PS3 PS Vita") { sys = "PS Vita"; }
		return sys;
	},
	injectCSS: function() {
		var temp =	/* Startup			*/ "#muh_games_container { display:none;position:fixed;top:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { padding:20px;background-color:#fff; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#2185f4;width:0%;height:100%;border-radius:10px; } .psdle_btn { cursor:pointer;border-radius:13px;background-color:#2185f4;color:#fff;padding:1px 15px;display:inline-block;margin:5px auto; } .psdle_tiny_link { color:#7F6D75 !important; font-size:x-small; } .psdle_tiny_link:hover { color:#000 !important; text-decoration:underline; } " +
					/* Search options	*/ "#search_options { position:fixed;left:0px;top:0px;width:100%;padding:15px 0px;background-color:rgba(255,255,255,0.8); }" +
					/* Table			*/ "th[id^=sort] { cursor:pointer; } table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;} td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding:3px;} th, tr:hover{background-color:#ccc;} .is_plus{background-color:#FFFC0D;}" +
					/* Search buttons	*/ "#psdle_search_text { margin:5px auto;padding:5px 10px;font-size:large;max-width:600px;width:100%;border-style:solid;border-radius:90px; } .negate_regex { background-color:#FF8080;color:#fff; } span[id^=system_], span[id^=filter_], span#export_view, span#dl_queue, span#dl_list, .psdle_fancy_bar > span { font-weight:bold; text-transform:uppercase; font-size:small; color:#fff; background-color:#2185f4; display:inline-block; margin-right:2px; margin-bottom:5px; padding:1px 15px; cursor:pointer; } .psdle_fancy_but { border-radius:12px; } .psdle_fancy_bar > span:first-child { border-top-left-radius:12px; border-bottom-left-radius:12px; } .psdle_fancy_bar > span:last-child { border-top-right-radius:12px; border-bottom-right-radius:12px; } .toggled_off { opacity:0.4; }" +
					/* Content icons	*/ ".psdle_game_icon { max-width:100%;vertical-align:middle }" +
					/* Sorting			*/ ".psdle_sort_asc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid black; } .psdle_sort_desc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid black; }" +
					/* Newbox			*/ "#dlQueueAsk { display:inline-block;width:400px;height:400px;background-color:#FFF;border-radius:20px;overflow:hidden;position:relative;background-size:cover; } #dlQAN { cursor:move;background-color:rgba(33,133,244,0.8);padding:7px 15px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; } #dlQASys { position:absolute;bottom:0px;padding:7px 0px;color:#FFF;display:table;width:100%;table-layout:fixed; } #dlQASys > div { display:table-cell; } #dlQASys > div > div { cursor:pointer;background-color:rgba(33,133,244,0.8);border-radius:10px;padding:2px;margin:0px 10px; } #dlQAStat { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-left-radius:20px;padding:0px 10px 0px 15px;font-size:small;float:right; } #dlQARating { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-right-radius:20px;padding:0px 15px 0px 10px;font-size:small;float:left; } " +
					/* Newbox Container	*/ "#dlQueue_newbox { z-index:9001;position:fixed;top:0px;left:0px;width:100%;height:100%;display:table;background-color:rgba(0,0,0,0.25); } #dlQueue_newbox > div { display:table-cell;vertical-align:middle;height:inherit;text-align:center; }";
		$("head").append("<style type='text/css'>"+temp+"</style>");
	},
	returnKB: function(e) {
		e = e.match(/([\d+\.]+)([a-z]+)/i);
		var f = e[1];
		if (e[2] == "GB") { f *= 1000000; }
		if (e[2] == "MB") { f *= 1000; }
		if (e[2] == "KB") { f *= 1; }
		return f;
	},
	exportTable: {
		display: function() {
			this.destroy();
			var w = 600;
			$("#search_options").append("<span id='sotextarea' style='display:none'><br /><textarea></textarea></span>");
			$("#sotextarea > textarea").css({"width":w,"max-width":w}).text(this.delimited(prompt(this.parent.lang.strings.delimiter,"	"))).select().parent().delay(500).slideDown();
			repod.psdle.table.margin();
		},
		destroy: function() { $("#sotextarea").remove(); repod.psdle.table.margin(); },
		json: function() { return (!!JSON.stringify) ? JSON.stringify(this.parent.gamelist_cur) : this.parent.lang.strings.stringify_error; },
		delimited: function(e) {
			var that = this, sep = (e) ? e : "	";
			var t = this.parent.lang.columns.name+sep+this.parent.lang.columns.platform+sep+this.parent.lang.columns.size+sep+this.parent.lang.columns.date+"\n";
			$.each(this.parent.gamelist_cur, function(a,b) {
			  t += b.title+sep+that.parent.safeGuessSystem(b.platform)+sep+b.size+sep+b.date+"\n";
			});
			return t;
		}
	},
	parseDeep: function(id,data,sku) {
		id--;
		if (!!this.gamelist[id]) {
			if (sku) {
				if (!data.codeName) {
					if (data.images) { this.gamelist[id].icon = data.images[3].url; }
					if (data.id) { this.gamelist[id].url = this.gamelist[id].url.replace(/cid=.+?$/,"cid="+data.id); }
				}
				this.config.deep_current++;
				if (this.config.deep_current == this.config.deep_waiting) {
					this.table.gen();
				}
			} else {
				var sys;
				if (data.default_sku.entitlements.length == 1) {
					if (!!data.metadata.game_subtype) {
						if (!!data.metadata.game_subtype.values[0].match(/(PS(?:1|2)) Classic/)) { sys = data.metadata.game_subtype.values[0].match(/(PS(?:1|2)) Classic/).pop(); }
						else if (!!data.metadata.primary_classification.values[0].match(/(PS(?:1|2))_Classic/i)) { sys = data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i).pop(); }
						else if (!!data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i)) { sys = data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i).pop(); }
					} else if (!!data.metadata.playable_platform) { sys = data.metadata.playable_platform.values; } 
				}
				//metadata.game_subtype.values[0] -- PS1/PS2 Classic/Demo/Character/Bundle
				//top_category -- downloadable_game, avatar, demo, etc.
				if (!!sys) { 
					this.gamelist[id].platform = [sys];
				}
				try { this.gamelist[id].rating = data.star_rating.score; } catch (e) { }
				this.gamelist[id].deep_type = data.top_category;
			}
		}
	},
	parseEntitlements: function(data) {
		var that = this;
		this.config.entitlements_total = data.total_results;
		$.each(data.entitlements,function(index,value) {
			var plus = false, id, eimg;
			if (value.drm_def) {
				if (!that.sku_id_cache[value.sku_id]) { that.sku_id_cache[value.sku_id] = []; }
				id = value.license.entitlement_id;
				eimg = (value.drm_def && value.drm_def.image_url) ? value.drm_def.image_url+"&w=124&h=124" : "";
				
				/*if (that.entitlement_cache[id] && img !== "") {
					$.each(that.entitlement_cache[id], function(a,b) {
						if (that.gamelist[b.glid].icon.indexOf("pc/img/furniture") >= 0) {
							that.gamelist[b.glid].icon = img;
						}
					});
				}*/
				
				//that.gamelist[a.glid].icon = img;
				
				//Some index don't have drm_def, if we don't check we'll crash.
				//PS4 games don't have this at all, check feature_type.
				if (value.drm_def.rewards) {
					//Likewise?
					if (value.drm_def.rewards[0].rewardType == 2 || value.drm_def.rewards[0].rewardType == 3) {
						if (value.license && value.license.infinite_duration !== true) {
							plus = true;
							that.config.entitlements_plus++;
						}
					}
				}
			} else if (!!value.inactive_date) {
				id = "", eimg = "", plus = true;
				that.config.entitlements_plus++;
			}
			
			var temp = {};
			temp.pid = id;
			temp.plus = plus;
			if (chihiro.isMobile()) { temp.date = convertToNumericDateSlashes(convertStrToDateObj(value.active_date)); }
			if (id !== undefined && eimg !== undefined) {
				if (eimg !== "") { temp.icon = eimg; }
				
				
			}
			if (!that.sku_id_cache[value.product_id]) { that.sku_id_cache[value.product_id] = []; }
			that.sku_id_cache[value.product_id].push(temp);
		});
		this.config.entitlements_count += data.entitlements.length;
		$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((this.config.entitlements_count / this.config.entitlements_total) * 100)+"%"});
		$("#psdle_status").text(this.config.entitlements_count+" / "+this.config.entitlements_total);
		this.checkEntitlements();
	},
	dlQueue: {
		batch: {
			cache: {},
			get: function(callback) {
				this.cache = {"ps3":[], "ps4":[], "vita":[]}, that = this, promises = [];
				var base_url = repod.psdle.config.dlQueue.status+"/?status=notstarted&status=stopped&status=waitfordownload&platformString=$$1&size=100"
				for (var i in repod.psdle.config.active_consoles) {
					promises.push($.getJSON(base_url.replace("$$1",ib.toLowerCase())));
				}
				$.when(promises).done(function(ps3,ps4,vita) {
					try { that.parse("ps3",ps3.responseJSON); } catch (e) {};
					try { that.parse("ps4",ps4.responseJSON); } catch (e) {};
					try { that.parse("vita",vita.responseJSON); } catch (e) {};
				}).done(function() {
					try { callback } catch (e) {};
				});
			},
			parse: function(sys,data) {
				var that = this;
				try {
					$.each(data.data.notifications,function(a,b) {
						that.cache[sys].push(b);
					});
				} catch (e) {
					console.error("PSDLE | DL Queue parse error for \""+sys+"\". Is it activated on the account?");
				}
			},
			send: function(sys,id,cancel,completeCb,errorCb) {
				var dat = {"platformString":sys,"contentId":id}, base_url = (cancel) ? repod.psdle.config.dlQueue.status : repod.psdle.config.dlQueue.base;
				if (cancel) { dat.status = "usercancelled"; }
				$.ajax({
					type:'POST', url: base_url,
					contentType: 'application/json; charset=utf-8', dataType: 'json',
					data: JSON.stringify([dat]),
					complete: completeCb,
					error: function(d) {
						console.error("PSDLE | Download Queue | "+d.responseJSON.header.status_code+" "+d.responseJSON.header.message_key+" ("+sys+" / "+id+")");
						errorCb(d);
					}
				});
			},
			add: {
				parse: function(index,sys) {
					var game = repod.psdle.gamelist[index], that = this;
					switch (sys) {
						case "ps4":
						case "ps3":
						case "vita":
							this.go(sys,game.pid);
							break;
						case "all":
							var temp = game.plat_og.slice(0), i = $.inArray("PSP", temp); if(i != -1) { temp.splice(i, 1); } /* Make sure we don't have PSP */
							$.each(temp,function(a,b) { that.go(b.replace(/ps /i,"").toLowerCase(),game.pid); });
							break;
					}
				},
				ask: function(e) {
					//Ask which system to queue for. (cannot validate outside of this.go() response, if we care)
					//See notes for determining active consoles, probably the way to go.
					$("body").append("<div id='dlQueue_newbox'><div>"+repod.psdle.newbox.generate(e)[0].outerHTML+"</div></div>").promise().done(function() { repod.psdle.newbox.bind(); });
				},
				go: function(sys,id) {
					//Add game to batch.
					repod.psdle.dlQueue.batch.send(sys,id,false,function() {
						$("div[id^=dla_"+sys+"]").animate({"background-color":"green"});
					},function(a) {
						$("div[id^=dla_"+sys+"]").stop().animate({"background-color":"red"});
					});
				},
			},
			remove: {
				parse: function(e) {
					repod.psdle.dlQueue.batch.remove.go($(e).children("td:eq(3)").text().replace("PS ","").toLowerCase(),repod.psdle.gamelist[Number($(e).find(".psdle_game_link").attr("id").split("_").pop())].pid);
				},
				go: function(sys,id) {
					//Remove game from batch.
					repod.psdle.dlQueue.batch.send(sys,id,true,repod.psdle.dlQueue.batch.get(repod.psdle.dlQueue.generate.table()))
				}
			}
		},
		generate: {
			bindings: function () {
				repod.psdle.newbox.bind("off");
				//$(document).on("click","span[id^=system_], span[id^=filter_]", function() { $(this).toggleClass("toggled_off"); repod.psdle.table.regen(); });
				//$(document).on("click","th[id^=sort_]", function() { repod.psdle.sortGamelist($(this)); });
				$(document).one("click","#dl_list", function() { repod.psdle.table.gen(); });
				$(document).off("click","#muh_table > tbody > tr").on("click","#muh_table > tbody > tr", function(e) { e.preventDefault(); repod.psdle.dlQueue.batch.remove.parse(this); });
			},
			table: function() {
				$("#muh_table").remove();
				$("#sub_container").append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th>"+repod.psdle.lang.columns.platform+"</th><th> > </th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table>");
				var temp = "", plus = 0;
				$.each(repod.psdle.dlQueue.batch.cache, function(sys,contents) {
					$.each(contents, function(a,val) {
						var gid = 0;
						$.each(repod.psdle.entitlement_cache[val.productId], function(c,b) {
							if (repod.psdle.gamelist[b.glid].pid == val.contentId) { gid = b.glid; }
						});
						val = repod.psdle.gamelist[gid];
						if (sys == "Vita") { sys = "PS Vita"; }	
						var u = repod.psdle.config.game_page+val.pid, is_plus = "";
						var sys2 = repod.psdle.safeGuessSystem(val.platform);
						if (val.plus === true && repod.psdle.config.check_entitlements) { is_plus = "is_plus"; plus++; }
						
						temp += "<tr class='"+is_plus+"'><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+u+"'><img title='"+repod.psdle.lang.labels.page+" #"+Math.ceil(val.id/24)+"' src='"+val.icon+"' class='psdle_game_icon' /></a></td><td><a id='psdle_index_"+(val.id -1)+"' class='psdle_game_link' target='_blank' href='"+u+"'>"+val.title+"</a></td><td>"+sys2+"</td><td>"+sys+"</td><td>"+val.size+"</td><td>"+val.date+"</td></tr>";
					});
				});
				$("#table_stats").html(repod.psdle.gamelist_cur.length+((repod.psdle.config.check_entitlements)?" (<div id='psdleplus' style='display:inline-block' /> "+plus+")":"")+" / "+repod.psdle.gamelist.length);
				if (repod.psdle.config.check_entitlements) { $("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"}); }
				$("#muh_table > tbody").html(temp).promise().done(function() { repod.psdle.table.margin(); });
			},
			display: function() {
				this.bindings();
				$("#sub_container").html("").append(repod.psdle.genSearchOptions(true));
				repod.psdle.dlQueue.batch.get(repod.psdle.dlQueue.generate.table());
			},
			destroy: function() {
				$("#sub_container").html("");
			}
		}
	},
	newbox: {
		generate: function(e) {
			var plus = "", i = (isNaN(e)) ? Number($(e).find(".psdle_game_link").attr("id").split("_").pop()) : Number(e), game = repod.psdle.gamelist[i], id = (game.id -1);
			var dialog = $("<div id='dlQueueAsk' style='background-image:url(\""+game.icon.replace(/(w|h)=\d+/g,"=400")+"\");'/>");
			try { if (game.plus) { plus = $("#psdleplus").clone()[0].outerHTML+" "; } } catch(e) {}
			dialog.append("<div id='dlQAN'>"+plus+game.title+"</div>");
			if (repod.psdle.config.use_queue) {
				var t = "<div><div id='dla_all_"+id+"'>All</div></div>";
				var temp = game.plat_og.slice(0), i = $.inArray("PSP", temp); if(i != -1) { temp.splice(i, 1); } /* Make sure we don't have PSP */
				if (temp.length > 1) {
					$.each(temp,function(a,b) {
						var c = b.replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
						t += "<div><div id='dla_"+c+"_"+id+"' class='"+d+"'>"+b+"</div></div>";
					});
				} else {
					var c = temp[0].slice(0).replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
					t = "<div><div id='dla_"+c+"_"+id+"' class='"+d+"'>Download to "+game.plat_og[0].slice(0)+"</div></div>";
				}
				dialog.append("<div id='dlQASys'>"+t+"</div>");
			}
			var star = '<div class="star-rating rater-0 ratingStarGeneric star-rating-applied star-rating-readonly star-rating-on" style="display:inline-block !important;float:none !important;vertical-align:text-top"><a title="1">1</a></div>';
			try { if (!isNaN(game.rating)) { dialog.append("<div id='dlQARating'>"+star+" "+game.rating+" / 5</div>"); } } catch (e) { }
			dialog.append("<div id='dlQAStat'>"+repod.psdle.safeGuessSystem(game.platform)+" | "+game.size+" | "+game.date+"</div>");
			return dialog;
		},
		bind: function(e) {
			switch (e) {
				case "on":
				default:
					$("#dlQueueAsk").draggable({handle:"#dlQAN",containment:"parent"});
					$("#dlQueue_newbox").one("click", function() { $(this).remove(); repod.psdle.newbox.bind("off"); });
					$("#dlQueueAsk").on("click", function(event) {	event.stopPropagation(); });
					$("div[id^=dla_]:not('.toggled_off')").on("click", function() {
						repod.psdle.dlQueue.batch.add.parse($(this).attr("id").split("_")[2],$(this).attr("id").split("_")[1]);
					});
					break;
				case "off":
					$("div[id^=dla_]").off("click"); 
					$("#dlQueueAsk").off("click");
					break;
			}
		}
	},
	debug: function() {
		this.gamelist = []; 
		/* */
		this.table.gen();
	}
};

var a = setInterval(function(a){ if ($("li.cellDlItemGame").length) { clearInterval(repod.psdle.config.timerID); repod.psdle.init(); } },1000);
repod.psdle.config = {"timerID":a};
console.log("PSDLE | Ready.");