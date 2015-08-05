// ==UserScript==
// @author		RePod
// @name		PSDLE for Greasemonkey
// @description	Improving everyone's favorite online download list, one loop at a time. This will be updated infrequently, mostly for stability.
// @namespace	https://github.com/RePod/psdle
// @homepage	https://repod.github.io/psdle/
// @version		2.053
// @include		/https://store.playstation.com/*/
// @exclude		/https://store.playstation.com/(cam|liquid)/*/
// @updateURL	https://repod.github.io/psdle/psdle.user.js
// @downloadURL	https://repod.github.io/psdle/psdle.user.js
// @icon		https://repod.github.io/psdle/logo/6_psdle_64px.png
// @grant		none
// @noframes
// ==/UserScript==

/*

To keep this from updating remove the @updateURL (for automatic updates) and @downloadURL (for manual updates) above.
Alternatively, reconfigure the updating settings in your Userscript manager.

*/

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
    autocomplete_cache : [],
    gamelist           : [],
    gamelist_cur       : [],
    e_inject_cache     : [],
    id_cache           : {},
    lang               : {},
    pid_cache          : {},
    sys_cache          : {},
    type_cache         : {},
    lang_cache         :
    {
        "en": {
            "def": "us",
            "us":{"local":"English","startup":{"apis":"Select which APIs you would like to use, hover for more details.<br />Certain APIs may not be disabled.","wait":"Please wait.","start":"Start"},"columns":{"icon":"Icon","name":"Name","platform":"Platform","size":"Size","date":"Date"},"labels":{"export_view":"Export View","page":"Page"},"categories":{"downloadable_game":"Games","demo":"Demos","add_on":"Add-ons","unlock":"Unlocks","unlock_key":"Unlock Keys","avatar":"Avatars","theme":"Themes","other":"other","other_game_related":"other_game_related","game_content":"game_content","tumbler_index":"tumbler_index","home":"home","ungrouped_game":"ungrouped_game","promo_content":"promo_content","beta":"Betas","application":"Applications","extras":"Extras","unknown":"Unknown"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"Error: Browser does not have JSON.stringify.","yes":"Yes","no":"No","search":"Search by game title","dlQueue":"Queue","dlList":"List","plus":"Toggle visibility of PS+ titles.","queue_all":"All","queue_to":"Download to $SYS$"},"apis":[{"internal_id":"api_entitle","name":"Entitlements","desc":"Cannot be disabled. Accesses purchase information used to create the download list, determine PS+ status, and other things."},{"internal_id":"api_game","name":"Catalog","desc":"Accesses additional game information to determine proper console, fix broken images, and more."},{"internal_id":"api_queue","name":"Download Queue","desc":"Allows adding and removing items from the download queue. Reads download queue information and the amount of activated consoles on the account."},{"internal_id":"api_pstv","name":"PS TV","desc":"Detect PS TV compatible titles. Only supported on \"en-us\" web store (not PSDLE language).","disabled":true}]}
        },
        "es": {
            "def": "es",
            "es":{"local":"Español","startup":{"apis":"Elija APIs a utilizar. Coloque el puntero sobre el API para visualizar detalles.<br/>Algunos APIs no pueden ser deshabilitados.","wait":"Por favor espere...","start":"Inicio"},"columns":{"icon":"Ícono","name":"Nombre","platform":"Plataforma","size":"Tamaño","date":"Fecha"},"labels":{"export_view":"Exportar vista","page":"Página"},"categories":{"downloadable_game":"Juegos","demo":"Demos","add_on":"Complementos","unlock":"Desbloqueables","unlock_key":"Llaves","avatar":"Avatares","theme":"Temas","other":"Otros","other_game_related":"Otros","game_content":"Contenidos","tumbler_index":"tumbler_index","home":"Home","ungrouped_game":"No Clasificados","promo_content":"Promociones","beta":"Betas","application":"Aplicaciones","extras":"Extras","unknown":"Desconocido"},"strings":{"delimiter":"Ingrese delimitador:","stringify_error":"Error: Navegador no tiene JSON.stringify.","yes":"Sí","no":"No","search":"Búsqueda por título del juego","dlQueue":"Cola de Descargas","dlList":"Lista de Descargas","plus":"Alterna la visibilidad de los títulos de PS Plus.","queue_all":"Todos","queue_to":"Descargar a $SYS$"},"apis":[{"internal_id":"api_entitle","name":"Licencias","desc":"No puede ser deshabilitado. Accede a la información de las compras y se utiliza para construir la lista de descargas, determinar el estado de PS Plus y otras cosas."},{"internal_id":"api_game","name":"Catálogo","desc":"Accede a información adicional para determinar la consola adecuada, reparar imágenes rotas, y más."},{"internal_id":"api_queue","name":"Cola de Descargas","desc":"Permite añadir y remover entradas a la cola de descargas. Lee la información de la cola de descargas y el número de consolas activadas en la cuenta."},{"internal_id":"api_pstv","name":"PS TV","desc":"Detecta títulos compatibles con PS TV. Sólo soportado en la tienda de la región \"en-us\" (región, no idioma de PSDLE).","disabled":true}]} //Positronic-Brain
        },
        "de": {
            "def": "de",
            "de":{"local":"Deutsch","startup":{"wait":"Seite wird geladen, bitte warten."},"columns":{"icon":"Symbol","name":"Name","platform":"Plattform","size":"Größe","date":"Datum"},"labels":{"export_view":"Exportiere Ansicht","page":"Seite"},"categories":{"downloadable_game":"Spiele","demo":"Demos","add_on":"Erweiterungen","unlock":"Freischaltbares","avatar":"Spielerbilder","theme":"Themen","application":"Anwendungen","unknown":"Unbekannt",},"strings":{"delimiter":"Geben sie ein Trennzeichen ein","stringify_error":"Fehler: Browser fehlt \"JSON.stringify\".","yes":"Ja","no":"Nein","search":"Spiele titel eingeben für direkte suche"}} // Provided by /u/_MrBubbles
        },
        "fr": {
            "def": "fr",
            "fr":{"local":"Français","startup":{"apis":"Sélectionner l'API à utiliser; Survoler pour plus de détails.<br />Certaines APIs ne peuvent pas être désactivées.","wait":"Merci de patienter.","start":"Commencer"},"columns":{"icon":"Icône","name":"Nom","platform":"Plate-forme","size":"Taille","date":"Date"},"labels":{"export_view":"Exporter la vue","page":"Page"},"categories":{"downloadable_game":"Jeux","demo":"Démos","add_on":"DLCs","unlock":"Codes de déverouillage","avatar":"Avatars","theme":"Thèmes","application":"Applications","unknown":"Inconnu"},"strings":{"delimiter":"Entrer le délimiteur:","stringify_error":"Erreur: votre navigateur ne supporte pas JSON.stringify.","yes":"Oui","no":"Non","search":"Rechercher par titre de jeu","dlQueue":"Queue","dlList":"Liste","plus":"Afficher/cacher les titres PS+.","queue_all":"Tous","queue_to":"Télécharger sur $SYS$"},"apis":[{"internal_id":"api_entitle","name":"Droits","desc":"Ne peut pas être désactivée. Accède aux informations d'achat afin de créer la liste de téléchargement, et déterminer le statut PS+, ainsi que d'autres choses."},{"internal_id":"api_game","name":"Catalogue","desc":"Accède aux informations supplémentaires des jeux pour déterminer la plate-forme, corriger les liens d'images cassés, et plus."},{"internal_id":"api_queue","name":"Liste de téléchargement","desc":"Permet d'ajouter ou de retirer des articles de la liste de téléchargement. Lit les informations de la liste de téléchargement et le nombre de consoles activées sur le compte."},{"internal_id":"api_pstv","name":"PS TV","desc":"Détecte les titres compatibles PS TV. Ne marche que sur le store \"en-us\" (différent de la langue choisie pour PSDLE).","disabled":true}]} // Provided by @cramoisan
        },
        "ru": {
            "def":"ru",
            "ru":{"local":"Русский","startup":{"wait":"Ожидание загрузки страниц..."},"columns":{"icon":"Иконка","name":"Название","platform":"Платформа","size":"Размер","date":"Дата"},"labels":{"export_view":"Export View","page":"Страница"},"categories":{"downloadable_game":"Игры","demo":"Демо-версии","add_on":"Дополенния","unlock":"Разблокировки","avatar":"Аватары","theme":"Темы","application":"Приложения","unknown":"Неизвестно"},"strings":{"delimiter":"Введите разделитель:","stringify_error":"Ошибка: в браузере отсутствует JSON.stringify.","yes":"Да","no":"Нет","search":"Поиск по названию игры"}} //Provided by MorbertDou (issue #2)
        },
        "ps": {
            "def": "ha",
            "ha":{"local":"H4ker","startup":{"apis":"import.APIs (hover: man)","wait":"...","start":"make"},"columns":{"icon":"1con","name":"H4ndle","platform":"P|a+f0rm","size":"S1z3","date":"D4t3"},"labels":{"export_view":"D0x","page":"P4g3"},"categories":{"downloadable_game":"W4rez","demo":"Freeware","add_on":"Add-0ns","unlock":"Cracks","avatar":"4va+ar","theme":"Themes","other":"other","beta":"Betas","application":"S0f+w4r3","unknown":"?"},"strings":{"delimiter":"5pli+ by:","yes":"Y","no":"N","search":"grep","queue_all":"wget all","queue_to":"wget $SYS$"}} //Caaz
        }
    },
    determineLanguage: function(e,f) {
        e = (e) ? e.split("-") : this.config.language.split("-");
        if (f === true) { this.lang = {}; this.lang = this.lang_cache.en.us; }
        if (e[0] in this.lang_cache) {
            if (e[1] in this.lang_cache[e[0]]) {
                if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][e[1]]); this.sanitizeLanguage(); }
                e = e[0]+"-"+e[1];
            } else {
                if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][this.lang_cache[e[0]].def]); this.sanitizeLanguage(); }
                e = e[0]+"-"+this.lang_cache[e[0]].def;
            }
        } else {
            e = "en-us";
        }
        return e;
    },
    sanitizeLanguage: function() {
        //Send help.
        var a = JSON.stringify(this.lang, function(key, value) { if(typeof value === "string") { return value.replace(/'/g, "&apos;"); } return value; });
        this.lang = JSON.parse(a);
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

        var that = this,
            l    = chihiro.getUrlCultureCode().toString().toLowerCase();

        this.config = {
            logoBase64      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAfCAYAAAEO89r4AAABaUlEQVRoge2XS27CQAyGPSVSUVErdqzpMqveiRvALnu67Gl6D+gFuAKIPgQrs0o1TJSJJ7aJBvnbRXE8f357XoCIGyTiEBFf33+BwgMpyg/eVRNSsENEpAQWMa27agL1e7JWcmCSVSG+tF6jp1D4o/qkqN8un+Bl7JpJUxP5vH38XT2T655CtEf6olKoaFLq3ElK2heRlgq//U/KKVj4rcrvs+Y+h7Z1ow2Vv9eg6A5p53MxhnI2an0vWSmW0HI2EhUTI5vSN4T2Xem0ycZRh4h7AJgOLaQLlf1ega2br3/IQlMW6TA2dYEPc2XToyZUGtbOdMs1lyX0lqeubEpvQqVp9GhsghxPOpvY8yPA1yo+MRtCh7iWfJ/j49rOpEE2QnM55h1U7/Wcox0nb+y9lqY6dzYtmgtmqDBmqDBmqDCDGcq5Ew5xCqViHSqMGSqMGSqMGSpMp6H3unloYR0qjBkqjBkqjBkqzAUtBKxj5lT3GAAAAABJRU5ErkJggg==",
            game_page       : chihiro.getBaseUrl() + "#!/" + l + "/cid=",
            game_api        : SonyChi_SessionManagerSingleton.getBaseCatalogURL() + "/",
            lastsort        : "",
            lastsort_r      : false,
            language        : l,
            deep_search     : false,
            deep_waiting    : 0,
            deep_current    : 0,
            last_search     : "",
            dlQueue         :
            {
                base        : SonyChi_SessionManagerSingleton.getDLQueueBaseURL(),
                status      : SonyChi_SessionManagerSingleton.getDLQueueStatusURL(),
                status2     : SonyChi_SessionManagerSingleton.getDLQueueStatusURL2()
            },
            use_queue       : false,
            active_consoles : {},
            tag_line        : "<br /><a class='psdle_tiny_link' href='//repod.github.io/psdle' target='_blank'>Website</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle' target='_blank'>Repository</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation' target='_blank'>Submit Bug/Translation</a>",
            switch_align    : "center",
            switch_color    : "#85C107",
            has_plus        : false,
            check_tv        : false,
            tv_url          : atob("L3N0b3JlL2FwaS9jaGloaXJvLzAwXzA5XzAwMC9jb250YWluZXIvVVMvZW4vMTkvU1RPUkUtTVNGNzcwMDgtUFNUVlZJVEFHQU1FUz9zaXplPTMw"),
            iconSize        : 42,
            showExpired     : false
        };

        console.log("PSDLE | Config set.");

        try {
            if (GM_info) {
                this.config.tag_line += " - <span class='psdle_tiny_link'>Userscript: "+GM_info.script.version+"</span>";
            }
        }
        catch (e) { };

        this.determineLanguage(this.config.language,true);
        this.injectCSS();

        SonyChi_SessionManagerSingleton.getUserDevices()

        this.genStartup();
    },
    genStartup: function() {
        if ($("#psdle_start").length == 0) {
            var that = this,
                startup = $("<div/>",{id:"psdle_start"}).css({"z-index":"9001","width":"84px","height":"31px","position":"fixed","bottom":"10px","left":"10px","cursor":"pointer","box-shadow":"0px 0px 10px #FFF","background-image":"url('"+repod.psdle.config.logoBase64+"')"}).appendTo("body");

            $(document).one("click","#psdle_start",function() {
                $(this).remove();
                that.genDisplay();
            });
        }
    },
    genDisplay: function(mode,fake_list) {
        var that = this;

        $(document).one("change", "#sub_container > select#lang_select", function() {
            that.config.language = $(this).val();
            that.determineLanguage($(this).val(),true);
            that.genDisplay("nobind");
        });

        if (!$("#muh_games_container").length) {
            $("body").append("<div id='muh_games_container' />");
        }

        $("#muh_games_container").slideUp('slow', function() {
            var a = "<div id='sub_container'><a href='//repod.github.io/psdle/' target='_blank'><img src='"+repod.psdle.config.logoBase64+"' style='display:inline-block;font-size:200%;font-weight:bold' alt='psdle' /></a></span>";

            if (mode == "progress") {
                if (that.config.use_queue) {
                    var sys = {}, c = SonyChi_SessionManagerSingleton.getUserObject();
                    if (c.hasActiveVita()) { sys.vita = 1; }
                    if (c.hasActivePS3()) { sys.ps3 = 1; }
                    if (c.hasActivePS4()) { sys.ps4 = 1; }
                    that.config.active_consoles = sys;
                }
                a += "<br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>"+that.lang.startup.wait+"</span>";
            } else {
                a += "<br /><br />"+that.lang.startup.apis+"<br /><br /><span class='psdle_fancy_bar'>";
                $.each(that.lang.apis, function(key,con) {
                    if (con.internal_id == "api_pstv") {
                        a += (chihiro.getUrlCultureCode().toString().toLowerCase() == "en-us")?"<span id='"+con.internal_id+"' class='"+((con.disabled)?"toggled_off":"")+"' title='"+con.desc.replace(/'/g, "&apos;")+"'>"+con.name+"</span>":"";
                    } else {
                        var off = (con.internal_id == "api_game") ? 'toggled_off' : "";
                        a += "<span id='"+con.internal_id+"' title='"+con.desc.replace(/'/g, "&apos;")+"' class='"+off+"'>"+con.name.replace(/'/g, "&apos;")+"</span>";
                    }
                });
                a += "</span><br /><br /><span id='psdle_go' class='psdle_btn'>"+that.lang.startup.start+"</span><br />"+that.generateLangBox()+that.config.tag_line;
                a += "<br /><span id='inject_lang' class='psdle_tiny_link'>Inject Language</span> - <a class='psdle_tiny_link' target='_blank' href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation#translation-submission-template'>Language Template</a> - <span id='gen_fake' class='psdle_tiny_link'>Generate Fake List</span> - <span id='ask_switches' class='psdle_tiny_link'>Switches</span>";
                a +="</div>";
                if (mode !== "nobind") {
                    $(document).on("click","[id^=api_]",function() { if ($(this).attr("id") !== "api_entitle") { $(this).toggleClass('toggled_off'); } });
                    $(document).on("click","#inject_lang",function() { that.debug.inject_lang(); });
                    $(document).on("click","#psdle_go, #gen_fake", function() {
                        that.config.deep_search = !$("#api_game").hasClass("toggled_off");
                        that.config.use_queue = !$("#api_queue").hasClass("toggled_off");
                        that.config.check_tv = ($("#api_pstv").length) ? !$("#api_pstv").hasClass("toggled_off") : false;
                        that.genDisplay("progress",($(this).attr("id") == "gen_fake")?true:false);
                    });
                    $(document).on("click","#ask_switches", function() {
                        var input = prompt("Enter advanced switches here, seperated by spaces:");
                        input = input.split(" ");

                        if ($.inArray("showexpired",input) > -1) repod.psdle.config.showExpired = true;
                        if ($.inArray("forcetv",input) > -1) repod.psdle.config.check_tv = true;

                        alert("Switches processed.");
                    });
                }
            }
            $("#muh_games_container").html(a).slideDown('slow',function() {
                if (mode == "progress") { if (fake_list) { that.debug.fake_list() } else { that.generateList(); } }
                else {
                    $("[id^=api_]").promise().done(function() {
                        $("[id^=api_]").tooltip({position: {my: "center top", at: "center bottom"}})
                    });
                }
            });
        });
    },
    generateList: function() {
        console.log("PSDLE | Generating download list.");

        this.gamelist = [];

        var that         = this,
            entitlements = gEntitlementManager.getAllEntitlements().concat(this.e_inject_cache);

        $.each(entitlements, function(index,obj) {
            if (that.isValidContent(obj)) { /* Determine if game content. */
                var temp = {};

                //Constants/pre-determined.
                temp.deep_type = "unknown";
                temp.pid       = obj.product_id;
                temp.id        = obj.id;
                if (!that.pid_cache[temp.pid]) { that.pid_cache[temp.pid] = 1; } else { that.pid_cache[temp.pid]++; }


                if (obj.entitlement_attributes) {
                    /* PS4 */
                    if (obj.game_meta) {
                        temp.name     = obj.game_meta.name;
                        temp.api_icon = obj.game_meta.icon_url;
                        //temp.id
                        //temp.icon = obj.game_meta.icon_url;
                    }
                    temp.size        = obj.entitlement_attributes[0].package_file_size;
                    temp.platform    = ["PS4"];
                } else if (obj.drm_def) {
                    /* PS3, PSP, or Vita */
                    temp.name        = (obj.drm_def.contentName) ? obj.drm_def.contentName : (obj.drm_def.drmContents[0].titleName) ? obj.drm_def.drmContents[0].titleName : "Unknown! - Submit a bug report!";
                    temp.api_icon    = obj.drm_def.image_url;
                    temp.size        = obj.drm_def.drmContents[0].contentSize;
                    temp.platform    = [];

                    temp.platform = that.determineSystem(obj.drm_def.drmContents[0].platformIds);
                }

                //Post-processing.

                var i = repod.psdle.config.iconSize;// + "px";
                i = "&w=" + i + "&h=" + i;

                temp.size_f         = (temp.size === 0) ? "N/A" : formatFileSizeDisplayStr(temp.size)
                temp.icon           = SonyChi_SessionManagerSingleton.buildBaseImageURLForProductId(temp.pid) + i;
                temp.api_icon       = temp.api_icon + i;
                temp.date           = obj.active_date;
                temp.pdate          = convertToNumericDateSlashes(convertStrToDateObj(temp.date));
                temp.url            = repod.psdle.config.game_page + temp.pid;
                temp.platform_og    = temp.platform.slice(0);

                //Get Plus status
                if (!obj.drm_def && !!obj.inactive_date)    { temp.plus = true; } //PS4, Vita, PSP
                if (obj.license && obj.license.expiration)  { temp.plus = true; } //PS3
                if (temp.plus)                              { repod.psdle.config.has_plus = true; }

                that.gamelist.push(temp);
            }
        });
        this.gamelist.sort(function(a,b) { return (a.date > b.date)?-1:(a.date < b.date)?1:0 });

        $.each(this.pid_cache, function(i,v) {
            if (v > 1) {
                that.game_api.queue("pid_cache",i)
            }
        });

        $.each(this.gamelist,function(a,b) {
            that.gamelist[a].index = a+1;

            if (that.config.deep_search) {
                that.game_api.queue(a+1,((that.pid_cache[b.pid] > 1)?b.id:b.pid));
            }
        });

        console.log("PSDLE | Finished generating download list.");
        this.postList();
    },
    determineSystem: function(HASH) {
        var sys = [];

        $.each({"1":KamajiPlatformFlags.PS3,"3": KamajiPlatformFlags.PSP,"8":KamajiPlatformFlags.VITA}, function (t,u) {
            0 !== (HASH >>> 1 & u >>> 1) && sys.push(KamajiPlatforms[Number(t)]);
        });

        return sys;
    },
    postList: function() {
        var safe = !0;

        if (repod.psdle.config.check_tv)    { safe = !1; repod.psdle.tv.init(); }
        if (repod.psdle.config.deep_search) { safe = !1; this.game_api.run(); this.game_api.run(); this.game_api.run(); this.game_api.run(); }
        if (safe)                           { this.table.gen(); }
    },
    isValidContent: function(obj) {
        var exp = (obj.license) ? obj.license.expiration : obj.inactive_date,
            inf = (obj.license) ? obj.license.infinite_duration : (this.config.showExpired) ? true : false;

        if (obj.VUData || (obj.drm_def && obj.drm_def.contentType == "TV")) { return 0; }
        else if (new Date(exp) < new Date() && !inf) { return 0; }
        else if (obj.drm_def || obj.entitlement_attributes) { return 1; }
        else { return 0; }
    },
    genSysCache: function() {
        var that = this;

        $.each(this.gamelist,function (i,v) {
            var name = that.safeGuessSystem(v.platform),
                key  = name.toLowerCase().replace("ps ","");

            that.sys_cache[key] = name;
        });
    },
    table: {
        bindSearch: function() {
            //Unbind for safety.
            $(document).off("click","#muh_table > tbody > tr, span[id^=system_], span[id^=filter_], span[id^=dl_], th[id^=sort_], #export_view, #export_csv").off("blur","#psdle_search_text");
            //Bind.
            $(document).keypress(function(e) { if (e.which == 13 && $("#psdle_search_text").is(":focus")) { repod.psdle.table.regen(true); } });
            $("span[id^=system_], span[id^=filter_]").off("click").on("click", function() { $(this).toggleClass("toggled_off"); repod.psdle.table.regen(true); });
            $("th[id^=sort_]").off("click").on("click", function() { repod.psdle.sortGamelist($(this)); });
            $("#export_view").off("click").on("click", function() { repod.psdle.exportList.configure(); });
            $("#psdle_search_text").off("blur").on("blur", function() { repod.psdle.table.regen(true); });
            $("#dl_queue").one("click", function() { repod.psdle.dlQueue.generate.display(); });
            $(document).off("click", "[id^=psdle_index_]").on("click", "[id^=psdle_index_]", function(e) { e.preventDefault(); repod.psdle.dlQueue.batch.add.ask(this); });
        },
        gen: function() {
            var that = this;

            repod.psdle.genSysCache();
            repod.psdle.config.lastsort = "";
            repod.psdle.config.lastsort_r = false;

            $("#muh_games_container").css({"position":"absolute"});
            $("#sub_container").html(repod.psdle.genSearchOptions()).append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+repod.psdle.lang.columns.platform+"</th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table><br />"+repod.psdle.config.tag_line);

            this.regen(true);
            this.bindSearch();

            console.log("PSDLE | Table generated.");

            $("#muh_games_container").slideDown('slow').promise().done(function() {
                that.margin();
            });
        },
        regen: function(a) {
            if (a == true) {
                repod.psdle.determineGames();
            } else {
                var that = this,
                    temp = "",
                    plus = 0;

                repod.psdle.exportList.delimited.destroy();
                repod.psdle.autocomplete.bind();

                $.each(repod.psdle.gamelist_cur,function (a,val) {
                    if (val.plus) {
                        plus++;
                    }
                    temp += repod.psdle.table_utils.gen.row(val);
                });
                temp += repod.psdle.table_utils.gen.totals();

                var psswitch = (repod.psdle.config.has_plus) ? " (<div id='slider' title='"+repod.psdle.lang.strings.plus+"'><div class='handle_container' style='text-align:"+repod.psdle.config.switch_align+"'><div class='handle' style='background-color:"+repod.psdle.config.switch_color+"'/></div></div> <div id='psdleplus' style='display:inline-block' /> "+plus+")" : "";

                $("#table_stats").html(repod.psdle.gamelist_cur.length+psswitch+" / "+repod.psdle.gamelist.length);
                if ($("#slider").length > 0) { $("#slider").tooltip().one("click",function() { that.plus_switch(); }); }
                if (chihiro.isMobile()) {
                    $("#psdleplus").html('<img class="psPlusIcon" src="mobile/img/furniture/psplusicon-small.a2ec8f23.png">');
                } else {
                    $("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"});
                }
                $("#muh_table > tbody").html(temp);

                this.icons.select();
            }
        },
        plus_switch: function() {
            var a, b;

            switch ($(".handle_container").css("text-align")) {
                case "left": default: a = "center"; b = "#85C107"; break;
                case "center": a = "right"; b = "#2185f4"; break;
                case "right": a = "left"; b = "#F6573A"; break;
            }
            repod.psdle.config.switch_align = a;
            repod.psdle.config.switch_color = b;
            $("#slider").tooltip();
            this.regen(true);
        },
        margin: function() {
            $("#muh_table").animate(
                {
                    "margin-top"    : $("#search_options").outerHeight() - $("#sub_container").css("padding-top").replace("px","")+"px"
                }
            );
        },
        icons: {
            select: function(type) {
                var that = this;

                $(document).off("scroll").on("scroll",function() {
                    that.smartScroll();
                });
                this.smartScroll();
            },
            validate: function(source) {
                var index = (typeof source == "number") ? source : source.split("_").pop(),
                    temp  = repod.psdle.gamelist[index];

                if (!temp.safe_icon) {
                    var that = this,
                        i = repod.psdle.config.iconSize,
                        url = SonyChi_SessionManagerSingleton.buildBaseImageURLForProductId(temp.id) + "&w=" + i + "&h=" + i;

                    $.get(url)
                    .success(function() { that.setIcon(index,url); return 1; })
                    .fail(function() {
                        url = url.replace(temp.id,temp.pid);
                        $.get(url)
                        .success(function() { that.setIcon(index,url); return 1; })
                        .fail(function() { that.setIcon(index,temp.api_icon); return 1; })
                    });
                }
            },
            setIcon: function(index,url) {
                $("#psdle_index_"+index+" .psdle_game_icon").attr("src",url);
                $.extend(repod.psdle.gamelist[index],{safe_icon: true, icon: url});
            },
            smartScroll: function() {
                var padding = 5,
                    low     = window.scrollY,
                    high    = low + window.innerHeight,
                    that    = this,
                    t       = $("[id^=psdle_index_]").filter(function(a) { var pos = $(this).offset().top; if (pos >= low && pos <= high) { return 1; } }).filter(":first, :last"),
                    first   = ($(t[0]).index() - padding <= 0) ? 0 : $(t[0]).index() - padding,
                    last    = $(t[1]).index() + padding;

                $("[id^=psdle_index_]").slice(first,last).not(".go_icon").each(function(a) { $(this).addClass("go_icon"); var b = this; setTimeout(function() { that.validate($(b).attr("id")); },a*50); });
            }
        }
    },
    determineGames: function() {
        this.exportList.delimited.destroy();
        this.gamelist_cur = [];
        this.autocomplete_cache = [];

        var that    = this,
            temp    = "",
            safesys = this.safeSystemCheck(),
            search  = (!!$("#psdle_search_text")) ? $("#psdle_search_text").val() : this.config.last_search;

        /* Determine filters. */
        var filters = {};

        $.each($("[id^=filter_]"), function() {
            var n = $(this).attr("id").split("_").splice(1).join("_");
            filters[n] = $(this).hasClass("toggled_off");
        });

        $("#psdle_search_text").removeClass("negate_regex");

        $.each(this.gamelist,function(index,val) {
            var sys = that.safeGuessSystem(val.platform),
                a   = true,
                t   = val.name;

            if ($.inArray(sys,safesys) > -1) {
                if (that.config.deep_search) {
                    if (filters[val.deep_type]) { a = false; }
                }
                if (a == true && search !== "") {
                    var regex = search.match(/^\/(.+?)\/([imgd]+)?$/i);

                    a = (!!regex && !!regex[2] && regex[2].toLowerCase().indexOf("d") >= 0) ? true : false;

                    if (a) {
                        $("#psdle_search_text").addClass("negate_regex"); regex[2] = regex[2].replace("d","");
                    }
                    if (!!regex) {
                        if (RegExp((regex[1])?regex[1]:search,(regex[2])?regex[2]:"").test(t)) { a = !a; }
                    }
                    else if (t.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                        a = !a;
                    }
                }

                switch (repod.psdle.config.switch_align) {
                    case "left": if (val.plus) { a = false } break;
                    case "right": if (!val.plus) { a = false; } break;
                }

                if (a == true) {
                    that.gamelist_cur.push(val);
                    that.autocomplete_cache.push({"label":t,"value":t});
                }
            }
        });
        that.config.last_search = search;
        this.sortGamelist("noreverse");
    },
    genSearchOptions: function(dlQueue) {
        //TO-DO: Not this. Make scalable.
        var that = this;

        //Search options.
        var temp = '<div id="search_options">';

        if (!dlQueue) { temp += '<span><span class="psdle_fancy_bar"><span id="export_view">'+this.lang.labels.export_view+'</span></span> '; }
        temp +=        '<span class="psdle_fancy_bar">';

        var order = ["ps1","ps2","ps3","ps4","psp","vita"],
            out = [];

        out[order.length +1] = "";
        $.each(this.sys_cache, function(i,v) {
            if ($.inArray(i,order) >= 0) {
                out[$.inArray(i,order)] = '<span id="system_'+i+'">'+v+'</span>';
            }
        });
        temp += out.join("")+'</span>';

        if (this.config.use_queue) {
            if (!dlQueue) {
                temp += ' <span class="psdle_fancy_but" id="dl_queue">'+this.lang.strings.dlQueue+'</span>';
            } else {
                temp += ' <span><span class="psdle_fancy_but" id="dl_list">'+this.lang.strings.dlList+'</span></span>';
            }
        }
        temp += "<br />";
        if (this.config.deep_search && !dlQueue) {
            temp +=    '<span class="psdle_fancy_bar">';
            var order = ["downloadable_game","demo","add_on","avatar","application","theme","unknown"], out = []; out[order.length +1] = "";
            $.each(this.type_cache, function(key) {
                var line = '<span id="filter_'+key+'">'+((that.lang.categories[key]) ? that.lang.categories[key] : key)+'</span>';
                if ($.inArray(key,order) >= 0) { out[$.inArray(key,order)] = line} else { out.push(line); }
            });
            temp += out.join("")+'</span><br />';
        }
        if (!dlQueue) { temp += "<input type='text' id='psdle_search_text' placeholder='"+this.lang.strings.search+"' />"; }
        temp += "<br />";
        temp += '<span id="table_stats"></span></div>';

        return temp;
    },
    sortGamelist: function(sort_method) {
        var that = this,
            rev  = true;

        if (sort_method == "noreverse") {
            rev = false; sort_method = (this.config.lastsort) ? this.config.lastsort : "sort_date"
        } else {
            sort_method = (sort_method) ? $(sort_method).attr("id") : (this.config.lastsort) ? this.config.lastsort : "sort_date";
        }
        switch (sort_method) {
            default:
            case "sort_date":
                this.gamelist_cur.sort(function (a, b) { return (a.date > b.date)?-1:(a.date < b.date)?1:0 });
                break;
            case "sort_name":
                this.gamelist_cur.sort(function (a, b) { return (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase())?1:(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase())?-1:0 });
                break;
            case "sort_size":
                this.gamelist_cur.sort(function (a, b) { return (a.size > b.size)?1:(a.size < b.size)?-1:0 });
                break;
        }
        if (rev == true) {
            if (sort_method == this.config.lastsort) {
                if (!this.config.lastsort_r) {
                    this.gamelist_cur.reverse();
                }
                this.config.lastsort_r = !this.config.lastsort_r;
            } else {
                this.config.lastsort_r = false;
            }
        } else {
            if (this.config.lastsort_r) { this.gamelist_cur.reverse(); }
        }
        $("#psdle_sort_display").remove();
        $("#"+sort_method).append("<span id='psdle_sort_display' class='psdle_sort_"+((this.config.lastsort_r)?"asc":"desc")+"' />");
        this.config.lastsort = sort_method;
        this.table.regen();
    },
    safeSystemCheck: function() {
        var temp = [];
        $("span[id^=system_]:not('.toggled_off')").each(function() { temp.push($(this).text()); });
        return temp;
    },
    safeGuessSystem: function(sys_in) {
        //Quick, dirty, and easy. Rewrite.
        var sys = (typeof(sys_in) == "object") ? sys_in.join(" ") : sys_in;

        sys = sys.replace(/[^\w\d ]/g,"");

        if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP" || sys == "PS Vita PSP" || sys.indexOf("PSP") > -1) { sys = "PSP"; }
        if (sys == "PS3 PS Vita" || sys.indexOf("PS Vita") > -1) { sys = "PS Vita"; }

        return sys;
    },
    injectCSS: function() {
        var temp =  /* Startup         */ "#muh_games_container { display:none;position:fixed;top:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { padding:20px;background-color:#fff; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#2185f4;width:0%;height:100%;border-radius:10px; } .psdle_btn { cursor:pointer;border-radius:13px;background-color:#2185f4;color:#fff;padding:1px 15px;display:inline-block;margin:5px auto; } .psdle_tiny_link { line-height:0px;cursor:pointer;color:#7F6D75 !important; font-size:x-small; } .psdle_tiny_link:hover { color:#000 !important; text-decoration:underline; } " +
                    /* Search options  */ "#search_options { position:fixed;left:0px;top:0px;width:100%;padding:15px 0px;background-color:rgba(255,255,255,0.8);z-index:9001; }" +
                    /* Table           */ "th[id^=sort] { cursor:pointer; } table {} th {padding:5px;background-color:#2185F4;color:#fff;} tr:hover { background-color:rgba(33,133,244,0.7) !important; } td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding:8px;} .is_plus{background-color:#FFD10D;} tr:nth-child(2n) {background-color:#EEE;}  th:nth-child(n+3):nth-child(-n+7), td:nth-child(n+3):nth-child(-n+7) {text-align:center;padding:0px 5px;position:relative;} td:first-child { text-align:center;position:relative; }" +
                    /* Search buttons  */ "#psdle_search_text { margin:5px auto;padding:5px 10px;font-size:large;max-width:600px;width:100%;border-style:solid;border-color:#F0F0F0;border-radius:90px; } .negate_regex { background-color:#FF8080;color:#fff; } span[id^=system_], span[id^=filter_], span#export_view, span[id^=dl_], .psdle_fancy_bar > span { font-weight:bold; text-transform:uppercase;font-size:small;color:#fff;background-color:#2185f4;display:inline-block;margin-right:2px;margin-bottom:5px;padding:1px 15px;cursor:pointer; } .psdle_fancy_but { border-radius:12px; } .psdle_fancy_bar > span:first-of-type { border-top-left-radius:12px; border-bottom-left-radius:12px; } .psdle_fancy_bar span:last-of-type { border-top-right-radius:12px; border-bottom-right-radius:12px; } .toggled_off { opacity:0.4; }" +
                    /* Content icons   */ ".psdle_game_icon { max-width:100%;vertical-align:middle;padding:3px;min-width:42px;min-height:42px; }" +
                    /* Sorting         */ ".psdle_sort_asc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom:5px solid #fff; } .psdle_sort_desc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #fff; }" +
                    /* Newbox          */ "#dlQueueAsk { width:400px;height:400px; } #dlQAN { cursor:move;background-color:rgba(33,133,244,0.8);padding:7px 15px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis; } #dlQASys { position:absolute;bottom:0px;padding:7px 0px;color:#FFF;display:table;width:100%;table-layout:fixed; } #dlQASys > div { display:table-cell; } #dlQASys > div > div { cursor:pointer;background-color:rgba(33,133,244,0.8);border-radius:10px;padding:2px;margin:0px 10px; } #dlQAStat { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-left-radius:20px;padding:0px 10px 0px 15px;font-size:small;float:right; } #dlQARating { color:#fff;background-color:rgba(33,133,244,0.8);border-bottom-right-radius:20px;padding:0px 15px 0px 10px;font-size:small;float:left; } " +
                    /* Newbox Extended */ "#dlQueueExt { overflow: hidden; position: absolute; left: 10px; right: 10px; bottom: 40px; font-size: 0.8em; background-color: rgba(33, 133, 244, 0.8); padding: 10px; border-radius: 9px; top: 66px; text-align: left; }" +
                    /* Overlays        */ ".cover { z-index:9001;position:fixed;top:0px;left:0px;width:100%;height:100%;display:table;background-color:rgba(0,0,0,0.25);background-size:cover;background-position:center; } .cover > div { display:table-cell;vertical-align:middle;height:inherit;text-align:center; } .cover > div > div { box-shadow: 0px 0px 30px #000;display:inline-block;#background-color:#FFF;border-radius:20px;overflow:hidden;position:relative;background-size:cover; }" +
                    /* Export          */ "#export_select { padding:10px;width:250px;background-color:#fff;color:#000; }"+
                    /* PS+ switch      */ "#slider { vertical-align: bottom;display:inline-block;cursor:pointer;border-radius:100%;width:30px;height:12px;border-radius:10px;border:2px solid #F0F0F0; } .handle_container { text-align:center;width:100%;height:100%; } .handle { width:10px;height:10px;border-radius:100%;margin:0px 2px 6px;border:1px solid #FFF;display:inline-block;background-color:#85C107; }" +
                    /* Tooltips        */ ".tooltip-inner { background-color:#2185F4 !important; border: 5px solid #2185F4 !important; } .tooltip-arrow { border-top-color:#2185F4 !important; } .tooltip.in { opacity:1 !important; }" +
                    /* Tooltips 2      */ ".ui-tooltip { background-color:#2185F4; max-width: 234px; z-index: 9002; background-color: #2185F4; font-size: 11px; text-align: center; line-height: 1.4em; padding: 12px; border-radius: 4px; }" +
                    /* Autocomplete    */ ".ui-autocomplete { z-index: 9002; max-width:590px; max-height:200px; overflow-y:auto; overflow-x:hidden; } .ui-menu { position:fixed; border:2px solid #F0F0F0; border-top: none; background-color:#fff; } .ui-menu > .ui-menu-item * { color:#000; text-decoration:none; white-space: nowrap; text-overflow: ellipsis; cursor:pointer; } .ui-menu > .ui-menu-item:nth-child(even) { background-color:#e6e6e6; } .ui-menu-item .ui-state-focus { display:inline-block; width:100%; color:#000; background-color: rgba(33, 133, 244, 0.7); }" +
                    /* PS TV           */ ".psdletv { font-style: italic;font-weight: bold;font-size: 0.6em;vertical-align: text-top;position: absolute;top: 4px; }" +
                    /* PSP2            */ ".psp3 { border-left: 2px solid #2185F4; border-right: 2px solid #2185F4; } .psp2 { background-color:rgba(33,133,244,0.15) !important; }";
        $("head").append("<style type='text/css' id='psdle_css'>"+temp+"</style>");
    },
    exportList: {
        config: { name: true, platform: true, can_vita: true, size: true, date: true, plus: false },
        tl: {},
        configure: function() {
            var that = this,
                temp = {
                    name: repod.psdle.lang.columns.name,
                    platform: repod.psdle.lang.columns.platform,
                    can_vita: "Vita?",
                    size: repod.psdle.lang.columns.size,
                    date: repod.psdle.lang.columns.date,
                    plus: "PS+",
                }

            if (repod.psdle.config.check_tv) { this.config.tv = false; temp.tv = "PS TV"; }

            this.tl = temp;

            /* Gen input    */
            var w = "<div id='export_select'><div style='text-align:left'>";
            $.each(this.config, function(key,val) { var c = (val)?' checked':''; w += "<input type='checkbox'"+c+" value='"+key+"'> "+that.tl[key]+"<br />" });
            w += "</div>";

            /* Gen output    */
            w += '<br /><span class="psdle_fancy_bar"><span id="sel_export_view">'+repod.psdle.lang.labels.export_view+'</span><span id="sel_export_csv">CSV</span>'

            //Generate window.
            $("<div />",{id:"export_configure",class:"cover"}).append($("<div />").append(w)).appendTo("body");

            //Bind
            $("#sel_export_view").off("click").on("click", function () { that.saveConfig(); that.delimited.handle(); $("#export_configure").remove(); });
            $("#sel_export_csv").off("click").on("click", function () { that.saveConfig(); that.csv.handle(); $("#export_configure").remove(); });
            $("#export_configure").off("click").one("click", function() { $(this).remove(); repod.psdle.newbox.bind("off"); });
            $("#export_select").off("click").on("click", function(event) { event.stopPropagation(); });
        },
        saveConfig: function() {
            var that = this;
            $("#export_select input[type=checkbox]").each(function() { that.config[$(this).attr("value")] = $(this).prop("checked"); });
        },
        json: function() { return (!!JSON.stringify) ? JSON.stringify(repod.psdle.gamelist_cur) : repod.psdle.lang.strings.stringify_error; },
        delimited: {
            gen: function(sep) {
                var sep = (sep) ? sep : "\t",
                    t   = repod.psdle.exportList.formatRow(sep);

                $(repod.psdle.gamelist_cur).each(function(i) { t += repod.psdle.exportList.formatRow(sep,i); });
                t += repod.psdle.exportList.formatRow(sep,-1);
                return t;
            },
            handle: function() {
                this.destroy();
                var w = 600;
                $("#search_options").append("<span id='sotextarea' style='display:none'><br /><textarea></textarea></span>");
                $("#sotextarea > textarea").css({"width":w,"max-width":w}).text(this.gen(prompt(repod.psdle.lang.strings.delimiter,"\t"))).select().parent().delay(500).slideDown();
                repod.psdle.table.margin();
            },
            destroy: function () { $("#sotextarea").remove(); repod.psdle.table.margin(); }
        },
        csv: {
            gen: function(sep) {
                var that = this,
                    sep  = (sep) ? sep : ",",
                    csv  = repod.psdle.exportList.formatRow(sep);

                $.each(repod.psdle.gamelist_cur,function(i) {
                    csv += repod.psdle.exportList.formatRow(sep,i);
                });

                csv += repod.psdle.exportList.formatRow(sep,-1);

                return csv;
            },
            handle: function() {
                var that = this;

                $("<a>",{
                  "download" : "psdle_"+(new Date().toISOString())+".csv",
                  "href" : "data:text/csv;charset=utf-8,"+encodeURIComponent(this.gen())
                })[0].dispatchEvent(new MouseEvent("click"));
            }
        },
        formatRow: function(sep,index) {
            //Use this.config{} and this.tl{}.
            var that = this,
                out  = "",
                sep  = (sep) ? sep : ",";

            if (index >= 0) {
                var b = repod.psdle.gamelist_cur[index];

                $.each(this.config, function(key,val) {
                    if (val) {
                        switch (key) {
                            case "name": out += (b.name.indexOf(","))?"\""+b.name+"\"":b.name; break;
                            case "platform": out += repod.psdle.safeGuessSystem(b.platform); break;
                            case "size": out += b.size_f; break;
                            case "date": out += b.pdate; break;
                            case "plus": out += (b.plus) ? repod.psdle.lang.strings.yes : ""; break;
                            case "can_vita": out += ($.inArray("PS Vita",b.platform_og) > -1) ? repod.psdle.lang.strings.yes : ""; break;
                            case "tv": out += (repod.psdle.config.check_tv && repod.psdle.id_cache[b.pid].tvcompat && repod.psdle.safeGuessSystem(b.platform) == "PS Vita")?"Yes":""; break;
                        }
                        out += sep;
                    }
                });

                out += "\n";
            } else if (index == -1) {
                //To-do: Reimplement totals based on selected columns.
                //out = sep+sep+$("#psdle_totals").children().eq(3).text()+sep+"\n";
            } else {
                $.each(this.config, function(key,val) {
                    if (val) { out += that.tl[key]+sep; }
                });

                out += "\n";
            }

            return out;
        }
    },
    game_api: {
        batch: [],
        queue: function(index,pid) {
            var that = this,
                a    = {pid:pid,index:index};

            /* Do some queue/delay magic here. */
            if (index == "pid_cache") {
                this.batch.push(a)
            } else {
                this.batch.unshift(a);
            }
        },
        run: function() {
            var that = this;

            if (this.batch.length > 0) {
                var a = this.batch.pop();
                $.getJSON(repod.psdle.config.game_api+a.pid)
                .success(function(data) {
                    that.process(a.index,data);
                })
                .fail(function() {
                    if (a.index !== "pid_cache") {
                        if (repod.psdle.gamelist[a.index]) {
                            var pid = repod.psdle.gamelist[a.index].pid;
                            if (repod.psdle.pid_cache[pid] && pid !== a.pid) {
                                var temp = $.extend({}, repod.psdle.pid_cache[pid]);
                                $.extend(temp, repod.psdle.gamelist[a.index]);
                                repod.psdle.gamelist[a.index] = temp;
                            } else {
                                repod.psdle.type_cache.unknown = true;
                            }
                            repod.psdle.type_cache.unknown = true;
                        }
                    }

                    that.run();
                });
            } else {
                repod.psdle.table.gen();
            }
        },
        process: function(index,data) {
            var parse = this.parse(data),
                l     = Math.abs(repod.psdle.gamelist.length - this.batch.length), r = repod.psdle.gamelist.length,
                w     = $('#psdle_bar').width(), pW = $('#psdle_bar').parent().width(), p = Math.round(100*w/pW), q = Math.round(100*l/r);

            if (q > p) { $("#psdle_progressbar > #psdle_bar").stop().animate({"width":q+"%"}); }
            $("#psdle_status").text(l+" / "+r);

            repod.psdle.type_cache[parse.deep_type] = true;

            if (index == "pid_cache") {
                repod.psdle.pid_cache[data.id] = parse;
            }
            else {
                index--; $.extend(repod.psdle.gamelist[index],parse);
            }

            this.run();
        },
        parse: function(data) {
            var extend = {},
                type   = "unknown",
                sys,
                r      = /^(PS(?:1|2)).+Classic$/i;

            if (data.default_sku && data.default_sku.entitlements.length == 1) {
                if (data.metadata) {
                    if (data.metadata.secondary_classification && !!data.metadata.secondary_classification.values[0].match(r)) {
                        sys = data.metadata.secondary_classification.values[0].match(r).pop();
                    }
                    //else if (!!data.metadata.game_subtype.values[0].match(r)) { sys = data.metadata.game_subtype.values[0].match(r).pop(); }
                    else if (data.metadata.primary_classification && !!data.metadata.primary_classification.values[0].match(r)) {
                        sys = data.metadata.primary_classification.values[0].match(r).pop();
                    }
                    else if (!!data.metadata.playable_platform) {
                        sys = [];

                        $.each(data.metadata.playable_platform.values,function(i,val) {
                            sys.push(val.replace(/[^\w\d ]/g,""))
                        });
                    }
                }

                if (sys) {
                    extend.platform = sys;
                }
            }

            if (data.top_category == "tumbler_index") {
                //We must go deeper.
                if (data.metadata.secondary_classification && data.metadata.secondary_classification.values[0] == "ADD-ON") { type = "add_on"; }
            } else {
                type = (data.top_category) ? data.top_category : "unknown";
            }

            extend.deep_type = type;

            if (data.star_rating && data.star_rating.score) { extend.rating = data.star_rating.score }
            if (data.promomedia && data.promomedia[0]) {
                extend.images = [], extend.videos = [];
                $.each(data.promomedia[0].materials, function(i,v) {
                    if (v.urls && v.urls[0]) {
                        var a = v.urls[0].url;

                        if (/\.(png|jpg)$/ig.test(a)) { extend.images.push(a); }
                        else if (/\.mp4$/ig.test(a.split("?")[0])) { extend.videos.push(a); }
                    }
                });
            }
            if (data.metadata) { extend.metadata = data.metadata; }
            if (data.long_desc) { extend.long_desc = data.long_desc; }

            return extend;
        }
    },
    dlQueue: {
        batch: {
            cache: {},
            get: function(prev_sys) {
                if (!prev_sys) { this.cache = {"ps3":[], "ps4":[], "vita":[]} }

                var that = this,
                    base_url = repod.psdle.config.dlQueue.status+"/?status=notstarted&status=stopped&status=waitfordownload&platformString=$$1&size=100",
                    consoles = [];

                for (var i in repod.psdle.config.active_consoles) {
                    consoles.push(i)
                }

                var index = $.inArray(prev_sys,consoles) + 1,
                    n = consoles[index];

                if (n) {
                    $.getJSON(base_url.replace("$$1",n))
                    .fail(function() {
                        console.error("PSDLE | DL Queue parse error for \""+n+"\". Is it activated on the account?");
                    })
                    .success(function(data) {
                        that.cache[n] = data.data.notifications;
                    })
                    .complete(function() {
                        that.get(n);
                    });
                } else {
                    repod.psdle.dlQueue.generate.table();
                }
            },
            send: function(sys,id,cancel,completeCb,errorCb) {
                var dat = {"platformString":sys,"contentId":id},
                    base_url = (cancel) ? repod.psdle.config.dlQueue.status : repod.psdle.config.dlQueue.base;

                if (cancel) {
                    dat.status = "usercancelled";
                }

                $.ajax({
                    type:'POST', url: base_url,
                    contentType: 'application/json; charset=utf-8', dataType: 'json',
                    data: JSON.stringify([dat]),
                    complete: completeCb,
                    error: function(d) {
                        var m = "PSDLE | Download Queue | Error\n"+d.responseJSON.header.status_code+" - "+d.responseJSON.header.message_key+" ("+sys+" / "+id+")";
                        alert(m); console.error(m); errorCb(d);
                    }
                });
            },
            add: {
                parse: function(index,sys) {
                    var that = this,
                        game = repod.psdle.gamelist[index];

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
                    repod.psdle.newbox.open(e);
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
                $(document).off("click","[id^=psdle_index_]").on("click","[id^=psdle_index_]", function(e) { e.preventDefault(); repod.psdle.dlQueue.batch.remove.parse(this); });
            },
            table: function() {
                var temp = "";

                $("#muh_table").remove();
                $("#sub_container").append("<table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th>"+repod.psdle.lang.columns.platform+"</th><th> > </th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table>");

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
        random: function() {
            var r = repod.psdle.gamelist_cur[Math.floor((Math.random() * repod.psdle.gamelist_cur.length))].index - 1;

            repod.psdle.newbox.open(r);
        },
        gen: {
            row: function(val,dlQueue) {
                var u = repod.psdle.config.game_page+val.id,
                    pg = (chihiro.isMobile()) ? 50 : 24,
                    icon = (val.safe_icon) ? val.icon : "",
                    is_plus = (val.plus) ? "is_plus" : "",
                    sys = repod.psdle.safeGuessSystem(val.platform),
                    //style='background-image:url(\""+bg+"\")' bg = (val.images && val.images.length > 0) ? val.images[0] : "",
                    iS = repod.psdle.config.iconSize+"px",
                    temp = "<tr id='psdle_index_"+(val.index -1)+"'><td style='max-width:"+iS+";max-height:"+iS+";'><a target='_blank' href='"+val.url+"'><img title='"+repod.psdle.lang.labels.page+" #"+Math.ceil(val.index/pg)+"' src='"+icon+"' class='psdle_game_icon "+is_plus+"' /></a>"+"</td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+val.name+"</a></td>";

                var can_vita = (sys == "PS Vita") ? false : ($.inArray("PS Vita",val.platform_og) > -1) ? true : false;
                can_vita = (can_vita) ? "class='psp2'" : "";

                if (dlQueue) {
                    temp += "<td>"+sys+"</td><td>"+dlQueue.to_sys.toUpperCase().replace("VITA","PS Vita")+"</td><td>"+val.size_f+"</td><td>"+convertToNumericDateSlashes(convertStrToDateObj(dlQueue.createdTime))+"</td>"
                } else {
                    temp += "<td "+can_vita+">"+sys+((repod.psdle.config.check_tv && repod.psdle.id_cache[val.pid].tvcompat && sys == "PS Vita")?"<span class='psdletv'>TV</span>":"")+"</td><td>"+val.size_f+"</td><td>"+val.pdate+"</td>";
                }
                temp += "</tr>";

                return temp;
            },
            totals: function() {
                var a = 0;

                $.each(repod.psdle.gamelist_cur, function(b,c) {
                    a += c.size;
                });

                return "<tr id='psdle_totals'><td /><td /><td /><td>"+formatFileSizeDisplayStr(a)+"</td><td /></tr>";
            }
        }
    },
    newbox: {
        generate: function(e) {
            var plus = "",
                i    = (isNaN(e)) ? Number($(e).attr("id").split("_").pop()) : Number(e),
                game = repod.psdle.gamelist[i],
                id   = (game.index -1),
                icon = (game.safe_icon) ? game.icon : game.api_icon;
                dialog = $("<div>", {
                            id:'dlQueueAsk',
                            style:'background-image:url("'+icon.replace(/(w|h)=\d+/g,"$1=400")+'");'
                         });

            try { if (game.plus) { plus = $("#psdleplus").clone()[0].outerHTML+" "; } } catch(e) {}
            dialog.append($("<div>", {id:'dlQAN'} ).append(plus+game.name));

            if (repod.psdle.config.use_queue) {
                var temp = $.grep(game.platform_og.slice(0), function(V) { return V !== "PSP" }), /* Make sure we don't have PSP */
                    t    = $("<div>", {id:"dlQASys"} );

                if (temp.length > 1) {
                    t.append($("<div>").append($("<div>", {id:"dla_all_"+id,text:repod.psdle.lang.strings.queue_all} )));

                    $.each(temp,function(a,b) {
                        var c = b.replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
                        t.append($("<div>").append($("<div>", {id:"dla_"+c+"_"+id,class:d,text:b} )))
                    });
                } else {
                    var c = temp[0].slice(0).replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
                    t.html($("<div>").append($("<div>",{id:"dla_"+c+"_"+id,class:d,text:repod.psdle.lang.strings.queue_to.replace("$SYS$",game.platform_og[0].slice(0))})))
                }
                dialog.append(t);
            }

            try { if (game.rating) { var star = $("<div>", {class:"star-rating rater-0 ratingStarGeneric star-rating-applied star-rating-readonly star-rating-on",style:"display:inline-block !important;float:none !important;vertical-align:text-top"} ).append($("<a>",{text:""}))[0].outerHTML; dialog.append($("<div>", {id:"dlQARating"} ).append(star+" "+game.rating+" / 5")); } } catch (e) { }

            dialog.append($("<div>", {id:"dlQAStat",text:repod.psdle.safeGuessSystem(game.platform)+" | "+game.size_f+" | "+game.pdate} ));

            dialog = $("<div>", {id:"dlQueue_newbox",class:"cover"} ).append($("<div>").append(dialog[0].outerHTML));

            if (game.images && game.images.length > 0) { $(dialog).css("background-image","url('"+game.images[Math.floor(Math.random() * game.images.length)]+"')"); }
            //else if (!chihiro.isMobile() && game.videos && game.videos.length > 0) {$(dialog).prepend('<div style="z-index:-1;position:absolute;top:0px;left:0px;right:0px;bottom:0px;"><video style="min-width:100%;min-height:100%;" autoplay loop muted><source src="'+game.videos[0]+'" type="video/mp4"></video></div>'); }

            return dialog[0].outerHTML;
        },
        bind: function(e) {
            var that = this;

            switch (e) {
                case "on":
                default:
                    $("#dlQueueAsk").draggable({handle:"#dlQAN",containment:"parent"});

                    $("#dlQueue_newbox").one("click", function() {
                        that.close();
                    });

                    $("#dlQueueAsk").on("click", function(event) {
                        event.stopPropagation();
                    });

                    $("div[id^=dla_]:not('.toggled_off')").on("click", function() {
                        repod.psdle.dlQueue.batch.add.parse($(this).attr("id").split("_")[2],$(this).attr("id").split("_")[1]);
                    });
                    break;

                case "off":
                    $("div[id^=dla_]").off("click");
                    $("#dlQueueAsk").off("click");
                    break;
            }
        },
        open: function(e) {
            repod.psdle.table.icons.validate($(e).attr("id"));

            if ($("#dlQueue_newbox").length) this.close();

            $("body").append(this.generate(e)).promise().done(function() { repod.psdle.newbox.bind(); });
        },
        close: function() {
            $("#dlQueue_newbox").remove();
            this.bind("off");
        }
    },
    autocomplete: {
        bind: function() {
            if ($(".ui-autocomplete-input").length) {
                $("#psdle_search_text").autocomplete("close");

                $("#psdle_search_text").autocomplete("option",
                    {
                        source    : repod.psdle.autocomplete_cache
                    }
                );
            } else {
                $("#psdle_search_text").autocomplete({
                    source        : repod.psdle.autocomplete_cache,
                    position    :
                    {
                        my        : "center top",
                        at        : "center bottom"
                    },
                    messages    :
                    {
                        noResults: '',
                        results: function() {}
                    },
                    select        : function(e,u) {
                        repod.psdle.config.last_search = u.item.value;
                        repod.psdle.table.regen(true);
                    }
                })
            }
        }
    },
    tv: {
        url_cache: [],
        init: function() {
            $.each(repod.psdle.gamelist, function(index,val) {
                repod.psdle.id_cache[val.pid] = {"tvcompat": false};
            });

            this.fetchList();
        },
        fetchList: function() {
            var that = this;

            $.getJSON(repod.psdle.config.tv_url,function(a) {
                $.each(a.links,function(c,b) {
                    that.url_cache.push(b.url + "?size=30&start=0");

                    if (c == a.links.length) {
                        that.run();
                    }
                });
            });
        },
        run: function() {
            var that = this,
                url  = this.url_cache.pop();

            if (url) {
                $.getJSON(url)
                .success(function(a) {
                    that.parse(url,a);
                })
                .fail(function() {
                    that.run();
                });
            } else {
                if (!repod.psdle.config.deep_search) { repod.psdle.table.gen(); }
            }
        },
        parse: function(url,a) {
            var next = url.replace(/start=\d+/,"start="+(Number(url.match(/start=(\d+)/).pop()) + Number(url.match(/size=(\d+)/).pop())));

            if (a.total_results && a.start + a.size < a.total_results) {
                this.url_cache.push(next);
            }

            $.each(a.links, function(index,val) {
                if (repod.psdle.id_cache[val.id]) {
                    repod.psdle.id_cache[val.id].tvcompat = true;
                }
            });

            this.run();
        }
    },
    debug: {
        die: function() {
            /* Obviously.    */ $("#muh_games_container").remove();
            /* CSS            */ $("#psdle_css").remove();
            /* Just 'psdle'    */ delete repod.psdle; // Kappa
        },
        inject_lang: function() {
            var lang = prompt("Insert JSON formatted language: (current below)",JSON.stringify(repod.psdle.lang));

            try {
                lang = JSON.parse(lang);
                repod.psdle.lang = {};
                repod.psdle.lang = repod.psdle.lang_cache.en.us;
                $.extend(true,repod.psdle.lang,lang);
                repod.psdle.genDisplay();
            } catch (e) {
                alert(e);
            }
        },
        fake_list: function() {
            //Generate a fake download list based on currently viewable items.
            //Dates are generated randomly.
            //Best used on a page showing only game content.
            if ($(".cellGridGameStandard").length > 0) {
                $.each($(".cellGridGameStandard"), function(index) {
                    var temp = {};

                    temp.deep_type = "unknown";
                    temp.pid = $(this).find(".permalink").attr("href").split("cid=").pop();
                    temp.id = temp.pid;
                    temp.index = repod.psdle.gamelist.length + 1;
                    temp.name = $(this).find(".cellTitle").text();
                    temp.platform = [ $(this).find(".pforms").text().split("|").pop() ];

                    /* Random values */
                    temp.size = Math.floor(Math.random() * 19999994000); //Size, in bytes.
                    temp.plus = (Math.random() < 0.5);
                    if (temp.plus) { repod.psdle.config.has_plus = true; } //PS+
                    min = new Date(); min.setDate(min.getDate() - 365*4); min = min.getTime(); temp.date = new Date(min + Math.random() * (Date.now() - min)).toISOString(); //Date

                    temp.icon = SonyChi_SessionManagerSingleton.buildBaseImageURLForProductId(temp.pid)+"&w=42&h=42";

                    temp.size_f = formatFileSizeDisplayStr(temp.size);
                    temp.url = repod.psdle.config.game_page+temp.pid
                    temp.platform_og = temp.platform.slice(0);
                    temp.pdate = convertToNumericDateSlashes(convertStrToDateObj(temp.date));

                    repod.psdle.gamelist.push(temp);
                    if (repod.psdle.config.deep_search) { repod.psdle.game_api.queue(temp.index,temp.pid); }
                });
                repod.psdle.postList();
            } else {
                alert("Not on a valid page.");
            }
        },
        checkParse: function(pid) {
            pid = (pid) ? pid : prompt("Enter (product) ID:");

            $.getJSON(repod.psdle.config.game_api+pid)
            .success(function(data) {
                console.log(repod.psdle.game_api.parse(data));
            })
            .fail(function(data) {
                console.log(data);
            });
        },
        difference: function(regen) {
            repod.psdle.gamelist_cur = $.grep(repod.psdle.gamelist,function(x) {return $.inArray(x, repod.psdle.gamelist_cur) < 0});
            if (regen) {
                repod.psdle.table.regen();
            }
        },
        entitlement: function(input,type) {
            //Probably want to have this store results in an array and return that instead, eventually.

            input = (input) ? input : prompt("Search for:");
            input = input.toLowerCase();
            type = (type) ? type : "name";

            $.each(gEntitlementManager.getAllEntitlements(),function(index,obj) {
                if (repod.psdle.isValidContent(obj)) {
                    var match = false;

                    switch (type) {
                        case "id":
                            match = !!~obj.id.toLowerCase().indexOf(input);
                            break;
                        case "name":
                        default:
                            var name = (obj.drm_def) ? obj.drm_def.contentName : obj.game_meta.name;
                            match = !!~name.toLowerCase().indexOf(input);
                            break;
                    }

                    if (match) {
                        var platform,
                            pids = 0;

                        if (obj.game_meta) {
                            platform = ["PS4"]
                        } else {
                            pids = obj.drm_def.drmContents[0].platformIds;
                            platform = repod.psdle.determineSystem(pids);
                        }

                        //Remove personal information (such as dates) and extraneous URLs.
                        var safe = JSON.stringify(obj, function(k,v) { if(/[\d\-]+T.+Z$/.test(v) || /^http/.test(v)) { return "~" } return v; });
                        console.log(index,platform,pids,safe)
                    }
                }
            });
        },
        findBad: function() {
            //Optimize eventually.
            var bad = [];

            $.each(repod.psdle.gamelist, function(index,obj) {
                if (!obj.pid || obj.pid.length == 0
                    || !obj.id || obj.id.length == 0
                    || !obj.name || obj.name.length == 0
                    || !obj.size || obj.size.length == 0
                    || !obj.platform || obj.platform.length == 0
                    || !obj.platform_og || obj.platform_og.length == 0
                    || !obj.date) {
                        bad.push(index);
                    }
            });

            return bad;
        },
        makeBad: function() {
            //Totally safe.

            $.each(repod.psdle.gamelist, function(i,o) {
                var num = Math.ceil(Math.random() * 10),
                    victim = ["pid", "id", "name", "platform", "platform_og", "date", "size", "", "", ""];

                delete o[victim[num]];
            });
        },
        injectEntitlement: function(ENTITLEMENT) {
            //ENTITLEMENT should be valid Entitlement data or an array containing multiple.
            //This should be called before generating the list as it is appended to the end of the original Entitlements list.

            ENTITLEMENT = ENTITLEMENT || prompt("Enter valid Entitlement data:");

            if (typeof ENTITLEMENT == "object") {
                $.each(ENTITLEMENT, function(index,value) {
                    repod.psdle.e_inject_cache.push(value);
                });
            } else {
                repod.psdle.e_inject_cache.push(JSON.parse(ENTITLEMENT));
            }

            //if (ENTITLEMENT !== null && typeof ENTITLEMENT !== "array") { this.injectEntitlement(); }

            return repod.psdle.e_inject_cache.length;
        }
    },
    grid: {
        generate: {
            cell: function(index) {
                var item = repod.psdle.gamelist[index],
                    out  = $("<div>",{class:"cell"})

                .append($("<img>",{class:"cell_icon",src:item.icon.replace(/(w|h)=\d+/g,"$1=124")}))
                .append($("<div>",{class:"title psdle_blue",text:item.name}))
                .append($("<div>",{class:"top"}).append(
                    $("<div>",{class:"psdle_blue",text:repod.psdle.safeGuessSystem(item.platform)+" | "+item.size_f})
                ))
                .append($("<div>",{class:"date psdle_blue",text:item.pdate}))

                return out[0].outerHTML;
            }
        }
    }
};

var a = setInterval(function(a){ if (chihiro.appReady === true) { clearInterval(repod.psdle.config.timerID); repod.psdle.init(); } },500);
repod.psdle.config = {"timerID":a};
console.log("PSDLE | Ready.");
