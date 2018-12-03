var repod = {};
repod.psdle = {
    version            : "Testing",
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

        return e;
    },
    sanitizeLanguage: function() {
        //Send help.
        var a = JSON.stringify(this.lang, function(key, value) { if(typeof value === "string") { return value.replace(/'/g, "&apos;"); } return value; });
        this.lang = JSON.parse(a);
    },
    generateLangBox: function(e) {
        var that = this;
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

        return $(temp).on("change", function() {
            that.config.language = $(this).val();
            that.determineLanguage($(this).val(),true);
            that.container.go("startup");
        });
    },
    config: {"timerID": 0},
    init: function() {
        console.log("PSDLE | Init.");

        var that = this,
            match = window.location.pathname.match(/^\/([a-z\-]+)\//i),
            l = (match !== null && match.length > 1 ? match.pop() : "en-us").toLowerCase(),
            l2 = l.split("-");
        var instance = Ember.Application.NAMESPACES_BY_ID["valkyrie-storefront"].__container__;

        this.config = $.extend(this.config,{
            valkyrieInstance: instance,
            game_page       : window.location.origin+"/"+l+"/product/",
            game_api        : "https://store.playstation.com/store/api/chihiro/00_09_000/container/"+l2.slice(-1)+"/"+l2[0]+"/999/",
            lastsort        : "",
            lastsort_r      : false,
            language        : l,
            deep_search     : false,
            last_search     : "",
            dlQueue       : false,
            active_consoles : {},
            has_plus        : false,
            check_tv        : false,
            iconSize        : 42,
            mobile          : false,
            storeURLs       : instance.lookup("service:store-root").get("user").fetchStoreUrls()._result
        });

        console.log("PSDLE | Config set.");

        this.determineLanguage(this.config.language,true);
        this.injectCSS();

        this.genStartup();
    },
    genStartup: function() {
        if ($("#psdle_start").length == 0) {
            var that = this;

            if (window.psdleSkip && window.psdleSkip == true) {
                this.container.go("startup");
            } else {
                $("<div/>",{class:"psdle_logo startup"}).click(function() {
                    $(this).remove();
                    that.container.go("startup");
                }).appendTo("body");
            }
        }
    },
    container: {
        elemID: "muh_games_container",
        subElemID: "sub_container",
        go: function(target,cb) {
            switch (target) {
                default:
                case "startup":
                    this.respawn(this.startup());
                    break;
                case "progress":
                    this.respawn(this.progress());
                    break;
                case "dlList":
                    this.respawn(this.dlList().append(this.tagline()), function () {
                        repod.psdle.table.regen(true);
                        repod.psdle.table.margin();
                    })
                    break;
                case "dlQueue":
                    repod.psdle.dlQueue.generate.display(); //TO-DO: Not this!
                    break;
            }
        },
        respawn: function(content,cb) {
            //$("#"+this.subElemID).remove(); //Temporary lazy unbind
            var that = this;

            if ($("#"+this.elemID).length == 0) {
                $("<div />",{id:this.elemID,class:"valkyrie"}).appendTo("body")
            }

            $("#"+this.elemID)
            .slideUp(function() {
                $(this).children().remove();
                $(this)
                .append(content)
                .toggleClass("psdledark", that.dark)
                .toggleClass("rtl", (!!repod.psdle.lang.rtl && repod.psdle.lang.rtl == true))
                .slideDown(function() {
                    if (typeof cb == "function") {
                        cb();
                    }
                });
            })
        },
        dark: false,
        darkCSS: function() {
            this.dark = !this.dark;
            $("#"+this.elemID).toggleClass("psdledark", this.dark);
        },
        header: function() {
            return "<div class='amopromo'><a href='https://goo.gl/forms/4LQrF1KcgvP8WiA92' target='_blank'><span class='psdle_btn'>PSDLE User Survey</span></a><br><div>Let your voice be heard!</div></div>"
                    + "<span><a href='//repod.github.io/psdle/' target='_blank'><div class='psdle_logo'></div></a><br><small>v"+repod.psdle.version+"</small></span>";
        },
        tagline: function() {
            var that = this;
            var t = $("<div />", {class:'psdle tagline'});
            t.append($("<span />", {id:'psdle_night', text: "Night Mode"}).on("click", function() { that.darkCSS(); }))
            .append("<br><a href='//repod.github.io/psdle#support' target='_blank'>Support PSDLE</a> | <a href='//github.com/RePod/psdle/wiki/Submit-a-Bug-or-Translation' target='_blank'>Submit Bug/Translation</a> | ")
            .append($("<span />", {id:'dump_raw', text: "Dump Raw"}).on("click", function() {
                repod.psdle.macrossBrain(function(raw) {
                    repod.psdle.exportList.download("raw.json",JSON.stringify(raw))
                });
            }))
            .append(" | ")
            .append($("<span />", {id: "inject_lang", text: "Inject Language"}).on("click", function() {
                    repod.psdle.debug.inject_lang();
            }))

            return t;
        },
        startup: function() {
            var that = this;
            //TO-DO: Passthrough
            var config = repod.psdle.config;
            var lang = repod.psdle.lang;

            var sub = $("<div />",{id:this.subElemID})
            .append(this.header())
            .append("<br><br>"+lang.startup.apis+"<br><br>");

            var bar = $("<span />", {class: "psdle_fancy_bar"});
            $.each(lang.apis, function(key,con) {
                if (con.internalID == "api_pstv" /*&& config.language !== "en-us"*/) { return 0; }

                $("<span />", {
                    id: con.internalID,
                    class: (con.internalID == "api_game" || con.disabled) ? "toggled_off" : "",
                    "data-tooltip": con.desc.replace(/'/g, "&apos;"),
                    text: con.name.replace(/'/g, "&apos;")
                }).on("click", function() {
                    if ($(this).attr("id") !== "api_entitle") $(this).toggleClass("toggled_off");
                }).appendTo(bar)
            });

            var goBtn = $("<span />", {id: "psdle_go", class: "psdle_btn", text: lang.startup.start}).on("click", function() {
                config.deep_search = !$("#api_game").hasClass("toggled_off");
                config.dlQueue = !$("#api_queue").hasClass("toggled_off");
                config.check_tv = ($("#api_pstv").length) ? !$("#api_pstv").hasClass("toggled_off") : false;

                //that.go("progress");
                repod.psdle.generateList();
            })

            //There is surely a better way.
            sub.append(bar)
            .append("<br><br>")
            .append(goBtn)
            .append("<br>")
            .append(repod.psdle.generateLangBox())
            .append("<br><br>")
            .append(this.tagline())

            return sub;
        },
        progress: function() {
            var sub = $("<div />",{id:this.subElemID})
            .append(this.header()+"<br>")
            .append($("<progress />", {id:"startup_progress"}))
            .append("<br><span id='psdle_status'>"+repod.psdle.lang.startup.wait+"</span>");

            return sub;
        },
        postRuns: {},
        postList: function(result) {
            //Currently should arrive here from repod.psdle.generateList() or anything this calls.
            //Mini router for the progress container. result should be the feature ran returning its name (hardcoded, nice!).
            if (result) { this.postRuns[result] = true; }

            if (repod.psdle.config.check_tv && this.postRuns.tv !== true) {
                this.go("progress");
                repod.psdle.tv.init();
                return;
            }

            if (repod.psdle.config.deep_search && this.postRuns.catalog !== true) {
                this.go("progress");
                repod.psdle.game_api.run();
                return;
            }

            if (repod.psdle.config.dlQueue) {
                repod.psdle.dlQueue.batch.init();
            }

            this.go("dlList");
        },
        dlList: function() {
            //TO-DO: don't prep sys/prop cache on queue -> list switch back
            repod.psdle.genSysCache();
            repod.psdle.genPropCache();
            repod.psdle.config.lastsort = "";
            repod.psdle.config.lastsort_r = false;

            return repod.psdle.table.gen();
        }
    },
    macrossBrain: function(callback) {
        this.config.valkyrieInstance.lookup("service:macross-brain").macrossBrainInstance.getEntitlementStore().getAllEntitlements()
        .then(function(entitlements) {
            callback(entitlements);
        })
    },
    generateList: function(entitlements) {
        var that = this;
        entitlements = (window.psdleEnts || entitlements);

        if (!entitlements) {
            this.macrossBrain(function(e) { that.generateList(e) })
            return;
        }

        console.log("PSDLE | Generating download list.");

        this.gamelist = [];
        var i18n = this.config.valkyrieInstance.lookup('service:i18n');
        var entitlements = (entitlements || this.config.valkyrieInstance.lookup("service:macross-brain").macrossBrainInstance._entitlementStore._storage._entitlementMapCache);
        //.concat(this.e_inject_cache);

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
                var toPrettyDate = {mm:tempDate.getMonth()+1, dd:tempDate.getDate(), yyyy:tempDate.getFullYear()};
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

        console.log("PSDLE | Finished generating download list. End result is "+this.gamelist.length+" of "+entitlements.length+" item(s).",this.stats);
        repod.psdle.container.postList();
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
    stats: { fine: 0, generic: 0, expired: 0, service: 0, video: 0 },
    isValidContent: function(obj) {
        var exp = (obj.license) ? obj.license.expiration : obj.inactive_date,
            inf = (obj.license) ? obj.license.infinite_duration : false;


        if (!this.config.includeVideo && (obj.VUData || (obj.drm_def && obj.drm_def.contentType == "TV"))) { this.stats.video++; return 0; }
        else if (obj.entitlement_type == 1 || obj.entitlement_type == 4) { this.stats.service++; return 0; } //Services = Ignored
        else if (!this.config.includeExpired && new Date(exp) < new Date() && !inf) { this.stats.expired++; return 0; }
        else if (obj.drm_def || obj.entitlement_attributes) { this.stats.fine++; return 1; }
        else { this.stats.generic++; return 0; }
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

        this.prop_cache = ["empty"]; //Start with empty prop.

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

            $("#muh_games_container").css({"position":"absolute"});

            var sub = $("<div />", {id: repod.psdle.container.subElemID})
            .append(this.header.gen())
            .append("<div class='psdle_table'><table><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+repod.psdle.lang.columns.platform+"</th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table></div>");
            sub.find("th[id^=sort_]").on("click", function() { repod.psdle.sortGamelist($(this)); });

            this.bindSearch(); //TO-DO: GET IT OUT OF HERE!

            console.log("PSDLE | Table generated.");

            return sub;
        },
        header: {
            gen: function(dlQueue) {
                return $("<div />", {class: "search main container"})
                    .append(this.searchOptions(dlQueue))
                    .append(this.stats(dlQueue))
            },
            searchOptions: function(dlQueue) {
                var r = $("<div />", {class: "search options container"}),
                    lang = repod.psdle.lang;

                var regenFunc = function() { $(this).toggleClass("toggled_off"); repod.psdle.table.regen(true); }

                if (!dlQueue) {
                    r.append($("<span />", {class: "psdle_fancy_bar"})
                        .append($("<span />", {id: "export_view", text: lang.labels.exportView}).on("click", function() {
                            repod.psdle.exportList.configure();
                        }))
                    )
                }

                var systems = $("<span />", {class: "psdle_fancy_bar search options system"}),
                    order = ["ps1","ps2","ps3","ps4","vr","psp","vita"];
                $.each(order, function (i,v) {
                    if (repod.psdle.sys_cache.hasOwnProperty(v)) {
                        $("<span />", {id: "system_"+v, text: repod.psdle.sys_cache[v]}).on("click", regenFunc).appendTo(systems);
                    }
                });
                systems.appendTo(r);

                if (repod.psdle.config.dlQueue) {
                    var nid = (dlQueue) ? "dl_list" : "dl_queue",
                        n = (dlQueue) ? "dlList" : "dlQueue",
                        tr = lang.strings[n];

                    $("<span />", {class: "psdle_fancy_but", id: nid, text: tr}).on("click", function() {
                        repod.psdle.container.go(n);
                    }).appendTo(r);
                }

                if (!dlQueue && repod.psdle.config.deep_search) {
                    var categories = $("<div />", {class: "psdle_fancy_bar search options categories"});
                    var order = ["downloadable_game","demo","unlock","add_on","avatar","application","theme","unknown"];

                    //TO-DO: sort by order
                    $.each(repod.psdle.type_cache, function (key) {
                        var i = $("<span />", {id: "filter_"+key, text: (lang.categories[key] || key)}).on("click", regenFunc)
                        if (order.indexOf(key) >= 0) {
                            order[order.indexOf(key)] = i;
                        } else {
                            order.push(i);
                        }
                    });

                    $.each(order, function (i,v) {
                        if (typeof(v) == "object") v.appendTo(categories);
                    });

                    categories.appendTo(r);
                }

                if (!dlQueue) {
                    var textSearch = $("<div />");
                    var sel = $("<select />", {id: "psdle_search_select", class: "search input select"});
                    var keys = {
                            "name": lang.columns.name,
                            "base": "Base Game",
                            "publisher": "Publisher",
                            "id": "Item ID",
                            "pid": "Product ID"
                        };

                    //Scope select
                    if (repod.psdle.config.deep_search) {
                        keys["genre"] = "Genre";
                        // + Metadata, description
                    }
                    $.each(keys, function (i, v) {
                        $("<option />", {value: i, text: v}).appendTo(sel);
                    })
                    sel.on("change", function() { repod.psdle.table.regen(true); }).appendTo(textSearch);

                    //Autocomplete
                    $("<input />", {
                        id: "psdle_search_text",
                        class: "search input text",
                        type: "text",
                        list: "searchAutocomplete",
                        placeholder: lang.strings.search
                    }).on("blur keypress", function(e) {
                        if (e.type == "keypress" && (e.which !== 13 || !$(this).is(":focus"))) return;

                        repod.psdle.table.regen(true);
                    }).appendTo(textSearch);
                    $("<datalist />", {id: "searchAutocomplete"}).appendTo(textSearch);

                    textSearch.appendTo(r);
                }

                return r;
            },
            stats: function(dlQueue) {
                if (dlQueue) { return; }

                var current = $("<span />", {class: "search stats all current"}),
                    total = $("<span />", {class: 'search stats all total'});

                var psswitch = $("<input />", {
                    type: "checkbox",
                    class: "search input plus",
                    readonly: true
                })
                .prop({"indeterminate": true})
                .click(function() {
                    if (this.readOnly) this.checked=this.readOnly=false;
                    else if (!this.checked) this.readOnly=this.indeterminate=true;

                    repod.psdle.table.regen(true);
                });

                var switchContainer =
                    $("<span />", {
                        class: "search stats plus",
                        "data-tooltip": repod.psdle.lang.strings.plus
                    })
                    .append("(")
                    .append(psswitch)
                    .append(" ")
                    .append($("<span />", {class: "search stats plus total"}))
                    .append(")");

                var out = $("<div />", {class: "psdleSearchStats"})
                            .append(current)
                            .append(" ")
                            .append(switchContainer)
                            .append(" / ")
                            .append(total);

                return out;
            }
        },
        regen: function(a) {
            if (a == true) {
                repod.psdle.determineGames();
            } else {
                var that = this,
                    temp = "",
                    plus = 0;

                repod.psdle.exportList.delimited.destroy();

                $.each(repod.psdle.gamelist_cur,function (a,val) {
                    if (val.plus) {
                        plus++;
                    }
                    temp += repod.psdle.table_utils.gen.row(val);
                });
                temp += repod.psdle.table_utils.gen.totals();

                $(".search.stats.all.current").text(repod.psdle.gamelist_cur.length)
                $(".search.stats.all.total").text(repod.psdle.gamelist.length)
                $(".search.stats.plus.total").text(plus)

                //Generate autocomplete datalist
                $("datalist#searchAutocomplete").empty()
                $.each(repod.psdle.autocomplete_cache, function (i,v) {
                    $("<option />", {
                        value: v
                    })
                    .appendTo("datalist#searchAutocomplete")
                });

                /*TO-DO
                if (repod.psdle.config.mobile) {
                    $("#psdleplus").html("<img class='psPlusIcon' src='mobile/img/furniture/psplusicon-small.a2ec8f23.png'>");
                } else {
                    $("#psdleplus").css($(".headerUserInfo.cart").css(["background-image","background-repeat"])).css({"height":"14px","width":"14px","background-position":"left -5px"});
                }*/
                $(".psdle_table tbody").html(temp);

                this.icons.select();
            }
        },
        plus_switch: function() {
            this.regen(true);
        },
        margin: function() {
            $(".psdle_table").animate({"margin-top": $(".search.main.container").outerHeight() - $("#sub_container").css("padding-top").replace("px","")+"px"});
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
                    if (val.genre) {
                        t = val.genre.join(",");
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

                if (a == true) {
                    if ($(".search.input.plus").prop("checked")) {
                        a = val.plus == true;
                    } else if ($(".search.input.plus").prop("indeterminate")) {
                    } else if (!$(".search.input.plus").prop("checked")) {
                        a = !(val.plus == true);
                    }
                }

                if (a == true) {
                    that.gamelist_cur.push(val);

                    //Prevent duplicates from filling the autocomplete.
                    if ($.inArray(t,cache) == -1) {
                        cache.push(t);
                        that.autocomplete_cache.push(t);
                    }
                }
            }
        });
        that.config.last_search = search;
        this.sortGamelist("noreverse");
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
        else if (sys == "PS VR" || sys.indexOf("PS VR") > -1) { sys = "PS VR"; }
        else if (sys == "PS4" || sys.indexOf("PS4") > -1) { sys = "PS4"; } //What could this possibly break?

        return sys;
    },
    injectCSS: function() {
        //CSS prefers " over ' to avoid string literal issues.
        var temp = '{{{include "css/psdle.min.css"}}}';
        $("head").append('<style type="text/css">'+temp+'</style>');
    },
    exportList: {
        config: [], //Default export template.
        configure: function() {
            $("#export_configure").remove();

            //TO-DO: window max-height: 80%;
            if (this.config.length == 0) { //If export template is empty, set translated defaults.
                this.config = [ //[target, name]
                    ["name", repod.psdle.lang.columns.name],
                    ["platform", repod.psdle.lang.columns.platform],
                    ["prettySize", repod.psdle.lang.columns.size],
                    ["prettyDate", repod.psdle.lang.columns.date]
                ];
            }

            var that = this;

            //Gen input
            var w = $("<div>", {id:"export_select"}).append(
                        $("<div>").append(this.genTable())
                    )

            //Gen output
            w.append($("<span class='psdle_fancy_bar'><span id='export_row_del'>-</span><span id='export_row_add'>+</span></span><span id='export_import' class='psdle_fancy_but'>"+repod.psdle.lang.strings.exportImport+"</span><br><span class='psdle_fancy_bar'><span id='sel_export_view'>"+repod.psdle.lang.labels.exportView+"</span><span id='sel_export_json'>JSON</span><span id='sel_export_csv'>CSV</span>"))

            //Generate window.
            $("<div />",{id:"export_configure",class:"cover"}).append($("<div />").append(w)).appendTo("#muh_games_container");

            //Bind
            $("#export_import").on("click", function() {
                that.saveConfig();

                var resp = prompt("",JSON.stringify(that.config))

                if (resp !== null) {
                    try {
                        that.config = JSON.parse(resp)
                    }
                    catch (e) {
                    }
                }

                that.configure();
            });
            $("#export_row_add").off("click").on("click", function(event) { $("#export_table tbody").append(that.genRow()); }); //Add row.
            $("#export_row_del").off("click").on("click", function(event) { $("#export_table tr:gt(1)").last().remove(); }); //Remove row.
            $("#sel_export_view").off("click").on("click", function () { that.saveConfig(); that.delimited.handle(); $("#export_configure").remove(); });
            $("#sel_export_csv").off("click").on("click", function () { that.saveConfig(); that.csv.handle(); $("#export_configure").remove(); });
            $("#sel_export_json").off("click").on("click", function () { that.saveConfig(); that.json.handle(); $("#export_configure").remove(); });
            $("#export_configure").off("click").one("click", function() { $(this).remove(); repod.psdle.newbox.bind("off"); });
            $("#export_select").off("click").on("click", function(event) { event.stopPropagation(); });
        },
        genTable: function() {
            var select = this.genSelect();
            var max = (this.config.length || 5);
            var table = $("<table id='export_table'><tr><th>"+repod.psdle.lang.strings.exportColumnName+"</th><th>"+repod.psdle.lang.strings.exportProperty+"</th></tr>");

            for (i=0; i<max; i++) {
                var target = this.config[i][0];
                var text = (this.config[i][1] || "");
                var select2 = select.clone();

                if (this.config[i]) {
                    select2.find("[value="+target+"]").attr("selected","selected");
                }

                select2 = select2[0].outerHTML;
                table.append(this.genRow(text,select2));
            }

            return table;
        },
        genRow: function(text,select) {
            text = (text) ? text : "";
            select = (select) ? select : this.genSelect()[0].outerHTML;

            var row = $("<tr><td><div class='orderUp'></div><input placeholder='...?' value='"+text+"'></td><td>"+select+"</td></tr>")
            $(row).find(".orderUp").click(function() {
                //$(this).parent().parent().clone(true).insertAfter($("#export_table tr").eq(0));
                var target = $(this).parent().parent().prev(":not(:first-child)");
                if (target.length > 0) {
                    target.before($(this).parent().parent().clone(true));
                    $(this).parent().parent().remove();
                }
            });

            return row;
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
                columns.push([
                    $(this).find("select option:selected").val(),
                    $(this).find("input").val()
                ]);
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

                $("<textarea />", {
                    class: "search export",
                    text: this.gen(prompt(repod.psdle.lang.strings.delimiter,"\t"))
                })
                .insertAfter(".psdleSearchStats");

                repod.psdle.table.margin();
            },
            destroy: function () { $(".search.export").remove(); repod.psdle.table.margin(); }
        },
        json: {
            gen: function() {
                var config = repod.psdle.exportList.config;
                var tempjson = {"columns":config,"items":[]};

                $.each(repod.psdle.gamelist_cur, function(i) {
                    var tempprop = {};

                    $.each(config, function(j,v) {
                        tempprop[v[0]] = repod.psdle.exportList.format(i,v[0],"JSONExp")
                    });

                    tempjson.items.push(tempprop);
                });

                return tempjson;
            },
            handle: function() {
                repod.psdle.exportList.download(
                 ".json",
                 JSON.stringify(this.gen())
                )
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

                repod.psdle.exportList.download(
                    ".csv",
                    this.gen()
                );
            }
        },
        download: function(download, content) {
            $("<a>",{
              "download" : "psdle_"+(new Date().toLocaleString().replace(/[:\/]/g,"-"))+"_"+(download || "generic.txt"),
              "href" : "data:text/csv;charset=utf-8,"+encodeURIComponent(content)
            })[0].dispatchEvent(new MouseEvent("click"));
        },
        format: function(index,target,sep) {
            var item = repod.psdle.gamelist_cur[index],
                toJSON = (sep == "JSONExp"),
                yes = (toJSON) ? true : repod.psdle.lang.strings.yes,
                no = (toJSON) ? false : repod.psdle.lang.strings.no;

            switch (target) {
                //Exceptions.
                case "empty": return ""; break;
                case "category": return (repod.psdle.lang.categories[item.category] || item.category); break;
                case "platform": return repod.psdle.safeGuessSystem(item.platform); break;
                case "vitaCompat": return ($.inArray("PS Vita",item.platformUsable) > -1) ? yes : no; break;
                case "vitatvCompat": return (repod.psdle.config.check_tv && repod.psdle.id_cache[item.productID].tvcompat && repod.psdle.safeGuessSystem(item.platform) == "PS Vita") ? yes : no; break;
                default: //Generics
                    var temp = item[target];
                    if (!temp) break;
                    if (typeof temp == "boolean") { temp = (temp) ? yes : no }
                    if (typeof temp == "object") { temp = (toJSON) ? temp : JSON.stringify(temp).replace(/"/g,"'"); }
                    if (typeof temp == "string") {
                        temp = temp.replace(/([\r\n]+?)/gm," "); //Remove linefeeds
                        temp = temp.replace(/"/g,'""'); //Escape dquotes
    
                        if (temp.indexOf(sep) > -1 || temp.indexOf('"') > -1) {
                            temp = '"'+temp+'"';
                        }
                    }

                    return temp
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

                $.each(this.config, function(i,v) {
                    var target = v[0];

                    if (v) {
                        out += that.format(index,target,sep) + sep;
                    }
                });

                out += "\n";
            } else if (index == -1) {
                //Footer.
                //To-do: Reimplement totals based on selected columns.
                $.each(this.config, function(i,v) {
                    var target = v[0];
                    out += target+sep;
                }); //Align to columns.
                out += "\""+JSON.stringify(this.config).replace(/"/g,"'")+"\""; //JSON in extra column.
            } else {
                //Generally the first row, but more so a catch-all that spits out column names.
                $.each(this.config, function(i,v) {
                    out += v[1]+sep;
                });

                out += "\n";
            }

            return out;
        }
    },
    game_api: {
        batch: [],
        called: 0, //Catalog threads completed (success or not)
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
        run: function(burstThreads) {
            var that = this,
                catalog = repod.psdle.config.valkyrieInstance.lookup('service:susuwatari');

            if (this.batch.length == 0) {
                return 0;
                this.finish();
            }

            this.batch.splice(0, (burstThreads || 30)).forEach(function(i, e) {
                catalog.resolve(i.pid)
                .then(function (data) {
                    if (data.response && data.response.status == 404) return 0;

                    var parse = that.parse(data),
                        cached = repod.psdle.pid_cache.hasOwnProperty(data.id);
                    repod.psdle.type_cache[parse.category] = true;

                    if (cached) {
                        repod.psdle.pid_cache[data.id] = parse;
                    }

                    //BAD WITH PROMISES 101, this is probably a huge performance hit
                    var target = repod.psdle.gamelist.find(function (i) { return i.id == data.id });

                    if (target.hasOwnProperty("index")) {
                        $.extend(repod.psdle.gamelist[target.index-1], parse);
                    }

                    that.called++;
                })
                .catch(function(e){ that.called++; repod.psdle.type_cache["unknown"] = true; })
                .then(function() { that.run(1); that.updateBar(); });
            });
        },
        updateBar: function() {
            var l = this.called,
                r = repod.psdle.gamelist.length;

            $("#startup_progress").attr({value:l,max:r});
            $("#psdle_status").text(repod.psdle.lang.startup.wait).append($("<br />")).append(l+" / "+r); //Slow, but scared of .html for translations.

            if (l == r) {
                $("#psdle_status").text(repod.psdle.lang.startup.wait);
                $("#startup_progress").attr("value",null);
                this.finish();
            }
        },
        finish: function(force) {
            if (force !== true) {
                if (this.called > 0 && this.called < repod.psdle.gamelist.length) { return; } //Keep waiting
            }

            setTimeout(function() {
                repod.psdle.container.postList("catalog");
            }, 100);
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

            //Determine VR.
            if (data.psVrCompatibility == "required") {
                extend.platform = ["PS VR"];
            }

            //Images and videos.
            if (data.mediaList) {
                extend.images = data.mediaList.screenshots /*data.mediaList.promo.images*/
                .map(function(k){ return k.url }).filter(function(url){ return /\.(png|jpg)$/i.test(url) })

                //extend.videos = data.mediaList.promo.videos
                //.map(k => k.url).filter(url => /\.mp4$/i.test(url))
            }

            //Everything else.
            extend.baseGame = (data.name || undefined)
            extend.category = (data.topCategory || "unknown");
            extend.description = (data.longDescription || undefined)
            extend.displayPrice = ((data.mbSkus && data.mbSkus[0] && data.mbSkus[0].display_price) || undefined)
            //extend.metadata = (data.metadata || undefined)
            extend.publisher = (data.providerName || undefined)
            extend.rating = (data.starRating) ? [data.starRating.score, data.starRating.total] : undefined;
            extend.releaseDate = (data.releaseDate || undefined) //TO-DO: prettify?
            extend.genre = (data.genres.sort() || undefined) //TO-DO: aaaaaaaaa
            //if (data.age_limit && data.content_rating) { extend.ageLimit = data.content_rating.rating_system + " " + data.age_limit; }

            return extend;
        }
    },
    dlQueue: {
        batch: {
            init: function() {
                var that = this;
                this.Kamaji = repod.psdle.config.valkyrieInstance.lookup('service:kamaji/downloads');

                this.Kamaji.fetchDeviceCount().then(function(a) {
                    repod.psdle.config.active_consoles = {
                        vita: (a.numPSVITA > 0),
                        ps3: (a.numPS3 > 0),
                        ps4: (a.numPS4 > 0)
                    }

                    that.Kamaji.enableDownloadStatusPolling();
                })
            },
            send: function(index,sys) {
                var that = this,
                    Kamaji = this.Kamaji,
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
                var Kamaji = this.Kamaji,
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
                    //TO-DO: Not read arbitrary data off the DOM! Possibly use data.
                    this.go($(e).children("td:eq(3)").text(),repod.psdle.gamelist[Number($(e).attr("id").split("_").pop())].id);
                },
                go: function(sys,id,auto) {
                    var cb = function() { repod.psdle.container.go("dlQueue") };

                    if (sys == "ps4") {
                        repod.psdle.dlQueue.batch.Kamaji.cancelPS4Download(id).then(cb);
                    } else {
                        //"PS3" or "PS Vita" only! Case-sensitive. Refer to KamajiPlatforms.
                        repod.psdle.dlQueue.batch.Kamaji.cancelDRMDownload(sys, id).then(cb);
                    }
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

                $(".psdle_table").remove();
                $("#sub_container").append("<div class='psdle_table'><table style='display:inline-block;text-align:left'><thead><tr><th>"+repod.psdle.lang.columns.icon+"</th><th id='sort_name'>"+repod.psdle.lang.columns.name+"</th><th>"+repod.psdle.lang.columns.platform+"</th><th> > </th><th id='sort_size'>"+repod.psdle.lang.columns.size+"</th><th id='sort_date'>"+repod.psdle.lang.columns.date+"</th></tr></thead><tbody></tbody></table></div>");

                $.each(repod.psdle.dlQueue.batch.Kamaji.waitingDownloads, function(sys,items) {
                    if (/Downloads$/.test(sys) && items.length > 0) { //TO-DO: Stricter
                        $.each(repod.psdle.gamelist, function(a,b) {
                            if (items.indexOf(b.id) >= 0) {
                                var c = {
                                    createdTime: "?", //Find this
                                    to_sys: sys.match(/(.*?)Downloads/).pop()
                                }
                                temp += repod.psdle.table_utils.gen.row(b,c);
                            }
                        });
                    }
                });

                $(".psdle_table tbody").html(temp);
                repod.psdle.table.margin();
            },
            display: function() {
                this.bindings();
                $("#sub_container").empty()
                .append(repod.psdle.table.header.gen(true));
                this.table();
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
                var out_size = "";
                var i18n = repod.psdle.config.valkyrieInstance.lookup('service:i18n');

                $.each(repod.psdle.gamelist_cur, function(b,c) { a += c.size; });
                var tempSize = require("valkyrie-storefront/utils/download").default.getFormattedFileSize(a);
                out_size = (a > 0) ? i18n.t("c.page.details.drmDetails."+tempSize.unit,{val: tempSize.value}) : "";

                return "<tr id='psdle_totals'><td /><td /><td /><td>"+out_size+"</td><td /></tr>";
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

            if (repod.psdle.config.dlQueue) {
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

            if (game.rating) {
                var star = $("<div>", {class:"fa fa-star"})[0].outerHTML;
                dialog.append($("<div>", {id:"dlQARating"} ).append(star+" "+game.rating[0]+" / 5 ("+game.rating[1]+")"));
            }

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
    tv: {
        url_cache: [],
        container: "",
        init: function() {
            var that = this;

            console.log("PSDLE | Starting PS TV checks.");
            $.each(repod.psdle.gamelist, function(index,val) {
                repod.psdle.id_cache[val.productID] = {"tvcompat": false};
            });

            this.detect(function(item) {
                if (item !== undefined) {
                    this.container = item;
                } else {
                    console.log("PSDLE | Couldn't find TV container.") //We failed!
                }
            });
        },
        detect: function (cb) {
            //Someone's going to laugh at me when the store itself can get away with it.
            //Return PSTV targetContainerId otherwise nothing if we cannot find it.
            var base = repod.psdle.config.valkyrieInstance.lookup("service:storefront");

            for (var i = 0; i < base.navigation.length; i++) {
                var route = base.navigation[i];
                if (route.routeName === "games") { //Search for games routeName instead of assuming 0 index.
                    for (i = 0; i < route.submenu.length; i++) {
                        var sub = route.submenu[i];
                        if (sub.targetContainerId.toLowerCase().indexOf("vita") > -1) { //Search for Vita
                            for (i = 0; i < sub.items.length; i++) {
                                var item = sub.items[i];
                                if (item.targetContainerId.toLowerCase().indexOf("tv") > -1) { //Search for TV
                                    cb(item.targetContainerId);
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            cb(); //Didn't find anything, bail.
        },
        fetchList: function() {
            var that = this;
            return;

            //Build URL
            /*var url =
            this.container*/

            $.getJSON(url,function(a) {
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
        },
        inject_lang: function() {
            var lang = prompt("Insert JSON formatted language: (current below)",JSON.stringify(repod.psdle.lang));

            try {
                lang = JSON.parse(lang);
                if (lang.hasOwnProperty("def")) {
                    lang = lang[lang.def];
                }
                repod.psdle.lang = {};
                repod.psdle.lang = repod.psdle.lang_cache.en.us;
                $.extend(true,repod.psdle.lang,lang);
                repod.psdle.container.go("startup");
            } catch (e) {
                alert(e);
            }
        }
    }
};

repod.psdle.config.timerID = setInterval(function(a){
    if (
        (typeof Ember !== "undefined" && Ember.BOOTED) &&
        Ember.Application.NAMESPACES_BY_ID["valkyrie-storefront"]._booted
    )
    {
        clearInterval(repod.psdle.config.timerID);
        repod.psdle.init();
    }
},500);
console.log("%cPSDLE has started!", "color:#2185f4;font-size:x-large;font-weight:bold;")
console.log("PSDLE | Ready.");