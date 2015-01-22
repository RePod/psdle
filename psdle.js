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

var repod = {};
repod.psdle = {
	gamelist: [], gamelist_cur: [], autocomplete_cache: [], lang: {},
	lang_cache: {
		"en": {
			"def": "us",
			"us":{"local":"English","startup":{"apis":"Select which APIs you would like to use, hover for more details.<br />Certain APIs may not be disabled.","wait":"Please wait.","start":"Start"},"columns":{"icon":"Icon","name":"Name","platform":"Platform","size":"Size","date":"Date"},"labels":{"export_view":"Export View","games":"Games","avatar":"Avatars","demo":"Demos","unlock":"Unlocks","pass":"Passes","pack":"Packs","theme":"Themes","addon":"Add-ons","app":"Applications","unknown":"Unknown","page":"Page"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"Error: Browser does not have JSON.stringify.","yes":"Yes","no":"No","search":"Search by game title","dlQueue":"Queue","dlList":"List","plus":"Toggle visibility of PS+ titles."},"apis":[{"internal_id":"api_entitle","name":"Entitlements","desc":"Cannot be disabled. Accesses purchase information used to create the download list, determine PS+ status, and other things."},{"internal_id":"api_game","name":"Catalog","desc":"Accesses additional game information to determine proper console, fix broken images, and more."},{"internal_id":"api_queue","name":"Download Queue","desc":"Allows adding and removing items from the download queue. Reads download queue information and the amount of activated consoles on the account."}]}
		},
		"es": {
			"def": "mx",
			"mx":{"local":"Español","startup":{"wait":"Esperando en la página se cargue."},"columns":{"icon":"Icono","name":"Nombre","platform":"Plataforma","size":"Tamaño","date":"Fecha"},"labels":{"export_view":"Exportar vista","games":"juegos","avatar":"avatares","demo":"población","unlock":"descubrir","pass":"adelantar","pack":"paquete","theme":"Temas","addon":"Complementos","app":"Aplicaciones","unknown":"Desconocido","page":"paje"},"strings":{"delimiter":"Ingrese delimitador:","stringify_error":"Error: Navegador no tiene JSON.stringify.","yes":"Sí","no":"No","search":"Búsqueda por título del juego"}} // Caaz, somebody.
		},
		"de": {
			"def": "de",
			"de":{"local":"Deutsch","startup":{"wait":"Seite wird geladen, bitte warten."},"columns":{"icon":"Symbol","name":"Name","platform":"Plattform","size":"Größe","date":"Datum"},"labels":{"export_view":"Exportiere Ansicht","games":"Spiele","avatar":"Spielerbilder","demo":"Demos","unlock":"Freischaltbares","pass":"Pässe","pack":"Bündel","theme":"Themen","addon":"Erweiterungen","app":"Anwendungen","unknown":"Unbekannt","page":"Seite"},"strings":{"delimiter":"Geben sie ein Trennzeichen ein","stringify_error":"Fehler: Browser fehlt \"JSON.stringify\".","yes":"Ja","no":"Nein","search":"Spiele titel eingeben für direkte suche"}} // Provided by /u/_MrBubbles
		},
		"ru": {
			"def":"ru",
			"ru":{"local":"Русский","startup":{"wait":"Ожидание загрузки страниц..."},"columns":{"icon":"Иконка","name":"Название","platform":"Платформа","size":"Размер","date":"Дата"},"labels":{"export_view":"Export View","games":"Игры","avatar":"Аватары","demo":"Демо-версии","unlock":"Разблокировки","pass":"Сезонные пропуски ","pack":"Набор","theme":"Темы","addon":"Дополенния","app":"Приложения","unknown":"Неизвестно","page":"Страница"},"strings":{"delimiter":"Введите разделитель:","stringify_error":"Ошибка: в браузере отсутствует JSON.stringify.","yes":"Да","no":"Нет","search":"Поиск по названию игры"}} //Provided by MorbertDou (issue #2)
		},
		"ps": {
			"def": "pi",
			"pi":{"local":"Pirate","startup":{"wait":"Ye be waitin."},"columns":{"icon":"Doubloon","name":"Title","platform":"Ship","size":"Boat","date":"Date"},"labels":{"export_view":"Compass","games":"Booty","avatar":"Shipmates","demo":"Plans","unlock":"Keys","pass":"Sails","pack":"Treasure Hoard","theme":"Paint","addon":"Cannons","app":"Galley","unknown":"Davey Jones' Locker","page":"Map"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"The sea don't have a JSON.stringify.","yes":"Yargh","no":"Nay","search":"Set a course for booty"}}, //Arcon
			"dz":{"local":"Dovahzul","startup":{"wait":"Saraan fah deykel wah genun."},"columns":{"icon":"Andiir","name":"For","platform":"Palaar","size":"Raaz","date":"Zahtiid"},"labels":{"export_view":"Sav Fahzon","games":"Kred","avatar":"Rahnunahst","demo":"Gor","unlock":"Bex","pass":"Rahn","pack":"Edrah","theme":"Niin","addon":"Malur","app":"Mii","unknown":"Vomindok","page":"Deykel"},"strings":{"delimiter":"Haav krenok:","stringify_error":"Tozein Hi dreh ni lost JSON.stringify","yes":"Geh","no":"Nid","search":"Tovit naal kred tet "}}, // Caaz
			"ha":{"local":"H4k3r","startup":{"apis":"import.APIs (hover: man)","wait":"G4th3ring rez0urc3s.","start":"make"},"columns":{"icon":"1con","name":"H4ndle","platform":"P|a+f0rm","size":"S1z3","date":"D4te"},"labels":{"export_view":"D0x","games":"W4rez","avatar":"4va+ar","demo":"Freeware","unlock":"H4x","pass":"Pa55e5","pack":"Pax","theme":"R1cez","addon":"Add-0ns","app":"S0f+w4r3","unknown":"?","page":"P4g3"},"strings":{"delimiter":"5pli+ by:","stringify_error":"3rr0r: No JSON.stringify.","yes":"Y","no":"N","search":"grep"}} //Caaz
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
			logoBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAfCAYAAAEO89r4AAABaUlEQVRoge2XS27CQAyGPSVSUVErdqzpMqveiRvALnu67Gl6D+gFuAKIPgQrs0o1TJSJJ7aJBvnbRXE8f357XoCIGyTiEBFf33+BwgMpyg/eVRNSsENEpAQWMa27agL1e7JWcmCSVSG+tF6jp1D4o/qkqN8un+Bl7JpJUxP5vH38XT2T655CtEf6olKoaFLq3ElK2heRlgq//U/KKVj4rcrvs+Y+h7Z1ow2Vv9eg6A5p53MxhnI2an0vWSmW0HI2EhUTI5vSN4T2Xem0ycZRh4h7AJgOLaQLlf1ega2br3/IQlMW6TA2dYEPc2XToyZUGtbOdMs1lyX0lqeubEpvQqVp9GhsghxPOpvY8yPA1yo+MRtCh7iWfJ/j49rOpEE2QnM55h1U7/Wcox0nb+y9lqY6dzYtmgtmqDBmqDBmqDCDGcq5Ew5xCqViHSqMGSqMGSqMGSpMp6H3unloYR0qjBkqjBkqjBkqzAUtBKxj5lT3GAAAAABJRU5ErkJggg==",
			game_page: chihiro.getBaseUrl()+"#!/"+chihiro.getCultureCode()+"/cid=",
			game_api: SonyChi_SessionManagerSingleton.getBaseCatalogURL()+"/",
			lastsort: "",
			lastsort_r: false,
			language: chihiro.getCultureCode(),
			deep_search: false,
			deep_waiting: 0,
			deep_current: 0,
			last_search: "",
			dlQueue: { base: SonyChi_SessionManagerSingleton.getDLQueueBaseURL(), status: SonyChi_SessionManagerSingleton.getDLQueueStatusURL(), status2: SonyChi_SessionManagerSingleton.getDLQueueStatusURL2() },
			use_queue: 0, active_consoles: {},
			tag_line: "<br /><a class='psdle_tiny_link' href='//repod.github.io/psdle' target='_blank'>Website</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle' target='_blank'>Repository</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation' target='_blank'>Submit Bug/Translation</a>",
			switch_align: "center", switch_color: "#85C107",
			has_plus: false
		}; 
		try { if (GM_info) this.config.tag_line += " - <span class='psdle_tiny_link'>Userscript: "+GM_info.script.version+"</span>"; } catch (e) { };
		this.determineLanguage(this.config.language,true);
		this.injectCSS();
		SonyChi_SessionManagerSingleton.getUserDevices()
		$(document).on('change', "#sub_container > select#lang_select", function() { that.config.language = $(this).val(); that.determineLanguage($(this).val(),true); that.genDisplay(); });
		this.genStartup();
	},
	genStartup: function() {
		if ($("#psdle_start").length == 0) {
			var startup = $("<div id='psdle_start' />"), that = this;
			startup.css({"z-index":"9001","width":"84px","height":"31px","position":"fixed","bottom":"10px","left":"10px","cursor":"pointer","box-shadow":"0px 0px 10px #FFF"})
			startup.css({"background-image":"url('"+repod.psdle.config.logoBase64+"')"});
			startup.appendTo("body");
			$(document).one("click","#psdle_start",function() {	$(this).remove(); that.genDisplay(); });
		}
	},
	genDisplay:function(mode) {
		var that = this;
		if (!$("#muh_games_container").length) { $("body").append("<div id='muh_games_container' />"); }
		$(document).off("click",".psdle_btn");
		$("#muh_games_container").slideUp('slow', function() {
			var a = "<div id='sub_container'><a href='//repod.github.io/psdle/' target='_blank'><img src='"+repod.psdle.config.logoBase64+"' style='display:inline-block;font-size:200%;font-weight:bold' alt='psdle' /></a></span>";
			
			if (mode == "progress") {
				if (that.config.use_queue) {
					var sys = {}, c = SonyChi_SessionManagerSingleton.getUserObject();
					if (c.getActiveVitaCount() > 0) { sys.vita = 1; }
					if (c.getActivePS3Count() > 0) { sys.ps3 = 1; }
					if (c.getActivePS4Count() > 0) { sys.ps4 = 1; }
					that.config.active_consoles = sys;
				}
				a += "<br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>"+that.lang.startup.wait+"</span>";
			} else {
				a += "<br /><br />"+that.lang.startup.apis+"<br /><br /><span class='psdle_fancy_bar'>";
				$.each(that.lang.apis, function(key,con) { a += "<span id='"+con.internal_id+"' title='"+con.desc+"'>"+con.name+"</span>"; });
				a += "</span><br /><br /><span id='psdle_go' class='psdle_btn'>"+that.lang.startup.start+"</span><br />"+that.generateLangBox()+that.config.tag_line+"</div>";
				$(document).on('click','[id^=api_]',function() { if ($(this).attr("id") !== "api_entitle") { $(this).toggleClass('toggled_off'); } });
				$(document).one('click',"#psdle_go",function () {
					that.config.deep_search = !$("#api_game").hasClass("toggled_off");
					that.config.use_queue = !$("#api_queue").hasClass("toggled_off");
					that.genDisplay("progress");
				});
			}
			$("#muh_games_container").html(a).slideDown('slow',function() {
				if (mode == "progress") { that.generateList(); }
				else { $("[id^=api_]").tooltip({position: {my: "center top", at: "center bottom"}}) }
			});
		});
	},
	generateList: function() {
		console.log("PSDLE | Generating download list.");
		var entitlements = gEntitlementManager.getAllEntitlements(), that = this;

		$.each(entitlements, function(index,obj) {
			if (that.isValidContent(obj)) { /* Determine if game content. */
				var temp = {};
				
				//Constants/pre-determined.
				temp.deep_type = "unknown";
				temp.pid = obj.product_id;
				temp.id = obj.id;
				temp.index = that.gamelist.length+1;

				if (obj.entitlement_attributes) {
					/* PS4 */
					if (obj.game_meta) {
						temp.name = obj.game_meta.name;
						temp.api_icon = obj.game_meta.icon_url;
						temp.id
						//temp.icon = obj.game_meta.icon_url;
					}
					temp.size = obj.entitlement_attributes[0].package_file_size;
					temp.platform = ["PS4"];
				} else if (obj.drm_def) {
					/* PS3, PSP, or Vita */
					temp.name = obj.drm_def.contentName;
					temp.api_icon = obj.drm_def.image_url;
					temp.size = obj.drm_def.drmContents[0].contentSize;
					temp.platform = [];
					console.log(index, obj.drm_def.drmContents[0].platformIds);
					$.each({"1":KamajiPlatformFlags.PS3,"3": KamajiPlatformFlags.PSP,"8":KamajiPlatformFlags.VITA}, function (t,u) {
						0 !== (obj.drm_def.drmContents[0].platformIds >>> 1 & u >>> 1) && temp.platform.push(KamajiPlatforms[Number(t)]);
					});
				}
				
				//Post-processing.
				temp.size_f = formatFileSizeDisplayStr(temp.size);
				temp.icon = SonyChi_SessionManagerSingleton.buildBaseImageURLForProductId(temp.pid)+"&w=31&h=31";
				temp.api_icon = temp.api_icon+"&w=31&h=31";
				temp.date = obj.active_date;
				temp.pdate = convertToNumericDateSlashes(convertStrToDateObj(temp.date));
				temp.url = repod.psdle.config.game_page+temp.pid;
				temp.platform_og = temp.platform.slice(0);
				
				//Get Plus status
				if (!obj.drm_def && !!obj.inactive_date) { temp.plus = true; } //PS4, Vita, PSP
				if (obj.license && obj.license.expiration) { temp.plus = true; } //PS3
				if (temp.plus) { repod.psdle.config.has_plus = true; }
				
				that.gamelist.push(temp);
				
				if (repod.psdle.config.deep_search) { that.game_api.queue(temp.index,temp.pid); }	
			}
		});
		console.log("PSDLE | Finished generating download list.");
		if (repod.psdle.config.deep_search) {
			this.game_api.run(); this.game_api.run(); this.game_api.run(); this.game_api.run();
		} else {
			this.table.gen();
		}
	},
	isValidContent: function(obj) {
		if (obj.VUData) { return !1; }
		else if (obj.drm_def && obj.drm_def.contentType == "TV") { return !1; }
		else if (obj.drm_def || obj.entitlement_attributes) { return !0; }
		else { return !1; }
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
			repod.psdle.config.lastsort = ""; repod.psdle.config.lastsort_r = false; var that = this;
			$("#muh_games_container").css({"position":"absolute"});
			$("#sub_container").html(repod.psdle.genSearchOptions()).append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+repod.psdle.lang.columns.platform+"</th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table><br />"+repod.psdle.config.tag_line);
			this.regen(); this.bindSearch();
			console.log("PSDLE | Table generated. sorting table");
			//repod.psdle.sortGamelist("#sort_date");
			$("#muh_games_container").slideDown('slow').promise().done(function() { that.margin(); });
		},
		regen: function(a) {
			if (a !== true) { repod.psdle.determineGames(); }
			repod.psdle.autocomplete.bind();
			var that = this, temp = "", plus = 0, count = 0;
			$.each(repod.psdle.gamelist_cur,function (a,val) {
				var valid = 1;
				switch (repod.psdle.config.switch_align) {
					case "left":
						if (val.plus) { valid = 0; }
						break;
					case "center":
					default:
						if (val.plus) { plus++; }
						break;
					case "right":
						if (!val.plus) { valid = 0; } else { plus++; }
						break;
				}
				if (valid) {
					count++;
					temp += repod.psdle.table_utils.gen.row(val);					
				}
			});
			var psswitch = (repod.psdle.config.has_plus) ? " (<div id='slider' title='"+repod.psdle.lang.strings.plus+"'><div class='handle_container' style='text-align:"+repod.psdle.config.switch_align+"'><div class='handle' style='background-color:"+repod.psdle.config.switch_color+"'/></div></div> <div id='psdleplus' style='display:inline-block' /> "+plus+")" : "";
			$("#table_stats").html(count+psswitch+" / "+repod.psdle.gamelist.length);
			if ($("#slider").length > 0) { $("#slider").tooltip().one("click",function() { that.plus_switch(); }); }
			if (chihiro.isMobile()) {
				$("#psdleplus").html('<img class="psPlusIcon" src="mobile/img/furniture/psplusicon-small.a2ec8f23.png">');
			} else {
				$("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"});
			}
			$("#muh_table > tbody").html(temp);
			this.icons.select();
		},
		plus_switch: function() {
			var a, b;
			switch ($(".handle_container").css("text-align")) {
				case "left":
				default:
					a = "center"; b = "#85C107";
					break;
				case "center":
					a = "right"; b = "#2185f4";
					break;
				case "right":
					a = "left"; b = "#F6573A";
					break;
			}
			repod.psdle.config.switch_align = a;
			repod.psdle.config.switch_color = b;
			$("#slider").tooltip();
			this.regen();
		},
		margin: function() {
			$("#muh_table").animate({"margin-top":$("#search_options").outerHeight() - $("#sub_container").css("padding-top").replace("px","")+"px"});
		},
		icons: {
			select: function(type) {
				type = (type) ? type : "smart";
				var that = this;
				if (type == "smart") $(document).off("scroll").on("scroll",function() { that.smartScroll(); }); this.smartScroll();
				if (type == "batch") this.batch(0,true);
			},
			validate: function(source) {
				var me = source, index = me.split("_").pop();
				if (!repod.psdle.gamelist[index].safe_icon) { 
					$.get(repod.psdle.gamelist[index].icon)
					.done(function() { repod.psdle.gamelist[index].safe_icon = true; $("#"+me+" .psdle_game_icon").attr("src", repod.psdle.gamelist[index].icon); })
					.fail(function() { repod.psdle.gamelist[index].safe_icon = true; repod.psdle.gamelist[index].icon = repod.psdle.gamelist[index].api_icon; $("#"+me+" .psdle_game_icon").attr("src", repod.psdle.gamelist[index].icon); });
				}
			},
			smartScroll: function() {
				/*
					Get icons currently in view, and a few nearby.
					TO-DO:
						Probably slowly work through other icons when using this.
				*/
				var padding = 5, low = window.scrollY, high = low+window.innerHeight, that = this,
				t = $("[id^=psdle_index_]").filter(function(a) { var pos = $(this).offset().top; if (pos >= low && pos <= high) { return 1; } }).filter(":first, :last"),
				first = ($(t[0]).index()-padding <= 0) ? 0 : $(t[0]).index()-padding,
				last = $(t[1]).index()+padding;
				$("[id^=psdle_index_]").slice(first,last).not(".go_icon").each(function(a) { $(this).addClass("go_icon"); var b = this; setTimeout(function() { that.validate($(b).attr("id")); },a*50); });
			},
			batch: function(start,all) {
				start = (start) ? start : 0;
				var batch = (all) ? repod.psdle.gamelist.length : (chihiro.isMobile()) ? 50 : 24;
				if ($(".psdle_game_icon").filter(function() { return !$(this).attr("src"); }).length > 0) {
					this.runBatch(start,(start+batch));
				}
			},
			runBatch: function(start,end) {
				// Batches icon requests to avoid flooding the server at once. Batch size is determined in this.batch().
				var that = this;
				$(".psdle_game_icon").slice(start,end).each(function(a) {
					var me = $(this).parent().parent().parent().attr("id"), index = me.split("_").pop();
					setTimeout(function() {
						$.get(repod.psdle.gamelist[index].icon)
						.done(function() { if (a == end-start-1) { setTimeout(that.batch(end),200); } repod.psdle.gamelist[index].safe_icon = true; $("#"+me+" .psdle_game_icon").attr("src", repod.psdle.gamelist[index].icon); })
						.fail(function() { if (a == end-start-1) { setTimeout(that.batch(end),200); } repod.psdle.gamelist[index].safe_icon = true; repod.psdle.gamelist[index].icon = repod.psdle.gamelist[index].api_icon; $("#"+me+" .psdle_game_icon").attr("src", repod.psdle.gamelist[index].icon); });
					},(a*20));
				});
			}
		}
	},
	determineGames: function() {
		this.exportTable.destroy();
		this.gamelist_cur = []; this.autocomplete_cache = [];
		var that = this, temp = "", safesys = this.safeSystemCheck();
		var search = (!!$("#psdle_search_text")) ? $("#psdle_search_text").val() : this.config.last_search;
		//$("[id^=filter_]").filter(function() { return !$(this).hasClass("toggled_off"); })
		/* Determine filters. */ var filters = {}; $.each($("[id^=filter_]"), function() {var n = $(this).attr("id").split("_").splice(1).join("_");filters[n] = $(this).hasClass("toggled_off");});
		$("#psdle_search_text").removeClass("negate_regex");
		
		$.each(this.gamelist,function(index,val) {
			var sys = that.safeGuessSystem(val.platform), a = true, t = val.name;
			if ($.inArray(sys,safesys) > -1) { 
				if (that.config.deep_search) {
					if (filters[val.deep_type]) { a = false; }
				}				
				if (a == true && search !== "") {
					var regex = search.match(/^\/(.+?)\/([imgd]+)?$/i);
					a = (!!regex && !!regex[2] && regex[2].toLowerCase().indexOf("d") >= 0) ? true : false;
					if (a) { $("#3").addClass("negate_regex"); regex[2] = regex[2].replace("d",""); }
					if (!!regex) { if (RegExp((regex[1])?regex[1]:search,(regex[2])?regex[2]:"").test(t)) { a = !a; } }
					else if (t.toLowerCase().indexOf(search.toLowerCase()) >= 0) { a = !a; }
				}
				if (a == true) {
					that.gamelist_cur.push(val);
					that.autocomplete_cache.push({"label":t,"value":t});
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
		temp += "<br />";
		if (this.config.deep_search && !dlQueue) {					
		temp +=		'<span class="psdle_fancy_bar">' +
					'<span id="filter_downloadable_game">'+this.lang.labels.games+'</span>' +
					'<span id="filter_avatar">'+this.lang.labels.avatar+'</span>' +
					'<span id="filter_demo">'+this.lang.labels.demo+'</span>'+
					'<span id="filter_add_on">'+this.lang.labels.addon+'</span>' +
					'<span id="filter_application">'+this.lang.labels.app+'</span>' +
					'<span id="filter_theme">'+this.lang.labels.theme+'</span>' +
					'<span id="filter_unknown">'+this.lang.labels.unknown+'</span></span><br />';
		}
		if (!dlQueue) { temp += "<input type='text' id='psdle_search_text' placeholder='"+this.lang.strings.search+"' />"; }
		temp += "<br />";
		temp += '<span id="table_stats"></span></div>';
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
					if (a.date > b.date) { return 1; }
					if (a.date < b.date) { return -1; }
					return 0;
				});
				break;
			case "sort_name":
				this.gamelist_cur.sort(function (a, b) {
					if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) { return 1; }
					if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) { return -1; }
					return 0;
				});	
				break;
			case "sort_size":
				this.gamelist_cur.sort(function (a, b) {
					if (a.size > b.size) { return 1; }
					if (a.size < b.size) { return -1; }
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
		var sys = (typeof(sys_in) == "object") ? sys_in.join(" ").replace("™","") : sys_in;
		if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP") { sys = "PSP"; }
		if (sys == "PS3 PS Vita") { sys = "PS Vita"; }
		return sys;
	},
	injectCSS: function() {
		var temp =	/* Startup			*/ "#muh_games_container { display:none;position:fixed;top:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { padding:20px;background-color:#fff; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#2185f4;width:0%;height:100%;border-radius:10px; } .psdle_btn { cursor:pointer;border-radius:13px;background-color:#2185f4;color:#fff;padding:1px 15px;display:inline-block;margin:5px auto; } .psdle_tiny_link { color:#7F6D75 !important; font-size:x-small; } .psdle_tiny_link:hover { color:#000 !important; text-decoration:underline; } " +
					/* Search options	*/ "#search_options { position:fixed;left:0px;top:0px;width:100%;padding:15px 0px;background-color:rgba(255,255,255,0.8); }" +
					/* Table			*/ "th[id^=sort] { cursor:pointer; } table {} th {padding:5px;background-color:#2185F4;color:#fff;} tr:hover { background-color:rgba(33,133,244,0.7) !important; } td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding:8px;} .is_plus{background-color:#FFD10D;} tr:nth-child(2n) {background-color:#EEE;}  th:nth-child(n+3):nth-child(-n+7), td:nth-child(n+3):nth-child(-n+7) {text-align:center;padding:0px 5px;} td:first-child { text-align:center; }" +
					/* Search buttons	*/ "#psdle_search_text { margin:5px auto;padding:5px 10px;font-size:large;max-width:600px;width:100%;border-style:solid;border-color:#F0F0F0;border-radius:90px; } .negate_regex { background-color:#FF8080;color:#fff; } span[id^=system_], span[id^=filter_], span#export_view, span[id^=dl_], .psdle_fancy_bar > span { font-weight:bold; text-transform:uppercase;font-size:small;color:#fff;background-color:#2185f4;display:inline-block;margin-right:2px;margin-bottom:5px;padding:1px 15px;cursor:pointer; } .psdle_fancy_but { border-radius:12px; } .psdle_fancy_bar > span:first-of-type { border-top-left-radius:12px; border-bottom-left-radius:12px; } .psdle_fancy_bar span:last-of-type { border-top-right-radius:12px; border-bottom-right-radius:12px; } .toggled_off { opacity:0.4; }" +
					/* Content icons	*/ ".psdle_game_icon { max-width:100%;vertical-align:middle;padding:3px;min-width:42px;min-height:42px; }" +
					/* Sorting			*/ ".psdle_sort_asc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom:5px solid #fff; } .psdle_sort_desc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #fff; }" +
					/* Newbox			*/ "#dlQueueAsk { display:inline-block;width:400px;height:400px;background-color:#FFF;border-radius:20px;overflow:hidden;position:relative;background-size:cover; } #dlQAN { cursor:move;background-color:rgba(33,133,244,0.8);padding:7px 15px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; } #dlQASys { position:absolute;bottom:0px;padding:7px 0px;color:#FFF;display:table;width:100%;table-layout:fixed; } #dlQASys > div { display:table-cell; } #dlQASys > div > div { cursor:pointer;background-color:rgba(33,133,244,0.8);border-radius:10px;padding:2px;margin:0px 10px; } #dlQAStat { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-left-radius:20px;padding:0px 10px 0px 15px;font-size:small;float:right; } #dlQARating { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-right-radius:20px;padding:0px 15px 0px 10px;font-size:small;float:left; } " +
					/* Newbox Container	*/ "#dlQueue_newbox { z-index:9001;position:fixed;top:0px;left:0px;width:100%;height:100%;display:table;background-color:rgba(0,0,0,0.25); } #dlQueue_newbox > div { display:table-cell;vertical-align:middle;height:inherit;text-align:center; }" +
					/* PS+ switch		*/ "#slider { vertical-align: bottom;display:inline-block;cursor:pointer;border-radius:100%;width:30px;height:12px;border-radius:10px;border:2px solid #F0F0F0; } .handle_container { text-align:center;width:100%;height:100%; } .handle { width:10px;height:10px;border-radius:100%;margin:0px 2px 6px;border:1px solid #FFF;display:inline-block;background-color:#85C107; }" +
					/* Tooltips			*/ ".tooltip-inner { background-color:#2185F4 !important; border: 5px solid #2185F4 !important; } .tooltip-arrow { border-top-color:#2185F4 !important; } .tooltip.in { opacity:1 !important; }" +
					/* Autocomplete		*/ ".ui-autocomplete { z-index: 9002; max-width:590px; max-height:200px; overflow-y:auto; overflow-x:hidden; } .ui-menu { position:fixed; border:2px solid #F0F0F0; border-top: none; background-color:#fff; } .ui-menu > .ui-menu-item * { color:#000; text-decoration:none; white-space: nowrap; text-overflow: ellipsis; cursor:pointer; } .ui-menu > .ui-menu-item:nth-child(even) { background-color:#e6e6e6; } .ui-menu-item .ui-state-focus { display:inline-block; width:100%; color:#000; background-color: rgba(33, 133, 244, 0.7); }";
		$("head").append("<style type='text/css' id='psdle_css'>"+temp+"</style>");
	},
	exportTable: {
		display: function() {
			this.destroy();
			var w = 600;
			$("#search_options").append("<span id='sotextarea' style='display:none'><br /><textarea></textarea></span>");
			$("#sotextarea > textarea").css({"width":w,"max-width":w}).text(this.delimited(prompt(repod.psdle.lang.strings.delimiter,"	"))).select().parent().delay(500).slideDown();
			repod.psdle.table.margin();
		},
		destroy: function() { $("#sotextarea").remove(); repod.psdle.table.margin(); },
		json: function() { return (!!JSON.stringify) ? JSON.stringify(repod.psdle.gamelist_cur) : repod.psdle.lang.strings.stringify_error; },
		delimited: function(e) {
			var that = this, sep = (e) ? e : "	";
			var t = repod.psdle.lang.columns.name+sep+repod.psdle.lang.columns.platform+sep+repod.psdle.lang.columns.size+sep+repod.psdle.lang.columns.date+"\n";
			var trs = $("tr").filter(":gt(0)");
			trs.each(function() {
				var index = $(this).attr("id").split("_").pop(), b = repod.psdle.gamelist[index];
				t += b.name+sep+repod.psdle.safeGuessSystem(b.platform)+sep+b.size_f+sep+b.pdate+"\n";
			});
			return t;
		}
	},
	game_api: {
		batch: [],
		queue: function(index,pid) {
			var that = this;
			/* Do some queue/delay magic here. */
			this.batch.push({pid:pid,index:index});
		},
		run: function() {
			var that = this;
			if (this.batch.length > 0) {
				var a = this.batch.pop();
				$.getJSON(repod.psdle.config.game_api+a.pid)
				.success(function(data) { that.process(a.index,data); })
				.fail(function() { that.run(); });
			} else {
				if (!$("#muh_table").length) { repod.psdle.table.gen(); }
			}
		},
		process: function(index,data) {
			var l = Math.abs(repod.psdle.gamelist.length - this.batch.length), r = repod.psdle.gamelist.length,
				w = $('#psdle_bar').width(), pW = $('#psdle_bar').parent().width(), p = Math.round(100*w/pW), q = Math.round(100*l/r);
			if (q > p) { $("#psdle_progressbar > #psdle_bar").stop().animate({"width":q+"%"}); }
			$("#psdle_status").text(l+" / "+r);
			this.parse(index,data);
		},
		parse: function(index,data) {
			index--;
			if (data.default_sku && data.default_sku.entitlements.length == 1) {
				if (!!repod.psdle.gamelist[index]) {
					var sys, type = "unknown", r = /^(PS(?:1|2)).+Classic$/i;
					if (data.metadata) {
						if (!!data.metadata.game_subtype) {
							if (!!data.metadata.secondary_classification.values[0].match(r)) { sys = data.metadata.secondary_classification.values[0].match(r).pop(); }
							else if (!!data.metadata.game_subtype.values[0].match(r)) { sys = data.metadata.game_subtype.values[0].match(r).pop(); }
							else if (!!data.metadata.primary_classification.values[0].match(r)) { sys = data.metadata.secondary_classification.values[0].match(r).pop(); }
						} else if (!!data.metadata.playable_platform) { sys = data.metadata.playable_platform.values; }
					}
					if (sys) { repod.psdle.gamelist[index].platform = sys; }
				}
			}
			
			try { repod.psdle.gamelist[index].rating = data.star_rating.score; } catch (e) { }
			
			if (data.top_category == "tumbler_index") {
				//We must go deeper.
				if (data.metadata.secondary_classification.values[0] == "ADD-ON") { type = "add_on"; }
			} else {
				type = (data.top_category) ? data.top_category : "unknown";
			}
			repod.psdle.gamelist[index].deep_type = type;
			
			this.run()
		}
	},
	dlQueue: {
		batch: {
			cache: {},
			get: function(prev_sys) {
				if (!prev_sys) { this.cache = {"ps3":[], "ps4":[], "vita":[]} }
				var that = this, base_url = repod.psdle.config.dlQueue.status+"/?status=notstarted&status=stopped&status=waitfordownload&platformString=$$1&size=100", consoles = [];
				for (var i in repod.psdle.config.active_consoles) { consoles.push(i) }
				var index = $.inArray(prev_sys,consoles) + 1, n = consoles[index];
				if (n) {
					$.getJSON(base_url.replace("$$1",n))
					.fail(function() { console.error("PSDLE | DL Queue parse error for \""+n+"\". Is it activated on the account?"); })
					.success(function(data) { that.cache[n] = data.data.notifications; })
					.complete(function() { that.get(n); });
				} else {
					repod.psdle.dlQueue.generate.table();
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
							this.go(sys,game.id);
							break;
						case "all":
							var temp = game.platform_og.slice(0), i = $.inArray("PSP", temp); if(i != -1) { temp.splice(i, 1); } /* Make sure we don't have PSP */
							$.each(temp,function(a,b) { that.go(b.replace(/ps /i,"").toLowerCase(),game.id); });
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
					repod.psdle.dlQueue.batch.remove.go($(e).children("td:eq(3)").text().replace("PS ","").toLowerCase(),repod.psdle.gamelist[Number($(e).attr("id").split("_").pop())].id);
				},
				go: function(sys,id) {
					//Remove game from batch.
					repod.psdle.dlQueue.batch.send(sys,id,true,repod.psdle.dlQueue.batch.get())
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
				var temp = "";
				$.each(repod.psdle.dlQueue.batch.cache, function(key,value) {
					if (value.length) {
						$.each(value, function(index,val) {
							$.each(repod.psdle.gamelist, function(a,b) {
								if (b.id == val.contentId) {
									var c = val; c.to_sys = key;
									temp += repod.psdle.table_utils.gen.row(b,c);
								}
							});
						});
					}
				});
				$("#muh_table > tbody").html(temp);
				repod.psdle.table.margin();
			},
			display: function() {
				this.bindings();
				$("#sub_container").html("").append(repod.psdle.genSearchOptions(true));
				repod.psdle.dlQueue.batch.get();
			},
			destroy: function() {
				$("#sub_container").html("");
			}
		}
	},
	table_utils: {
		gen: {
			row: function(val,dlQueue) {
				var u = repod.psdle.config.game_page+val.id,
				pg = (chihiro.isMobile()) ? 50 : 24,
				icon = (val.safe_icon) ? val.icon : "",
				is_plus = (val.plus) ? "is_plus" : "",
				sys = repod.psdle.safeGuessSystem(val.platform),
				temp = "<tr id='psdle_index_"+(val.index -1)+"'><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+val.url+"'><img title='"+repod.psdle.lang.labels.page+" #"+Math.ceil(val.index/pg)+"' src='"+icon+"' class='psdle_game_icon "+is_plus+"' /></a></td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+val.name+"</a></td>";
				if (dlQueue) {
					temp += "<td>"+sys+"</td><td>"+dlQueue.to_sys.toUpperCase().replace("VITA","PS Vita")+"</td><td>"+val.size_f+"</td><td>"+convertToNumericDateSlashes(convertStrToDateObj(dlQueue.createdTime))+"</td>"
				} else {
					temp += "<td>"+sys+"</td><td>"+val.size_f+"</td><td>"+val.pdate+"</td>";
				}
				temp += "</tr>";
				return temp;
			}
		}
	},
	newbox: {
		generate: function(e) {
			var plus = "", i = (isNaN(e)) ? Number($(e).attr("id").split("_").pop()) : Number(e), game = repod.psdle.gamelist[i], id = (game.index -1);
			var dialog = $("<div id='dlQueueAsk' style='background-image:url(\""+game.icon.replace(/(w|h)=\d+/g,"=400")+"\");'/>");
			try { if (game.plus) { plus = $("#psdleplus").clone()[0].outerHTML+" "; } } catch(e) {}
			dialog.append("<div id='dlQAN'>"+plus+game.name+"</div>");
			if (repod.psdle.config.use_queue) {
				var t = "<div><div id='dla_all_"+id+"'>All</div></div>";
				var temp = game.platform_og.slice(0), i = $.inArray("PSP", temp); if(i != -1) { temp.splice(i, 1); } /* Make sure we don't have PSP */
				if (temp.length > 1) {
					$.each(temp,function(a,b) {
						var c = b.replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
						t += "<div><div id='dla_"+c+"_"+id+"' class='"+d+"'>"+b+"</div></div>";
					});
				} else {
					var c = temp[0].slice(0).replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
					t = "<div><div id='dla_"+c+"_"+id+"' class='"+d+"'>Download to "+game.platform_og[0].slice(0)+"</div></div>";
				}
				dialog.append("<div id='dlQASys'>"+t+"</div>");
			}
			var star = '<div class="star-rating rater-0 ratingStarGeneric star-rating-applied star-rating-readonly star-rating-on" style="display:inline-block !important;float:none !important;vertical-align:text-top"><a title="1">1</a></div>';
			try { if (!isNaN(game.rating)) { dialog.append("<div id='dlQARating'>"+star+" "+game.rating+" / 5</div>"); } } catch (e) { }
			dialog.append("<div id='dlQAStat'>"+repod.psdle.safeGuessSystem(game.platform)+" | "+game.size_f+" | "+game.pdate+"</div>");
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
	autocomplete: {
		bind: function() {
			if ($(".ui-autocomplete-input").length) {
				$("#psdle_search_text").autocomplete("close");
				$('#psdle_search_text').autocomplete("option", { source: repod.psdle.autocomplete_cache });
			} else {
				$("#psdle_search_text").autocomplete({
				  source:repod.psdle.autocomplete_cache,
				  position: { my : "center top", at: "center bottom" },
				  messages: { noResults: '', results: function() {} },
				  select: function(e,u) { console.log(u); repod.psdle.config.last_search = u.item.value; repod.psdle.table.regen(true); }
				})
			}
		}
	},
	die: function() {
		/* Obviously.	*/ $("#muh_games_container").remove();
		/* CSS			*/ $("#psdle_css").remove();
		/* Just 'psdle'	*/ delete repod.psdle; // Kappa
	}
};

var a = setInterval(function(a){ if (chihiro.appReady === true) { clearInterval(repod.psdle.config.timerID); repod.psdle.init(); } },500);
repod.psdle.config = {"timerID":a};
console.log("PSDLE | Ready.");