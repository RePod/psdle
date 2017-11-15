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
    prop_cache         : [],
    lang_cache         : {{{include "lang/lang.min.json"}}},
    determineLanguage: function(e,f) {
        e = (e) ? e.split("-") : this.config.language.split("-");
        if (f === true) { this.lang = {}; this.lang = $.extend(true,{},this.lang_cache.en.us); }
        if (e[0] in this.lang_cache) {
            if (e.slice(-1) in this.lang_cache[e[0]]) {
                if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][e.slice(-1)]); this.sanitizeLanguage(); }
                e = e[0]+"-"+e.slice(-1);
            } else {
                if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][this.lang_cache[e[0]].def]); this.sanitizeLanguage(); }
                e = e[0]+"-"+this.lang_cache[e[0]].def;
            }
        } else {
            e = "en-us";
        }

        if (!!this.lang.rtl && this.lang.rtl == true) {
            $("#muh_games_container").addClass("rtl");
        } else {
            $("#muh_games_container").removeClass("rtl");
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
            match = window.location.pathname.match(/^\/([a-z\-]+)\//i),
            l = (match !== null && match.length > 1 ? match.pop() : "en-us").toLowerCase(),
            l2 = l.split("-"),
            valkAPI = (typeof window.valkyrie == "object");

        this.config = {
            valkyrie        : valkAPI,
            valkyrieInstance: require("valkyrie-storefront/app").default.create().__container__
        }

        //valkAPI && alert("PSDLE detected the new Valkyrie store API.\nSupport for this is currently experimental!\nAny issues should be reported here, along with region:\nhttps://github.com/RePod/psdle/issues/40")

        this.config = $.extend(this.config,{
            logoBase64      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAfCAYAAAEO89r4AAABaUlEQVRoge2XS27CQAyGPSVSUVErdqzpMqveiRvALnu67Gl6D+gFuAKIPgQrs0o1TJSJJ7aJBvnbRXE8f357XoCIGyTiEBFf33+BwgMpyg/eVRNSsENEpAQWMa27agL1e7JWcmCSVSG+tF6jp1D4o/qkqN8un+Bl7JpJUxP5vH38XT2T655CtEf6olKoaFLq3ElK2heRlgq//U/KKVj4rcrvs+Y+h7Z1ow2Vv9eg6A5p53MxhnI2an0vWSmW0HI2EhUTI5vSN4T2Xem0ycZRh4h7AJgOLaQLlf1ega2br3/IQlMW6TA2dYEPc2XToyZUGtbOdMs1lyX0lqeubEpvQqVp9GhsghxPOpvY8yPA1yo+MRtCh7iWfJ/j49rOpEE2QnM55h1U7/Wcox0nb+y9lqY6dzYtmgtmqDBmqDBmqDCDGcq5Ew5xCqViHSqMGSqMGSqMGSpMp6H3unloYR0qjBkqjBkqjBkqzAUtBKxj5lT3GAAAAABJRU5ErkJggg==",
            game_page       : window.location.origin + "/" +(valkAPI ? l+"/product/" : "#!/" + l + "/cid="),
            game_api        : "https://store.playstation.com/store/api/chihiro/00_09_000/container/"+l2.slice(-1)+"/"+l2[0]+"/999/",
            lastsort        : "",
            lastsort_r      : false,
            language        : l,
            deep_search     : false,
            deep_waiting    : 0,
            deep_current    : 0,
            last_search     : "",
            dlQueue         :
            {
                base: "/kamaji/api/chihiro/00_09_000/user/notification/download",
                ps4: "/kamaji/api/chihiro/00_09_000/gateway/store/v1/users/me/notification/download",
                status: "/kamaji/api/chihiro/00_09_000/user/notification/download/status",
                status2: "/kamaji/api/chihiro/00_09_000/gateway/store/v1/users/me/notification/download/status"
            },
            use_queue       : false,
            active_consoles : {},
            tag_line        : "<br><a class='psdle_tiny_link' href='//repod.github.io/psdle#support' target='_blank'>Support PSDLE</a> - <a class='psdle_tiny_link' href='//repod.github.io/psdle' target='_blank'>Website</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle' target='_blank'>Repository</a> - <a class='psdle_tiny_link' href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation' target='_blank'>Submit Bug/Translation</a>",
            switch_align    : "center",
            switch_color    : "#85C107",
            has_plus        : false,
            check_tv        : false,
            tv_url          : {
                "en-us": atob("L2NoaWhpcm8tYXBpL3ZpZXdmaW5kZXIvVVMvZW4vMTkvU1RPUkUtTVNGNzcwMDgtUFNUVlZJVEFHQU1FUz9zaXplPTMwJnN0YXJ0PTA=")
            },
            iconSize        : 42,
            mobile          : false
        });

        console.log("PSDLE | Config set.");

        try {
            if (GM_info) {
                this.config.tag_line += " - <span class='psdle_tiny_link'>Userscript: "+GM_info.script.version+"</span>";
            }
        }
        catch (e) { };

        if (this.config.tv_url[this.config.language]) {
            this.config.tv_url = this.config.tv_url[this.config.language];
        }

        this.determineLanguage(this.config.language,true);
        this.injectCSS();

        //to-do re-implement this
        if (!this.config.valkyrie) { SonyChi_SessionManagerSingleton.getUserDevices() }

        this.genStartup();
        //this.genDisplay("progress",false);
    },
    genStartup: function() {
        if ($("#psdle_start").length == 0) {
            var that = this;

            if (window.psdleSkip && window.psdleSkip == true) {
                that.genDisplay();
            } else {
                var startup = $("<div/>",{id:"psdle_start"}).css({'background-image':'url('+repod.psdle.config.logoBase64+')'});
                //startup.append("<div style='position:absolute;line-height:11px;text-shadow:-1px -1px #000,1px -1px #000,-1px 1px #000,1px 1px #000;bottom:39px;width:180px;font-size:11px'>Please leave a review<br>for the Chrome extension!<br>It's very much appreciated.</div>");
                startup.appendTo("body");

                $(document).one("click","#psdle_start",function() {
                    $(this).remove();
                    that.genDisplay();
                });
            }
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
            $("body").append($("<div />",{id:"muh_games_container",class:(this.config.valkyrie?"valkyrie":"")}));
        }

        $("#muh_games_container").slideUp("slow", function() {
            var a = "<div id='sub_container'><a href='//repod.github.io/psdle/' target='_blank'><img src='"+repod.psdle.config.logoBase64+"' style='display:inline-block;font-size:200%;font-weight:bold' alt='psdle' /></a></span>";

            if (mode == "progress") {
                that.config.active_consoles = {vita: 1, ps3: 1, ps4: 1}; //to-do: re-implement
                a += "<br><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br><span id='psdle_status'>"+that.lang.startup.wait+"</span>";
            } else {
                a += "<br><br>"+that.lang.startup.apis+"<br><br><span class='psdle_fancy_bar'>";
                $.each(that.lang.apis, function(key,con) {
                    if (con.internalID == "api_pstv" && that.config.language !== "en-us") { return 0; }
                    var off = (con.internalID == "api_game" || con.disabled) ? "toggled_off" : "";
                    a += "<span id='"+con.internalID+"' title='"+con.desc.replace(/'/g, "&apos;")+"' class='"+off+"'>"+con.name.replace(/'/g, "&apos;")+"</span>";
                });
                a += "</span><br><br><span id='psdle_go' class='psdle_btn'>"+that.lang.startup.start+"</span><br>"+that.generateLangBox()+"<br><span id='psdle_night' class='psdle_tiny_link'>Night Mode</span>"+that.config.tag_line;
                a += "<br><span id='inject_lang' class='psdle_tiny_link'>Inject Language</span> - <a class='psdle_tiny_link' target='_blank' href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation#translation-submission-template'>Language Template</a> - <span id='gen_fake' class='psdle_tiny_link'>Generate Fake List</span>";
                a +="</div>";
                if (mode !== "nobind") {
                    $(document).on("click","#psdle_night",function() { that.darkCSS(); });
                    $(document).on("click","[id^=api_]",function() { if ($(this).attr("id") !== "api_entitle") { $(this).toggleClass("toggled_off"); } });
                    $(document).on("click","#inject_lang",function() { that.debug.inject_lang(); });
                    $(document).on("click","#psdle_go, #gen_fake", function() {
                        that.config.deep_search = !$("#api_game").hasClass("toggled_off");
                        that.config.use_queue = !$("#api_queue").hasClass("toggled_off");
                        that.config.check_tv = ($("#api_pstv").length) ? !$("#api_pstv").hasClass("toggled_off") : false;
                        that.genDisplay("progress",($(this).attr("id") == "gen_fake")?true:false);
                    });
                }
            }
            $("#muh_games_container").html(a).slideDown("slow",function() {
                if (mode == "progress") { if (fake_list) { that.debug.fake_list() } else { that.generateList(); } }
                else {
                    $("[id^=api_]").promise().done(function() {
                        if (!that.config.valkyrie) $("[id^=api_]").tooltip({position: {my: "center top", at: "center bottom"}})
                    });
                }
            });
        });
    },
    generateList: function() {
        console.log("PSDLE | Generating download list.");

        this.gamelist = [];
        var that         = this;
            entitlements = [],
            i18n = this.config.valkyrieInstance.lookup('service:i18n');

        entitlements = JSON.parse(localStorage["entitlements_0_"+(this.config.valkyrieInstance.lookup('service:kamaji/session').sessionModel.accountId)+"_e1-np"]).concat(this.e_inject_cache);

        $.each(entitlements, function(index,obj) {
            if (that.isValidContent(obj)) { //Determine if game content.
                var temp = {};

                //Constants/pre-determined.
                if (that.config.deep_search) { temp.category = "unknown"; }
                temp.productID = obj.product_id;
                temp.id        = obj.id;
                if (!that.pid_cache[temp.productID]) { that.pid_cache[temp.productID] = 1; } else { that.pid_cache[temp.productID]++; }

                if (obj.entitlement_attributes) {
                    //PS4
                    if (obj.game_meta) {
                        temp.name     = obj.game_meta.name;
                        temp.api_icon = obj.game_meta.icon_url;
                    }
                    temp.size        = obj.entitlement_attributes[0].package_file_size;
                    temp.platform    = ["PS4"];
                    temp.pkg         = obj.entitlement_attributes[0].reference_package_url
                } else if (obj.drm_def) {
                    //PS3, PSP, or Vita
                    temp.name        = (obj.drm_def.contentName) ? obj.drm_def.contentName : (obj.drm_def.drmContents[0].titleName) ? obj.drm_def.drmContents[0].titleName : "Unknown! - Submit a bug report!";
                    temp.api_icon    = obj.drm_def.image_url;
                    temp.size        = obj.drm_def.drmContents[0].contentSize;
                    temp.platform    = [];
                    temp.baseGame    = obj.drm_def.drmContents[0].titleName; //Apparently PS4 entitlements don't have this.
                    temp.publisher   = obj.drm_def.drmContents[0].spName; //Or this.
                    temp.pkg         = obj.drm_def.drmContents[0].contentUrl

                    temp.platform = that.determineSystem(obj.drm_def.drmContents[0].platformIds);
                }

                //Post-processing.
                temp.icons          = [
                    that.config.game_api+temp.id+"/image",
                    that.config.game_api+temp.productID+"/image",
                    temp.api_icon
                ];

                temp.date           = obj.active_date;
                var tempDate = new Date(temp.date);
                    toPrettyDate = {mm:tempDate.getMonth()+1, dd:tempDate.getDate(), yyyy:tempDate.getFullYear()}
                temp.prettyDate     = i18n.t("c.format.numericDateSlashes",toPrettyDate).string

                var tempSize        = require("valkyrie-storefront/utils/download").default.getFormattedFileSize(temp.size);
                temp.prettySize     = (temp.size === 0) ? "N/A" : i18n.t("c.page.details.drmDetails."+tempSize.unit,{val: tempSize.value}).string;
                temp.url            = repod.psdle.config.game_page + temp.productID;
                temp.platformUsable = temp.platform.slice(0);

                //Get Plus status
                if (!obj.drm_def && !!obj.inactive_date)    { temp.plus = true; } //PS4, Vita, PSP
                if (obj.license && obj.license.expiration)  { temp.plus = true; } //PS3
                if (temp.plus)                              { that.config.has_plus = true; }

                that.gamelist.push(temp);
            }
        });
        this.gamelist.sort(function(a,b) { return (a.date > b.date)?-1:(a.date < b.date)?1:0 });

        $.each(this.pid_cache, function (i,v) {
            if (v > 1) {
                //that.game_api.queue("pid_cache",i)
            } else {
                delete that.pid_cache[i]
            }
        })

        $.each(this.gamelist,function(a,b) {
            that.gamelist[a].index = a+1;

            if (that.config.deep_search) {
                that.game_api.queue(a+1,((that.pid_cache[b.productID] > 1)?b.id:b.productID));
            }
        });

        console.log("PSDLE | Finished generating download list.");
        this.postList();
    },
    determineSystem: function(HASH) {
        var that = this,
            sys = [],
            K = require("valkyrie-storefront/utils/const").default.KamajiPlatformFlags,
            K2 = require("valkyrie-storefront/utils/const").default.KamajiPlatforms,
            _K = K

        $.each(_K, function (t,u) {
            var target = K2[t];
            0 !== ((t == "1") ? (HASH >>> 1 & u >>> 1) : (HASH & u)) && sys.push(target);
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
            inf = (obj.license) ? obj.license.infinite_duration : false;

        if (!this.config.includeVideo && (obj.VUData || (obj.drm_def && obj.drm_def.contentType == "TV"))) { return 0; }
        else if (!this.config.includeExpired && new Date(exp) < new Date() && !inf) { return 0; }
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
    genPropCache: function() {
        //Cache the properties to prop_cache to use for exporting. Move later.
        //Also potentially just continuously extend a cache object then iterate over that.
        var that = this,
            bad = ["metadata"]; //Stuff we don't handle yet or want being exported.

        this.prop_cache = [];

        $.each(this.gamelist, function(i,c) {
            $.each(c, function(key) {
                if ($.inArray(key,bad) == -1 && $.inArray(key,that.prop_cache) == -1) {
                    that.prop_cache.push(key);
                }
            });
        });
        //Custom properties (since they're not actually stored in an entry), sloppy.
        this.prop_cache.push("vitaCompat");
        if (this.config.check_tv) { this.prop_cache.push("vitatvCompat"); }

        this.prop_cache.sort();
    },
    table: {
        bindSearch: function() {
            //Unbind for safety.
            $(document).off("click","#muh_table > tbody > tr, span[id^=system_], span[id^=filter_], span[id^=dl_], th[id^=sort_], #export_view, #export_csv").off("blur","#psdle_search_text");
            //Bind.
            $(document).keypress(function(e) { if (e.which == 13 && $("#psdle_search_text").is(":focus")) { repod.psdle.table.regen(true); } });
            $("#psdle_search_select").off("change").change(function() { repod.psdle.table.regen(true); });
            $("span[id^=system_], span[id^=filter_]").off("click").on("click", function() { $(this).toggleClass("toggled_off"); repod.psdle.table.regen(true); });
            $("th[id^=sort_]").off("click").on("click", function() { repod.psdle.sortGamelist($(this)); });
            $("#export_view").off("click").on("click", function() { repod.psdle.exportList.configure(); });
            $("#psdle_search_text").off("blur").on("blur", function() { repod.psdle.table.regen(true); });
            $("#dl_queue").one("click", function() { repod.psdle.dlQueue.generate.display(); });
            $(document).off("click", "[id^=psdle_index_]").on("click", "[id^=psdle_index_]", function(e) {
                e.preventDefault();
                if (e.shiftKey) {
                    repod.psdle.dlQueue.batch.add.auto(this);
                } else {
                    repod.psdle.dlQueue.batch.add.ask(this);
                }
            });
        },
        gen: function() {
            var that = this;

            repod.psdle.genSysCache();
            repod.psdle.genPropCache();
            repod.psdle.config.lastsort = "";
            repod.psdle.config.lastsort_r = false;

            $("#muh_games_container").css({"position":"absolute"});
            $("#sub_container").html(repod.psdle.genSearchOptions()).append("<table id='muh_table'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+repod.psdle.lang.columns.platform+"</th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table><br>"+repod.psdle.config.tag_line);

            this.regen(true);
            this.bindSearch();

            console.log("PSDLE | Table generated.");

            $("#muh_games_container").slideDown("slow").promise().done(function() {
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
                if (!repod.psdle.config.valkyrie) { repod.psdle.autocomplete.bind(); }

                $.each(repod.psdle.gamelist_cur,function (a,val) {
                    if (val.plus) {
                        plus++;
                    }
                    temp += repod.psdle.table_utils.gen.row(val);
                });
                temp += repod.psdle.table_utils.gen.totals();

                var psswitch = (repod.psdle.config.has_plus) ? " (<div id='slider' title='"+repod.psdle.lang.strings.plus+"'><div class='handle_container' style='text-align:"+repod.psdle.config.switch_align+"'><div class='handle' style='background-color:"+repod.psdle.config.switch_color+"'/></div></div> <div id='psdleplus' style='display:inline-block' /> "+plus+")" : "";

                $("#table_stats").html(repod.psdle.gamelist_cur.length+psswitch+" / "+repod.psdle.gamelist.length);
                if (!repod.psdle.config.valkyrie && $("#slider").length > 0) { $("#slider").tooltip().one("click",function() { that.plus_switch(); }); }
                if (!repod.psdle.config.valkyrie) {
                    if (repod.psdle.config.mobile) {
                        $("#psdleplus").html("<img class='psPlusIcon' src='mobile/img/furniture/psplusicon-small.a2ec8f23.png'>");
                    } else {
                        $("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"});
                    }
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
            if (!repod.psdle.config.valkyrie) { $("#slider").tooltip(); }
            this.regen(true);
        },
        margin: function() {
            $("#muh_table").animate({"margin-top": $("#search_options").outerHeight() - $("#sub_container").css("padding-top").replace("px","")+"px"});
            this.icons.smartScroll();
        },
        icons: {
            select: function(type) {
                var that = this;

                $(document).off("scroll").on("scroll",function() {
                    that.smartScroll();
                });
                this.smartScroll();
            },
            toSize: function(url,size) {
                size = (size || repod.psdle.config.iconSize || 42);
                var suf = /\?w=\d+&h=\d+$/.test(url) ? "" : "?w=" + size + "&h=" + size
                return url + suf;
            },
            validate: function(index) {
                var that = this,
                    index = Number(index),
                    temp  = repod.psdle.gamelist[index];

                if (!temp.safe_icon) {
                    var i = repod.psdle.config.iconSize,
                        u = temp.icons.shift(),
                        url = this.toSize(u);

                    if (u == undefined) {
                        temp.safe_icon = true;
                        temp.icon = temp.api_icon;
                        that.setIcon(index);
                        return 0;
                    }

                    $.get(url)
                    .success(function() {
                        $.extend(repod.psdle.gamelist[index],{safe_icon: true, icon: u});
                        that.setIcon(index);
                    })
                    .fail(function(e) {
                        that.validate(index);
                    });
                } else {
                    that.setIcon(index);
                }
            },
            setIcon: function(index) {
                $("#psdle_index_"+index+" .psdle_game_icon").attr("src",this.toSize(repod.psdle.gamelist[index].icon));
            },
            smartScroll: function() {
                var padding = 5,
                    low     = window.scrollY,
                    high    = low + window.innerHeight,
                    that    = this,
                    t       = $("[id^=psdle_index_]").filter(function(a) { var pos = $(this).offset().top; if (pos >= low && pos <= high) { return 1; } }).filter(":first, :last"),
                    first   = ($(t[0]).index() - padding <= 0) ? 0 : $(t[0]).index() - padding,
                    last    = $(t[1]).index() + padding;

                $("[id^=psdle_index_]").slice(first,last).not(".go_icon").each(function(a) {
                    $(this).addClass("go_icon");
                    var b = this;
                    setTimeout(function() {
                        that.validate($(b).attr("id").split("_").pop());
                    }, a*50);
                });
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
            search  = (!!$("#psdle_search_text")) ? $("#psdle_search_text").val() : this.config.last_search,
            cache   = [];

        //Determine filters.
        var filters = {};

        $.each($("[id^=filter_]"), function() {
            var n = $(this).attr("id").split("_").splice(1).join("_");
            filters[n] = $(this).hasClass("toggled_off");
        });

        $("#psdle_search_text").removeClass("negate_regex");

        $.each(this.gamelist,function(index,val) {
            var sys = that.safeGuessSystem(val.platform),
                a   = true,
                t   = "";

            switch ($("#psdle_search_select").val()) {
                default:
                case "name":
                    t = val.name;
                    break;
                case "id":
                    t = val.id;
                    break;
                case "pid":
                    t = val.productID;
                    break;
                case "date":
                    t = val.date;
                    break;
                case "publisher":
                    t = val.publisher;
                    break;
                //Catalog results
                case "desc":
                    if (!!val.description) {
                        t = val.description;
                    } else { a = false; }
                    break;
                case "genre":
                    if (val.metadata && val.metadata.genre) {
                        t = val.metadata.genre.values.join(",");
                    } else { a = false; }
                    break;
                case "base":
                    if (val.baseGame) {
                        t = val.baseGame;
                    } else { a = false; }
                    break;
            }

            if ($.inArray(sys,safesys) > -1) {
                if (that.config.deep_search) {
                    if (filters[val.category]) { a = false; }
                }
                if (a == true && search !== "") {
                    var regex = search.match(/^\/(.+?)\/([imgdp]+)?$/i);

                    a = (!!regex && !!regex[2] && regex[2].toLowerCase().indexOf("d") >= 0) ? true : false;

                    if (a) {
                        $("#psdle_search_text").addClass("negate_regex"); regex[2] = regex[2].replace("d","");
                    }
                    if (!!regex) {
                        if (RegExp((regex[1])?regex[1]:search,(regex[2])?regex[2]:"").test(t)) { a = !a; }
                    }
                    else if (t && t.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                        a = !a;
                    }
                }

                switch (repod.psdle.config.switch_align) {
                    case "left": if (val.plus) { a = false } break;
                    case "right": if (!val.plus) { a = false; } break;
                }

                if (a == true) {
                    that.gamelist_cur.push(val);

                    //Prevent duplicates from filling the autocomplete.
                    if ($.inArray(t,cache) == -1) {
                        cache.push(t);
                        that.autocomplete_cache.push({"label":t,"value":t});
                    }
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
        var temp = "<div id='search_options'>";

        if (!dlQueue) { temp += "<span><span class='psdle_fancy_bar'><span id='export_view'>"+this.lang.labels.exportView+"</span></span> "; }
        temp +=        "<span class='psdle_fancy_bar'>";

        var order = ["ps1","ps2","ps3","ps4","psp","vita"],
            out = [];

        out[order.length +1] = "";
        $.each(this.sys_cache, function(i,v) {
            if ($.inArray(i,order) >= 0) {
                out[$.inArray(i,order)] = "<span id='system_"+i+"'>"+v+"</span>";
            }
        });
        temp += out.join("")+"</span>";

        if (this.config.use_queue) {
            if (!dlQueue) {
                temp += " <span class='psdle_fancy_but' id='dl_queue'>"+this.lang.strings.dlQueue+"</span>";
            } else {
                temp += " <span><span class='psdle_fancy_but' id='dl_list'>"+this.lang.strings.dlList+"</span></span>";
            }
        }
        temp += "<br>";
        if (this.config.deep_search && !dlQueue) {
            temp +=    "<span class='psdle_fancy_bar'>";
            var order = ["downloadable_game","demo","add_on","avatar","application","theme","unknown"], out = []; out[order.length +1] = "";
            $.each(this.type_cache, function(key) {
                var line = "<span id='filter_"+key+"'>"+((that.lang.categories[key]) ? that.lang.categories[key] : key)+"</span>";
                if ($.inArray(key,order) >= 0) { out[$.inArray(key,order)] = line} else { out.push(line); }
            });
            temp += out.join("")+"</span><br>";
        }
        if (!dlQueue) {
            //I did this HTML generation the lazy way.
            var select = "<select id='psdle_search_select'><option value='name'>"+repod.psdle.lang.columns.name+"</option><option value='base'>Base Game</option><option value='publisher'>Publisher</option><option value='id'>Item ID</option><option value='pid'>Product ID</option>"; //<option value="date">'+repod.psdle.lang.columns.date+'</option>'
            if (this.config.deep_search) { //Future Catalog searching.
                select += "<option value='genre'>Genre</option>"; //item.metadata.genre.values
                //select += '<option value="desc">Description</option>'; //item.description
            }
            select += "</select>";
            temp += "<div>"+select+"<input type='text' id='psdle_search_text' placeholder='"+this.lang.strings.search+"' /></div>";
        }
        //temp += "<br>";
        temp += "<span id='table_stats'></span></div>";

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
        else if (sys == "PS3 PS Vita" || sys.indexOf("PS Vita") > -1) { sys = "PS Vita"; }
        else if (sys == "PS3" || sys.indexOf("PS3") > -1) { sys = "PS3"; } //The exception nobody expected, for games that return "PS3 PS4"
        else if (sys == "PS4" || sys.indexOf("PS4") > -1) { sys = "PS4"; } //What could this possibly break?

        return sys;
    },
    injectCSS: function() {
        var temp = "{{{include "css/psdle.min.css"}}}"
        $("head").append("<style type='text/css'>"+temp+"</style>");
    },
    darkCSS: function() {
        $("#muh_games_container").toggleClass("psdledark");
    },
    exportList: {
        config: [], //Default export template.
        configure: function() {
            //TO-DO: window max-height: 80%;
            if (this.config.length == 0) { //If export template is empty, set translated defaults.
                this.config = [
                    {name: repod.psdle.lang.columns.name, target: "name"},
                    {name: repod.psdle.lang.columns.platform, target: "platform"},
                    {name: repod.psdle.lang.columns.size, target: "prettySize"},
                    {name: repod.psdle.lang.columns.date, target: "prettyDate"}
                ];
            }

            var that = this;

            //Gen input
            var w = "<div id='export_select'><div>" + this.genTable() + "</div>";

            //Gen output
            w += "<br><span class='psdle_fancy_bar'><span id='export_row_del'>-</span><span id='export_row_add'>+</span></span><br><span class='psdle_fancy_bar'><span id='sel_export_view'>"+repod.psdle.lang.labels.exportView+"</span><span id='sel_export_json'>JSON</span><span id='sel_export_csv'>CSV</span>"

            //Generate window.
            $("<div />",{id:"export_configure",class:"cover"}).append($("<div />").append(w)).appendTo("#muh_games_container");

            //Bind
            $("#export_row_add").off("click").on("click", function(event) { $("#export_table tbody").append(that.genRow()); }); //Add row.
            $("#export_row_del").off("click").on("click", function(event) { $("#export_table tr:gt(1)").last().remove(); }); //Remove row.
            $("#sel_export_view").off("click").on("click", function () { that.saveConfig(); that.delimited.handle(); $("#export_configure").remove(); });
            $("#sel_export_csv").off("click").on("click", function () { that.saveConfig(); that.csv.handle(); $("#export_configure").remove(); });
            $("#sel_export_json").off("click").on("click", function () { that.saveConfig(); that.json.handle(); $("#export_configure").remove(); });
            $("#export_configure").off("click").one("click", function() { $(this).remove(); repod.psdle.newbox.bind("off"); });
            $("#export_select").off("click").on("click", function(event) { event.stopPropagation(); });
        },
        genTable: function() {
            var table = "",
                select = this.genSelect(),
                max = (this.config.length || 5);

            table += "<table id='export_table'><tr><th>"+repod.psdle.lang.strings.exportColumnName+"</th><th>"+repod.psdle.lang.strings.exportProperty+"</th></tr>";
            for (i=0; i<max; i++) {
                var text = (this.config[i]) ? this.config[i].name : "",
                    select2 = select.clone();

                if (this.config[i]) {
                    select2.find("[value="+this.config[i].target+"]").attr("selected","selected");
                }

                select2 = select2[0].outerHTML;
                table += this.genRow(text,select2);
            }
            table += "</table>";

            return table;
        },
        genRow: function(text,select) {
            text = (text) ? text : "";
            select = (select) ? select : this.genSelect()[0].outerHTML;
            return "<tr><td><input placeholder='...?' value='"+text+"'></td><td>"+select+"</td></tr>";
        },
        genSelect: function() {
            var select = $("<select />");

            $.each(repod.psdle.prop_cache, function(i, name) {
                select.append($("<option />", {text: name, value: name}));
            });

            return select;
        },
        saveConfig: function() {
            var config = $("#export_select").find("table tr:gt(0)"),
                columns = [];

            config.each(function() {
                columns.push({
                    name: $(this).find("input").val(),
                    target: $(this).find("select option:selected").val(),
                });
            });

            this.config = columns;
        },
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
                $("#search_options").append("<span id='sotextarea' style='display:none'><br><textarea></textarea></span>");
                $("#sotextarea > textarea").css({"width":w,"max-width":w}).text(this.gen(prompt(repod.psdle.lang.strings.delimiter,"\t"))).select().parent().delay(500).slideDown();
                repod.psdle.table.margin();
            },
            destroy: function () { $("#sotextarea").remove(); repod.psdle.table.margin(); }
        },
        //json: function() { return (!!JSON.stringify) ? JSON.stringify(repod.psdle.gamelist_cur) : "Browser does not have JSON.stringify()!"; },
        json: {
            gen: function() {
                var tempjson = {"columns":{},"items":[]};
                var config = repod.psdle.exportList.config;

                $.each(config, function(key,val) {
                    tempjson.columns[val.target] = val.name
                });

                $.each(repod.psdle.gamelist_cur, function(i) {
                    var tempprop = {}, item = repod.psdle.gamelist_cur[i];

                    $.each(config, function(key,val) {
                        tempprop[val.target] = repod.psdle.exportList.format(i,val.target,"JSONExp")
                    });

                    tempjson.items.push(tempprop);
                });

                return tempjson;
            },
            handle: function() {
                $("<a>",{
                  "download" : "psdle_"+(new Date().toLocaleString().replace(/[:\/]/g,"-"))+".json",
                  "href" : "data:text/csv;charset=utf-8,"+encodeURIComponent(JSON.stringify(this.gen()))
                })[0].dispatchEvent(new MouseEvent("click"));
            }
        },
        csv: {
            gen: function(sep) {
                var sep  = (sep) ? sep : ",",
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
                  "download" : "psdle_"+(new Date().toLocaleString().replace(/[:\/]/g,"-"))+".csv",
                  "href" : "data:text/csv;charset=utf-8,"+encodeURIComponent(this.gen())
                })[0].dispatchEvent(new MouseEvent("click"));
            }
        },
        format: function(index,target,sep) {
            var item = repod.psdle.gamelist_cur[index],
                toJSON = (sep == "JSONExp"),
                yes = (toJSON) ? true : repod.psdle.lang.strings.yes,
                no = (toJSON) ? false : repod.psdle.lang.strings.no;

            switch (target) {
                //Exceptions.
                case "category": return (repod.psdle.lang.categories[item.category] || item.category); break;
                case "platform": return repod.psdle.safeGuessSystem(item.platform); break;
                case "vitaCompat": return ($.inArray("PS Vita",item.platformUsable) > -1) ? yes : no; break;
                case "vitatvCompat": return (repod.psdle.config.check_tv && repod.psdle.id_cache[item.productID].tvcompat && repod.psdle.safeGuessSystem(item.platform) == "PS Vita") ? yes : no; break;
                default: //Generics
                    var temp = item[target];
                    if (!temp) break;
                    if (typeof temp == "boolean") { temp = (temp) ? yes : no }
                    if (typeof temp == "object") { temp = (toJSON) ? temp : JSON.stringify(temp).replace(/"/g,"'"); }
                    if (typeof temp == "string") { temp = temp.replace(/([\r\n]+?)/gm," "); }
                    return (typeof temp == "string" && temp.indexOf(sep) > -1) ? "\""+temp+"\"" : temp;
                    break;
            }

            return (toJSON) ? undefined : "";
        },
        formatRow: function(sep,index) {
            //Use this.config{} and this.tl{}.
            var that = this,
                out  = "",
                sep  = (sep) ? sep : ",";

            if (index >= 0) {
                var b = repod.psdle.gamelist_cur[index],
                    yes = repod.psdle.lang.strings.yes,
                    no = repod.psdle.lang.strings.no;

                $.each(this.config, function(key,val) {
                    if (val) {
                        out += that.format(index,val.target,sep) + sep;
                    }
                });

                out += "\n";
            } else if (index == -1) {
                //Footer.
                //To-do: Reimplement totals based on selected columns.
                $.each(this.config, function(index,val) { out += val.target+sep; }); //Align to columns.
                out += "\""+JSON.stringify(this.config).replace(/"/g,"'")+"\""; //JSON in extra column.
            } else {
                //Generally the first row, but more so a catch-all that spits out column names.
                $.each(this.config, function(index,val) {
                    out += val.name+sep;
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

            //Do some queue/delay magic here.
            if (index == "pid_cache") {
                this.batch.push(a)
            } else {
                this.batch.unshift(a);
            }
        },
        ran: false,
        run: function() {
            var that = this,
                catalog = repod.psdle.config.valkyrieInstance.lookup('service:susuwatari');

            if (this.batch.length == 0) {
                if (!this.ran) {
                    this.ran = true;
                    repod.psdle.table.gen();
                }
                return 0;
            }

            this.batch.splice(0,1).forEach(function(i, e) {
                catalog.resolve(i.pid)
                .then(function (data) {
                    if (data.response && data.response.status == 404) return 0;

                    var parse = that.parse(data),
                        cached = repod.psdle.pid_cache.hasOwnProperty(data.id)
                    repod.psdle.type_cache[parse.category] = true;

                    if (cached) {
                        repod.psdle.pid_cache[data.id] = parse;
                    }

                    //BAD WITH PROMISES 101, this is probably a huge performance hit
                    var target = repod.psdle.gamelist.find(function (i) { return i.id == data.id });

                    if (target.hasOwnProperty("index")) {
                        $.extend(repod.psdle.gamelist[target.index-1], parse);
                    }
                })
                .catch(function(e){ repod.psdle.type_cache["unknown"] = true; })
                .then(function() { that.updateBar(); that.run() });
            });
        },
        updateBar: function() {
            var that  = this,
                l     = Math.abs(repod.psdle.gamelist.length - this.batch.length), r = repod.psdle.gamelist.length,
                w     = $('#psdle_bar').width(), pW = $('#psdle_bar').parent().width(), p = Math.round(100*w/pW), q = Math.round(100*l/r);

            if (q > p) { $("#psdle_progressbar > #psdle_bar").stop().animate({"width":q+"%"}); }
            $("#psdle_status").text(l+" / "+r).click(that.run());
        },
        parse: function(data) {
            var extend = {},
                regexClassic = /^(PS\d+)_\w+\+?$/i;

            $.each([data.secondaryClassification, data.primaryClassification], function (i,v) {
                if (regexClassic.test(v)) {
                    extend.platform = repod.psdle.safeGuessSystem(v.match(regexClassic).pop());
                    return false;
                }
            });

            if (data.mediaList) {
                extend.images = [];
                extend.videos = [];

                var regexImg = new RegExp('\\.(png|jpg)$','i'),
                    regexVid = new RegExp('\\.mp4$','i'),
                    media = []
                    .concat(data.mediaList.screenshots)
                    .concat(data.mediaList.promo.images)
                    .concat(data.mediaList.promo.videos);

                $.each(media, function(i,v) {
                    if (regexImg.test(v.url)) { extend.images.push(v.url); }
                    else if (regexVid.test(v.url.split("?")[0])) { extend.videos.push(v.url); }
                });

            }

            extend.baseGame = (data.name || undefined)
            extend.category = (data.topCategory || "unknown");
            extend.description = (data.longDescription || undefined)
            extend.displayPrice = ((data.mbSkus && data.mbSkus[0] && data.mbSkus[0].display_price) || undefined)
            //extend.metadata = (data.metadata || undefined)
            extend.publisher = (data.providerName || undefined)
            extend.rating = ((data.starRating && data.starRating.score) || undefined)
            extend.releaseDate = (data.releaseDate || undefined) //TO-DO: prettify?
            //if (data.age_limit && data.content_rating) { extend.ageLimit = data.content_rating.rating_system + " " + data.age_limit; }

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
            send: function(index,sys) {
                var that = this,
                    Kamaji = repod.psdle.config.valkyrieInstance.lookup('service:kamaji/downloads'),
                    KPlatforms = require("valkyrie-storefront/utils/const").default.KamajiPlatforms,
                    id = repod.psdle.gamelist[index].id;
                
                this.recordQueue.push({"sys":sys, "id":id})
                
                switch (sys) {
                    case 'ps4':
                        Kamaji.startPS4Download(id)
                        break;
                    case 'ps3':
                    case 'vita':
                    case 'psvita':
                        sys = ((sys == "vita") ? "psvita" : sys).toUpperCase();
                        Kamaji.startDRMDownload(KPlatforms[sys], id).then(function(a) {
                            that.recordProcess()
                        })
                        break;
                    default:
                        break;
                }
            },
            recordQueue: [],
            recordProcess: function() {
                //TO-DO: Lookup download record, close but not quite Valkyrie accurate (bogus promise?)
                var Kamaji = repod.psdle.config.valkyrieInstance.lookup('service:kamaji/downloads'),
                    record = this.recordQueue.splice(0,1)[0];

                if (Kamaji.waitingDownloads[(record.sys+"Downloads")].find(function (a) { return a == record.id }) !== undefined) {
                    this.good($("[id^=dla_"+record.sys+"]"));
                } else {
                    this.bad($("[id^=dla_"+record.sys+"]"));
                }
            },
            good: function(target) { $(target).addClass('success'); },
            bad: function(target) { $(target).addClass('failure'); },
            add: {
                ask: function(e) {
                    //Ask which system to queue for. (cannot validate outside of this.go() response, if we care)
                    //See notes for determining active consoles, probably the way to go.
                    repod.psdle.newbox.open($(e).attr("id").split("_").pop());
                },
                auto: function(e) {
                    var index = (isNaN(e)) ? Number($(e).attr("id").split("_").pop()) : Number(e), //Target index to read from.
                        active = repod.psdle.config.active_consoles,
                        item = repod.psdle.gamelist[index];

                    //Determine target queue based on assumed intent and priority. For instance: PSP/Vita to Vita. If no Vita, to PS3. Otherwise give up.
                    var sys = item.platformUsable;
                    if ($.inArray("PS Vita", sys) >= 0) { sys = (active.vita) ? "vita" : (active.ps3) ? "ps3" : false; }
                    else if ($.inArray("PS3", sys) >= 0 || $.inArray("PSP", sys) >= 0) { sys = (active.ps3) ? "ps3" : false; }
                    else if ($.inArray("PS4", sys) >= 0) { sys = (active.ps4) ? "ps4" : false; }

                    if (sys == false) {
                        alert(repod.psdle.lang.strings.noTarget);
                    } else {
                        if ($(e).data("queued")) {
                            $(e).removeData("queued").animate({"background-color":""});
                            repod.psdle.dlQueue.batch.remove.go(sys,item.id,true);
                        } else {
                            $(e).data("queued", true);
                            this.parse(index,sys,e);
                        }
                    }
                }
            },
            remove: {
                parse: function(e) {
                    this.go($(e).children("td:eq(3)").text().replace("PS ","").toLowerCase(),repod.psdle.gamelist[Number($(e).attr("id").split("_").pop())].id);
                },
                go: function(sys,id,auto) {
                    //Remove game from batch.
                    repod.psdle.dlQueue.batch.send(sys,id,true,(auto)?undefined:repod.psdle.dlQueue.batch.get())
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
            return r;
        },
        gen: {
            row: function(val,dlQueue) {
                var u = repod.psdle.config.game_page+val.id,
                    pg = 50, //(page sizes between desktop/mobile, mobile can't hover anyway)
                    icon = (val.safe_icon) ? val.icon : "",
                    is_plus = (val.plus) ? "is_plus" : "",
                    sys = repod.psdle.safeGuessSystem(val.platform),
                    //style='background-image:url(\""+bg+"\")' bg = (val.images && val.images.length > 0) ? val.images[0] : "",
                    iS = repod.psdle.config.iconSize+"px",
                    temp = "<tr id='psdle_index_"+(val.index -1)+"' class='"+is_plus+"'><td style='max-width:"+iS+";max-height:"+iS+";'><a target='_blank' href='"+val.url+"'><img title='"+repod.psdle.lang.labels.page+" #"+Math.ceil(val.index/pg)+"' class='psdle_game_icon "+is_plus+"' /></a>"+"</td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+val.name+"</a></td>";

                var can_vita = (sys == "PS Vita") ? false : ($.inArray("PS Vita",val.platformUsable) > -1) ? true : false;
                can_vita = (can_vita) ? "class='psp2'" : "";

                if (dlQueue) {
                    temp += "<td>"+sys+"</td><td>"+dlQueue.to_sys.toUpperCase().replace("VITA","PS Vita")+"</td><td>"+val.prettySize+"</td><td>"+dlQueue.createdTime+"</td>"//convertToNumericDateSlashes(convertStrToDateObj())
                } else {
                    temp += "<td "+can_vita+">"+sys+((repod.psdle.config.check_tv && repod.psdle.id_cache[val.productID].tvcompat && sys == "PS Vita")?"<span class='psdletv'>TV</span>":"")+"</td><td>"+val.prettySize+"</td><td>"+val.prettyDate+"</td>";
                }
                temp += "</tr>";

                return temp;
            },
            totals: function() {
                var a = 0;

                $.each(repod.psdle.gamelist_cur, function(b,c) {
                    a += c.size;
                });

                var tempSize = require("valkyrie-storefront/utils/download").default.getFormattedFileSize(a);
                a = i18n.t("c.page.details.drmDetails."+tempSize.unit,{val: tempSize.value});

                return "<tr id='psdle_totals'><td /><td /><td /><td>"+a+"</td><td /></tr>";
                //formatFileSizeDisplayStr(a)
            }
        }
    },
    newbox: {
        generate: function(index) {
            var plus = "",
                game = repod.psdle.gamelist[index],
                id   = (game.index -1),
                icon = game.icon;
                dialog = $("<div>", {
                            id: "dlQueueAsk",
                            style: "background-image:url(\""+repod.psdle.table.icons.toSize(icon,400)+"\");"
                         });

            try { if (game.plus) { plus = $("#psdleplus").clone()[0].outerHTML+" "; } } catch(e) {}
            dialog.append($("<div>", {id:"dlQAN"} ).append(plus+game.name));

            if (repod.psdle.config.use_queue) {
                var temp = $.grep(game.platformUsable.slice(0), function(V) { return V !== "PSP" }), //Make sure we don't have PSP
                    t    = $("<div>", {id:"dlQASys"} );

                if (temp.length > 1) {
                    //t.append($("<div>").append($("<div>", {id:"dla_all_"+id,text:repod.psdle.lang.strings.queueAll} ))); //TO-DO: #bringback

                    $.each(temp,function(a,b) {
                        var c = b.replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
                        t.append($("<div>").append($("<div>", {id:"dla_"+c+"_"+id,class:d,text:b} )))
                    });
                } else {
                    var c = temp[0].slice(0).replace(/ps /i,"").toLowerCase(), d = (repod.psdle.config.active_consoles.hasOwnProperty(c)) ? "" : "toggled_off";
                    t.html($("<div>").append($("<div>",{id:"dla_"+c+"_"+id,class:d,text:repod.psdle.lang.strings.queueTo.replace("$SYS$",game.platformUsable[0].slice(0))})))
                }
                dialog.append(t);
            }

            try { if (game.rating) { var star = $("<div>", {class:"star-rating rater-0 ratingStarGeneric star-rating-applied star-rating-readonly star-rating-on",style:"display:inline-block !important;float:none !important;vertical-align:text-top"} ).append($("<a>",{text:""}))[0].outerHTML; dialog.append($("<div>", {id:"dlQARating"} ).append(star+" "+game.rating+" / 5")); } } catch (e) { }

            dialog.append($("<div>", {id:"dlQAStat",html:repod.psdle.safeGuessSystem(game.platform)+" | <div style='display:inline'>"+game.prettySize+"</div> | "+game.prettyDate} ));

            dialog = $("<div>", {id:"dlQueue_newbox",class:"cover"} ).append($("<div>").append(dialog[0].outerHTML));

            //Combine videos (if not mobile) and images into a single array.
            var media = [];
            //if (repod.psdle.config.mobile && game.videos) { $.each(game.videos, function(a,b) { media.push({"type":"video","url":b}); }); }
            if (game.images) { $.each(game.images, function(a,b) { media.push({"type":"image","url":b}); }); }
            if (media.length > 0) {
                //Pick a random media item and set it as the background.
                var media = media[Math.floor(Math.random() * media.length)];
                if (media.type == "video") {
                    //Set the video as the background.
                    $(dialog).prepend('<div style="z-index:-1;position:absolute;top:0px;left:0px;right:0px;bottom:0px;background-color:#000"><video style="min-height:100%;" autoplay loop muted><source src="'+game.videos[0]+'" type="video/mp4"></video></div>');
                }
                if (media.type == "image") {
                    //Set the image as the background
                    $(dialog).css("background-image","url('"+game.images[Math.floor(Math.random() * game.images.length)]+"')");
                }
            } else {
                //Set the original icon (at maximum possible resolution) as the background.
                //$(dialog).children("div").css("background","transparent url('"+icon.replace(/(w|h)=\d+/g,"")+"') no-repeat scroll center center / cover");
            }

            return dialog[0].outerHTML;
        },
        bind: function(e) {
            var that = this;

            switch (e) {
                case "on":
                default:
                    //$("#dlQueueAsk").draggable({handle:"#dlQAN",containment:"parent"});

                    $("#dlQueue_newbox").one("click", function() {
                        that.close();
                    });

                    $("#dlQueueAsk").on("click", function(event) {
                        event.stopPropagation();
                    });

                    $("div[id^=dla_]:not('.toggled_off')").on("click", function() {
                        repod.psdle.dlQueue.batch.send($(this).attr("id").split("_")[2],$(this).attr("id").split("_")[1]);
                    });
                    break;

                case "off":
                    $("div[id^=dla_]").off("click");
                    $("#dlQueueAsk").off("click");
                    break;
            }
        },
        open: function(index) {
            repod.psdle.table.icons.validate(index,-1);

            if ($("#dlQueue_newbox").length) this.close();

            $("#muh_games_container").append(this.generate(index)).promise().done(function() { repod.psdle.newbox.bind(); });
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
                $("#psdle_search_text").autocomplete("option", {source: repod.psdle.autocomplete_cache});
            } else {
                $("#psdle_search_text").autocomplete({
                    source: repod.psdle.autocomplete_cache,
                    position: {my: "center top", at: "center bottom"},
                    messages: {noResults: "", results: function() {}},
                    select: function(e,u) {
                        repod.psdle.config.last_search = u.item.value;
                        repod.psdle.table.regen(true);
                    }
                });
            }
        }
    },
    tv: {
        url_cache: [],
        init: function() {
            console.log("PSDLE | Starting PS TV checks.");
            $.each(repod.psdle.gamelist, function(index,val) {
                repod.psdle.id_cache[val.productID] = {"tvcompat": false};
            });

            this.fetchList();
        },
        fetchList: function() {
            var that = this;

            $.getJSON(repod.psdle.config.tv_url,function(a) {
                $.each(a.links,function(c,b) {
                    that.url_cache.push(b.url/*+"?size=30&start=0"*/);
                });
            }).done(function() { that.run(); });
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
            /* Obviously.   */ $("#muh_games_container").remove();
            /* CSS          */ $("#psdle_css").remove();
            /* Just 'psdle' */ delete repod.psdle;
        },
        inject_lang: function() {
            var lang = prompt("Insert JSON formatted language: (current below)",JSON.stringify(repod.psdle.lang));

            try {
                lang = JSON.parse(lang);
                repod.psdle.lang = {};
                repod.psdle.lang = repod.psdle.lang_cache.en.us;
                $.extend(true,repod.psdle.lang,lang);
                repod.psdle.genDisplay("nobind");
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

                    temp.category = "unknown";
                    temp.productID = $(this).find(".permalink").attr("href").split("cid=").pop();
                    temp.id = temp.productID;
                    temp.index = repod.psdle.gamelist.length + 1;
                    temp.name = $(this).find(".cellTitle").text();
                    temp.platform = [ $(this).find(".pforms").text().split("|").pop() ];

                    //Random values
                    temp.size = Math.floor(Math.random() * 19999994000); //Size, in bytes.
                    temp.plus = (Math.random() < 0.5);
                    if (temp.plus) { repod.psdle.config.has_plus = true; } //PS+
                    min = new Date(); min.setDate(min.getDate() - 365*4); min = min.getTime(); temp.date = new Date(min + Math.random() * (Date.now() - min)).toISOString(); //Date

                    temp.icon = SonyChi_SessionManagerSingleton.buildBaseImageURLForProductId(temp.productID)+"&w=42&h=42";

                    temp.prettySize = formatFileSizeDisplayStr(temp.size);
                    temp.url = repod.psdle.config.game_page+temp.productID;
                    temp.platformUsable = temp.platform.slice(0);
                    temp.prettyDate = convertToNumericDateSlashes(convertStrToDateObj(temp.date));

                    repod.psdle.gamelist.push(temp);
                    if (repod.psdle.config.deep_search) { repod.psdle.game_api.queue(temp.index,temp.productID); }
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
                    $("<div>",{class:"psdle_blue",text:repod.psdle.safeGuessSystem(item.platform)+" | "+item.prettySize})
                ))
                .append($("<div>",{class:"date psdle_blue",text:item.prettyDate}))

                return out[0].outerHTML;
            }
        }
    }
};

var a = setInterval(function(a){
    if ((typeof chihiro !== "undefined" && chihiro.appReady === true) || (typeof Ember !== "undefined" && Ember.BOOTED))
    {
        clearInterval(repod.psdle.config.timerID);
        repod.psdle.init();
    }

},500);
repod.psdle.config = {"timerID":a};
console.log("PSDLE | Ready.");
