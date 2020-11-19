/*! psdle 4.0.1 (c) RePod, MIT https://github.com/RePod/psdle/blob/master/LICENSE - base - compiled 2020-11-18 */
var repod = {}
repod.psdle = {
    config: {
        version: "4.869",
        versionDate: "202X-🔥-39"
    },
    init: function() {
        console.log(`PSDLE ${this.config.version} ${this.config.versionDate}`)

        Object.assign(this.config, {
            root: repod.psdle,
            userData: {},
            gameList: [],
            locale: __NEXT_DATA__.props.appProps.session.userData.locale,
            gqlHost: __NEXT_DATA__.runtimeConfig.service.gqlBrowser.host,
            DOMElements: {
                collectionFilter: ".collection-filter.psw-grid-container",
                filterExportContainer: "psdle-filter-section-export",
                filterExportSelects: "psdle-filter-export-selects",
                PSDLEconfigurator: "psdle-configurator"
            },
            propCache: [],
            catalogCache: {},
            catalogProps: [],
            catalogDatabase: this.database
        })

        //Not currently hooked up to anything like a select box.
        this.config.lang = this.language.getCurrent(this.config)

        this.css()
        this.userData.init(this.config)
        this.reactisms.init(this.config)
        this.reactisms.stateChange.callback(this.config)
    },
    postInit: async function(config) {
        //But also on page changes.

        //Fetch games.
        config.gameList = await this.api.games(config, this.reactisms.getCurrentPage())

        this.caches.props(config)
        this.generate.filters.section(config)

        if (config.userData.catalog) {
            this.api.init(config)
        }
    },
    database: {
        version: 1,
        name: "PSDLECatalogCache",
        db: {},
        init: async function(config, callback) {
            var persist = await this.persist()

            if (persist) {
                config.userData.catalog = true
                config.root.userData.save(config)

                this.create.db(config, callback)
            } else {
                //Temporary would defeat the purpose.
            }
        },
        persist: function() {
            if (navigator.storage && navigator.storage.persist) {
                return navigator.storage.persist().then(function(persistent) {
                    return persistent
                })
            }

            return false
        },
        drop: function() {
            this.db.close()

            var dropDatabase = window.indexedDB.deleteDatabase(this.name)
            dropDatabase.onsuccess = (e => console.log(e))
            dropDatabase.onerror = (e => console.error(e))
            location.reload()
        },
        create: {
            db: function(config, callback) {
                var db = window.indexedDB.open(
                    config.catalogDatabase.name,
                    config.catalogDatabase.version
                )

                db.onerror = (e => console.error(e))
                db.onupgradeneeded = function(e) {
                    config.catalogDatabase.db = db.result
                    config.catalogDatabase.create.upgrade(config, e, db.result)
                }
                db.onsuccess = function(e) {
                    config.catalogDatabase.db = db.result
                    callback()
                }
            },
            upgrade: function(config, e, db) {
                if (e.oldVersion > 0 && e.oldVersion < config.catalogDatabase.version) {
                    db.deleteObjectStore("cache")
                }

                this.objectStore(config, db)
            },
            objectStore: function(config, db) {
                var db = db.createObjectStore("cache", { keyPath: "id" })
                db.createIndex("ID", "id", {unique: true})

                db.transaction.oncomplete = (e => console.log(e))
                db.transaction.onerror = (e => console.log(e))
            }
        },
        transact: {
            get: function(config, type) {
                return config.catalogDatabase.db.transaction("cache", type)
            },
            dumpCacheToDB: function(config, callback, backToCache) {
                var db = this.get(config, "readwrite")
                var store = db.objectStore("cache")

                db.oncomplete = function(e) {
                    if (backToCache) {
                        config.catalogDatabase.transact.dumpDBToCache(config, callback)
                    } else {
                        callback(e)
                    }
                }
                db.onerror = (e => console.log(e))

                for (var [id, json] of Object.entries(config.catalogCache)) {
                    store.put({"id": id, "json": json})
                }
            },
            dumpDBToCache: function(config, callback) {
                var db = this.get(config)
                var store = db.objectStore("cache")
                var readOut = {}

                db.oncomplete = (e => callback(e))
                db.onerror = (e => console.log(e))

                store.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result
                    if (cursor) {
                        readOut[cursor.key] = cursor.value.json
                        cursor.continue()
                    }
                    else {
                        config.catalogCache = Object.assign({}, readOut)
                    }
                }
            },
            getNewIDs: function(config, callback) {
                var games = config.gameList.map(e=>e.entitlementId)
                var db = this.get(config, "readonly")
                var store = db.objectStore("cache")
                var readOut = []

                //db.oncomplete = (e => console.log(e))
                db.onerror = (e => console.log(e))

                store.openCursor().onsuccess = function(event) {
                    var cursor = event.target.result
                    if (cursor) {
                        readOut.push(cursor.key)
                        cursor.continue()
                    }
                    else {
                        var newIDs = games.filter(e => readOut.indexOf(e) < 0)
                        console.debug("Catalog new IDs:", newIDs)

                        callback(newIDs)
                    }
                }
            },
        }
    },
    reactisms: {
        init: function(config) {
            this.stateChange.newPushState(config)
        },
        getCurrentPage: function(config) {
            //Remove leading slash. Overkill regex just in case.
            return (this.stateChange.tracked || location.pathname).replace(/^\//, "")
        },
        stateChange: {
            tracked: "",
            timer: 0,
            orgPushState: window.history.pushState,
            newPushState: function(config) {
                (function(config, orgPushState, callback) {
                    window.history.pushState = function() {
                        orgPushState.apply(this, arguments)
                        callback.bind(config.root.reactisms.stateChange)(config, arguments)
                    }
                })(config, this.orgPushState, this.callback)
            },
            callback: function(config, args) {
                this.tracked = location.pathname
                this.waitForPage(config, config.root.postInit.bind(config.root))
            },
            waitForPage: function(config, callback) {
                clearInterval(config.root.reactisms.stateChange.timer)

                this.timer = setInterval(function() {
                    if (document.querySelector(config.DOMElements.collectionFilter) == null) {
                        console.log('PSDLE casts "Spin Wheels" on', location.href)
                        return
                    }

                    //Regret part 1.
                    document.querySelector(".collection-filter-selected").addEventListener("click", function(e) {
                        config.root.reactisms.stateChange.callback(config)
                    })

                    clearInterval(config.root.reactisms.stateChange.timer)

                    callback(config)
                }, 125)
            }
        }
    },
    caches: {
        regen: function(config, target) {

        },
        props: function(config) {
            //Populate property cache.
            let customProps = ['empty','sortedIndex']
            let excludeProps = ['__typename','webctas','conceptId']

            Object.assign(config, {
                propCache: config.gameList.map(i => Object.keys(i)).reduce((i, itemKeys) => itemKeys).concat(customProps)
            })

            if (Object.keys(config.catalogCache).length > 0) {
                let customProps = [] //['price']
                let catalogProps = Object.entries(config.catalogCache)
                .filter(data => data[1] !== null)
                .reduce((a,b) => Object.keys(b[1]))
                .concat(customProps)

                config.catalogProps = catalogProps
                config.propCache = config.propCache.concat(catalogProps)
            } else {
                //Preserve props that don't exist yet. Does not include imports.
                let importedProps = config.userData.exports
                .map(e => e.property)
                .filter(e => config.propCache.indexOf(e) < 0)

                config.catalogProps = importedProps
            }

            //Dedupe and remove excluded props.
            config.propCache = config.propCache
            .filter(function(item,i) {
                var dupeCheck = config.propCache.indexOf(item) == i

                if (!dupeCheck) {
                    console.warn("Dupe in propCache:", item)
                }

                return dupeCheck
            })
            .filter(item => excludeProps.indexOf(item) < 0)
            .sort()

            if (Object.keys(config.catalogCache).length > 0) {
                config.root.exportView.section.refresh(config)
            }
        }
    },
    userData: {
        key: "PSDLEuserData",
        defaults: {
            catalog: false,
            exports: [
                {"property": "name", "title": "Name"},
                {"property": "platform", "title": "Platform"},
                {"property": "sortedIndex", "title": "Date (relative)"},
            ]
        },
        init: function(config) {
            config.userData = Object.assign({}, this.defaults)

            console.debug(this.load(config))
        },
        save: function(config) {
            localStorage.setItem(this.key, JSON.stringify(config.userData))

            console.debug("Saved userData:", localStorage.getItem(this.key))
        },
        load: function(config) {
            if (!localStorage.hasOwnProperty(this.key)) {
                return `${this.key} not found.`
            }

            try {
                var userData = JSON.parse(localStorage.getItem(this.key))
                Object.assign(config.userData, userData)

                return userData
            } catch (e) {
                console.debug(e)
                var oldReliable = confirm(`PSDLE had an issue loading user data. Would you like to reset it?\n\n${e}`)

                if (oldReliable) {
                    this.remove()
                    location.reload()
                }

                return e
            }
        },
        remove: function() {
            localStorage.removeItem(this.key)
        }
    },
    generate: {
        filters: {
            section: function(config) {
                //This is going to get out of hand isn't it.
                var psdleLogo = this.button(config,
                    "h4",
                    this.logo(config),
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button"],
                    (e => this.toggleSectionVisibility(config, config.DOMElements.PSDLEconfigurator))
                )
                var sortCollection = this.button(config,
                    "h4",
                    "Sort",
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button", "psdle-filter-sort"],
                    (e => console.log(e))
                )
                var exportButton = this.button(config,
                    "h4",
                    `${config.lang.labels.exportView} (${config.gameList.length})`,
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button", "psdle-filter-export"],
                    (e => this.toggleSectionVisibility(config, config.DOMElements.filterExportContainer))
                )

                var configSection = this.sectionGroup(config,
                    "div",
                    config.root.generate.config.section(config, this),
                    ["psdle", "psw-cell", "psw-m-b-m", "psw-round-m"],
                    config.DOMElements.PSDLEconfigurator,
                    true
                )

                var exportSection = this.sectionGroup(config,
                    "div",
                    config.root.exportView.section.generate(config),
                    ["psdle", "psw-cell", "psw-m-b-m", "psw-round-m"],
                    config.DOMElements.filterExportContainer,
                    true
                )

                document.querySelector(config.DOMElements.collectionFilter).prepend(
                    psdleLogo,
                    configSection,
                    exportButton,
                    exportSection
                )
                //sortCollection
            },
            logo: function(config) {
                var logo = document.createElement("div")
                logo.classList.add("psdle", "psdle-logo")
                logo.title = `${config.version} ${config.versionDate}`
                //logo.onclick = (() => config.root.api.init(config))

                return logo
            },
            toggleSectionVisibility: function(config, id) {
                var el = document.querySelector(`#${id}`)
                el.style.display = (el.style.display == "none") ? "" : "none"

                return el
            },
            sectionGroup: function(config, elem, content, classes, id, hidden) {
                var el = document.createElement(elem)
                el.classList.add(...classes)
                el.appendChild(content)
                el.id = id

                if (hidden) {
                    el.style.display = "none"
                }

                return el
            },
            button: function(config, elem, content, classes, onclick) {
                var el = document.createElement(elem)
                el.classList.add(...classes)
                el.onclick = onclick

                if (typeof content === "object") {
                    el.appendChild(content)
                } else {
                    el.textContent = content
                }

                return el
            }
        },
        config: {
            section: function(config) {
                var el = document.createElement("div")
                el.append(this.buttons(config))

                return el
            },
            buttons: function(config) {
                var el = document.createElement("div")

                if (config.userData.catalog !== true) {
                    el.append(
                        this.helpers.rowButton(config, config.lang.labels.catalogEnable, function(e) {
                            e.target.remove()
                            alert(config.lang.messages.catalogFirstRun)
                            config.root.api.init(config)
                        })
                    )
                }

                el.append(
                    this.helpers.rowButton(config, config.lang.labels.website, function(e) {
                        window.open("https://repod.github.io/psdle/", "_blank");
                    }),
                    this.helpers.rowButton(config, config.lang.labels.deleteData, function(e) {
                        config.root.userData.remove()
                        config.root.database.drop()
                    })
                )

                el.append(this.helpers.version(config))

                return el
            },
            helpers: {
                rowButton: function(config, text, onclick) {
                    var el = document.createElement("button")
                    el.innerText = text
                    el.onclick = (onclick || (e => console.log(e)))

                    return el
                },
                version: function(config) {
                    let versionLabel = document.createElement("span")
                    versionLabel.innerText = `${config.version} ${config.versionDate}`

                    return versionLabel
                }
            }
        }
    },
    exportView: {
        section: {
            generate: function(config) {
                //Contain the optionPairs, row manipulation buttons, and CSV/JSON buttons
                var el = document.createElement("div")
                el.append(this.optionPairs(config))
                el.append(this.buttons(config))

                return el
            },
            refresh: function(config) {
                let oldSelects = document.querySelector(`#${config.DOMElements.filterExportSelects}`)
                let newSelects = config.root.exportView.section.optionPairs(config)

                oldSelects.replaceWith(newSelects)
                config.root.userData.save(config)
            },
            buttons: function(config) {
                var el = document.createElement("div")

                el.append(
                    this.button(config, "＋", (e => this.addOptionPair(config))),
                    this.button(config, "－", (e => this.removeOptionPair(config))),
                    document.createElement("br"),
                    this.button(config, "Import", (e => config.root.exportView.download.importExports(config))),
                    this.button(config, "JSON", (e => config.root.exportView.download.generate(config, "JSON"))),
                    this.button(config, "CSV", (e => config.root.exportView.download.generate(config, "CSV")))
                )

                return el
            },
            button: function(config, text, onclick) {
                var el = document.createElement("button")
                el.innerText = text
                el.onclick = (onclick || (e => console.log(e)))

                return el
            },
            optionPairs: function(config) {
                //Select box and text input
                var el = document.createElement("div")
                el.id = config.DOMElements.filterExportSelects

                for (var i in config.userData.exports) {
                    var userProps = config.userData.exports[i]
                    el.append(
                        this.optionPair(config, userProps.title, userProps.property)
                    )
                }

                return el
            },
            optionPair: function(config, textOption, selectOption) {
                var elSpan = document.createElement("span")

                elSpan.append(
                    this.textOption(config, textOption),
                    this.selectOption(config, selectOption)
                )

                return elSpan
            },
            addOptionPair: function(config) {
                var el = document.querySelector(`#${config.DOMElements.filterExportSelects}`)

                el.append(this.optionPair(config))
                config.root.exportView.download.saveExports(config)
            },
            removeOptionPair: function(config) {
                var removeTarget = document.querySelectorAll(`#${config.DOMElements.filterExportSelects} span`)

                if (removeTarget.length > 0) {
                    [...removeTarget].pop().remove()
                }

                config.root.exportView.download.saveExports(config)
            },
            selectOption: function(config, defaultOption) {
                var el = document.createElement("select")
                el.onchange = (e => this.saveOptions(config, e))

                config.propCache.forEach(function(prop) {
                    var elOption = document.createElement("option")
                    elOption.value = prop
                    elOption.text = prop
                    elOption.selected = (prop === defaultOption)

                    el.appendChild(elOption)
                })

                return el
            },
            textOption: function(config, defaultText) {
                var el = document.createElement("input")
                el.onchange = (e => this.saveOptions(config, e))
                el.type = "text"
                el.placeholder = config.lang.labels.exportEmpty
                el.defaultValue = (defaultText || "")

                return el
            },
            saveOptions: function(config) {
                config.root.exportView.download.saveExports(config)
            }
        },
        download: {
            importExports: function(config) {
                try {
                    //Do we really want to error handle this.
                    var imports = JSON.parse(prompt("", JSON.stringify(config.userData.exports)))

                    imports.map(function(pair) {
                        if (config.propCache.indexOf(pair.property) == -1) {
                            console.warn("Bad property?", pair.property)
                            pair.property = config.propCache[0]
                        }

                        return pair
                    })

                    config.userData.exports = imports
                } catch (e) {
                    alert(e)
                }

                config.root.exportView.section.refresh(config)
            },
            saveExports: function(config) {
                var els = [...document.querySelectorAll(`#${config.DOMElements.filterExportSelects} > span > *`)]

                //Ask me how I know this is a bad idea.
                config.userData.exports = els.reduce((t, elem, i, src) =>
                   (elem.nodeName == "SELECT") ? [...t, {"property": elem.value, "title": src[i-1].value}] : t
                , [])

                config.root.userData.save(config)
                return config.userData.exports
            },
            generate: function(config, download) {
                //Verify if attempting to export keys that don't exist (typically Catalog)
                if (Object.keys(config.catalogCache).length == 0) {
                    let catalogProps = config.catalogProps

                    if (catalogProps.length > 0) {
                        if (!confirm(`${config.lang.messages.exportNoProps}\n\n` + catalogProps.join(" ")))
                            return
                    }
                }

                if (download == "CSV") {
                    this.present(config, this.format.csv.build(config, this.format.helpers), ".csv")
                }
                if (download == "JSON") {
                    this.present(config, this.format.json(config, this.format.helpers), ".json")
                }
            },
            format: {
                helpers: {
                    sanitize: function(config, itemKeys, userProp, toJSON) {
                        //Handle exceptions and custom properties
                        //Surprise, everything is an exception. Definitely can be done better.
                        switch (userProp) {
                            case "sortedIndex":
                                return config.gameList.length - itemKeys.index
                            case "empty":
                                return ""
                            default:
                                try {
                                    var prop = (itemKeys[userProp] || config.catalogCache[itemKeys.entitlementId][userProp])

                                    if (userProp == "descriptions") {
                                        prop = prop.filter(e => e.type=="LONG").pop().value
                                    }
                                    if (userProp == "price") {
                                        prop = config.catalogCache[itemKeys.entitlementId].price.basePrice
                                    }
                                    if (userProp == "image") {
                                        prop = prop.url
                                    }

                                    if (typeof prop == "object") {
                                        prop = toJSON ? prop : prop.map(e => (e.type) ? `${e.type}:${e.value}`: e.value).join(",")
                                    }
                                    if (typeof prop == "string") {
                                        prop = prop.replace(/"/g,'""') //Escape dquotes

                                        if (prop.indexOf(",") > -1 || prop.indexOf('"') > -1) {
                                            prop = `"${prop}"`
                                        }
                                    }

                                    return prop
                                } catch (e) {
                                    console.warn(`Couldn't find ${userProp} in ${itemKeys.name} ${itemKeys.entitlementId}`)
                                    return ""
                                }
                        }
                    }
                },
                json: function(config, helpers) {
                    var temp = {
                        "version": config.version,
                        "columns": config.userData.exports,
                        "items": []
                    }

                    config.gameList.forEach(function (itemKeys, index) {
                        var tempItem = {}

                        for (var i in config.userData.exports) {
                            var userProp = config.userData.exports[i].property

                            tempItem[userProp] = helpers.sanitize(config, {...itemKeys, "index": index}, userProp, true)
                        }

                        temp.items.push(tempItem)
                    })

                    return JSON.stringify(temp)
                },
                csv: {
                    build: function(config, helpers) {
                        var temp = []

                        temp.push(this.rowSpecial(config, "header"))

                        config.gameList.forEach((itemKeys, index) =>
                            temp.push(this.row(config, itemKeys, index, helpers))
                        )

                        temp.push(this.rowSpecial(config, "footer"))

                        return temp.join("\n")
                    },
                    row: function(config, itemKeys, index, helpers) {
                        var temp = []

                        for (var i in config.userData.exports) {
                            var userProp = config.userData.exports[i].property

                            temp.push(helpers.sanitize(config, {...itemKeys, "index": index}, userProp))
                        }

                        return temp.join(",")
                    },
                    rowSpecial: function(config, type, index) {
                        var temp = []

                        if (type == "header") {
                            temp = temp.concat(repod.psdle.config.userData.exports.map(prop => prop.title))
                        }

                        if (type == "footer") {
                            temp = temp.concat(repod.psdle.config.userData.exports.map(prop => prop.property))
                            temp.push(
                                `"${JSON.stringify(config.userData.exports).replace(/"/g,"'")}"`,
                                config.version
                            )
                        }

                        return temp.join(",")
                    }
                }
            },
            present: function(config, content, download) {
                var blob = new Blob(["\ufeff", content], {type: "octet/stream"})
                var elExport = document.createElement("a")
                elExport.download = `psdle_${new Date().toISOString()}${(download || "_generic.txt")}`
                elExport.href = window.URL.createObjectURL(blob)

                elExport.dispatchEvent(new MouseEvent("click"))

                window.URL.revokeObjectURL(blob)
            }
        }
    },
    api: {
        process: {
            cur: 0,
            total: 0
        },
        init: async function(config) {
            var persistDB = await config.catalogDatabase.persist()

            if (persistDB) {
                config.catalogDatabase.init(config, (() => this.fetchIDs(config)))
            } else {
                this.catalog(config)
            }
        },
        fetchIDs: function(config) {
            config.catalogDatabase.transact.getNewIDs(
                config, ((e) => this.catalog(config, e))
            )
        },
        games: function(config, currentPage) {
            //Currently only recents and plus, so hard assume purchasedTitlesRetrieve. Regret later.
            return this.fetch(config, currentPage)
            .then(r => r.json())
            .then(data => data.data.purchasedTitlesRetrieve.games)
        },
        catalog: async function(config, newIDs) {
            var target = (newIDs || config.gameList.map(e => e.entitlementId))
            var process = this.process
            process.total = target.length
            this.queries.catalog.hash = await this.hash(this.queries.catalog.query)

            if (target.length == 0) {
                this.finish(config)
                return
            }

            for (let id of target) {
                this.call(config, "catalog", {"productId": id})
                .then(r => r.json())
                .then(function(data) {
                    process.cur += 1
                    config.catalogCache[id] = (data.errors) ? null : data.data.productRetrieve

                    var p = Math.ceil(process.cur/process.total*100)
                    document.querySelector(".psdle-logo").style.background = `var(--psdle-logo-clear), linear-gradient(to right, var(--blue) ${p}%, var(--darker-blue) ${p}%)`

                    if (process.cur == process.total) {
                        config.root.api.finish(config)
                    }
                })
            }
        },
        finish: async function(config) {
            var persistDB = await config.catalogDatabase.persist()
            if (persistDB) {
                config.catalogDatabase.transact.dumpCacheToDB(
                    config,
                    (function() { config.root.caches.props(config) }),
                    true
                )
            } else {
                config.root.caches.props(config)
            }
        },
        call: function(config, fetchName, variables) {
            return this.fetch(
                config,
                fetchName,
                variables
            )
        },
        fetch: function(config, fetchName, variables) {
            //query = (query || this.queries[operationName])

            var gqlRequest = this.buildGQLQuery(config, fetchName, variables)

            //Might as well since we're already here.
            var queryParams = Object.entries(gqlRequest).filter(e => e[0] !== 'query').map(e =>
                `${e[0]}=` + ((typeof e[1] === 'object') ? encodeURIComponent(JSON.stringify(e[1])) : e[1])
            ).join("&")

            return fetch(`${config.gqlHost}/op?${queryParams}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-psn-store-locale-override': config.locale
                },
                body: JSON.stringify(
                    gqlRequest
                )
            })
        },
        buildGQLQuery: function(config, fetchName, variables) {
            var gqlQuery = this.queries[fetchName]
            var gqlRequest = {
                variables: (variables && Object.keys(variables).length > 0 ? variables : gqlQuery.variables),
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: gqlQuery.hash
                    }
                }
            }

            if (gqlQuery.query) {
                gqlRequest.query = gqlQuery.query
            } else {
                gqlRequest.operationName = gqlQuery.operationName
            }

            //Regret part 2. This will never break.
            if (gqlQuery.variables.platform) {
                let platform = document.querySelector(".collection-filter__selected-label span").dataset.trackClick.split(":").pop()
                gqlQuery.variables.platform = platform == "all" ? ["ps4","ps5"] : [platform]
            }

            return gqlRequest
        },
        queries: {
            "recently-purchased": {
                operationName: "getPurchasedGameList",
                variables: {"isActive":true,"platform":["ps4","ps5"],"size":1000,"sortBy":"ACTIVE_DATE","sortDirection":"desc","subscriptionService":"NONE"},
                hash: "00694ada3d374422aa34564e91a0589f23c5f52e0e9a703b19d065dedceb3496"
            },
            "ps-plus": {
                operationName: "getPurchasedGameList",
                variables: {"platform":["ps4","ps5"],"size":1000,"sortBy":"ACTIVE_DATE","sortDirection":"desc","subscriptionService":"PS_PLUS"},
                hash: "00694ada3d374422aa34564e91a0589f23c5f52e0e9a703b19d065dedceb3496"
            },
            catalog: {
                query: `query queryRetrieveTelemetryDataPDPProduct($productId: String!) {\n  productRetrieve(productId: $productId) {\n    ... productFragment\n  }\n}\nfragment productFragment on Product {\n  id\n  name\n  publisherName\n  topCategory\n  releaseDate\n  descriptions {\n    type\n    value\n  }\n  compatibilityNotices {\n    type\n    value\n  }\n  media {\n    type\n    url\n    role\n  }\n  edition {\n    name\n  }\n  defaultSku {\n    id\n    name\n    type\n  }\n  skus {\n    id\n  }\n  contentRating {\n    name\n  }\n  localizedStoreDisplayClassification\n  localizedGenres {\n    value\n  }\n  price {\n    basePrice\n    discountedPrice\n    serviceBranding\n  }\n}`,
                variables: "",
                hash: "" //COULD precalculate this, but effort.
            }
        },
        hash: async function(string) {
            const msgUint8 = new TextEncoder().encode(string)
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            return hashHex
        }
    },
    css: function() {
        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = `.psdle{--blue:#2185f4;--darker-blue:#063f7e;--bg-hover-filters:#e8e8e8;--psdle-logo-clear:url("data:image/webp;base64,UklGRnIAAABXRUJQVlA4TGUAAAAvU4AHEC9ApG1T/27Hzm6DINum/pwjuMAFBEX/R0OQbTOk+dMM4QYP8H8MbVsBRZEkNXMOAiAACUjAv6wMr3tG9H8Ckn3bhE1lUwEFhE0Nr2LzH4TNGLN5v5VtPgibV5YaT27fVgA=");--thin-padding:8px 16px}.psdle-logo{margin:0 auto;display:block;width:84px;height:31px;background-image:var(--psdle-logo-clear);background-color:var(--blue)}.psdle-filter-button{cursor:pointer}#psdle-configurator button{text-align:left;width:100%;padding:var(--thin-padding);font-weight:400!important;font-size:1rem}#psdle-configurator button:not(:last-child){border-bottom:.0625rem solid #dedede}#psdle-configurator,#psdle-filter-section-export{text-align:center;overflow:hidden;background-color:var(--bg-1)}#psdle-filter-section-export input{cursor:text}#psdle-filter-section-export select{border-style:solid;border:none;background-color:var(--bg-1);border-bottom:.0625rem solid #dedede}#psdle-filter-section-export select option{background-color:#fff}#psdle-filter-section-export input,#psdle-filter-section-export select{width:100%;padding:var(--thin-padding)}#psdle-configurator button:hover,#psdle-filter-section-export input:hover,#psdle-filter-section-export select:hover{background-color:var(--bg-hover-filters)}#psdle-filter-section-export button{padding:.2rem .3rem;margin:.3rem}#psdle-filter-section-export button:hover{color:var(--blue);background-color:var(--bg-hover-filters)}`
        document.getElementsByTagName('head')[0].appendChild(style)
    },
    language: {
        getCurrent: function(config, override) {
            let outputLang = Object.assign({}, this.cache.en.us)
            let locale = (override || config.locale || "en-us").split("-")

            if (this.cache.hasOwnProperty(locale[0])) {
                let target = {}

                if (this.cache[locale[0]].hasOwnProperty(locale[1])) {
                    target = this.cache[locale[0]][locale[1]]
                } else {
                    let def = this.cache[locale[0]].def
                    console.warn(`${locale[1]} not found for ${locale[0]}, falling back to ${def}`)
                    target = this.cache[locale[0]][def]
                }

                Object.assign(outputLang, target)
            }

            return outputLang
        },
        cache: {"en":{"def":"us","us":{"author":"","local":"English","labels":{"exportView":"Export View","exportEmpty":"..?","deleteData":"Delete user data","catalogEnable":"Enable Catalog","website":"Website"},"messages":{"catalogFirstRun":"Your browser may prompt you for storage permissions. PSDLE will use this to store Catalog responses for quicker and automatic startup.\n\nGranting permission is only required for these benefits.","exportNoProps":"The following properties may not currently exist and could export as nothing, continue?\nThese may require running Catalog first."}}}}
    }
}

repod.psdle.init()