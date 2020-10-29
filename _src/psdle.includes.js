/*! psdle 3.3.18 (c) RePod, MIT https://github.com/RePod/psdle/blob/master/LICENSE - base - compiled 2020-10-29 */
var repod = {}
repod.psdle = {
    config: {
        version: "4.0.Testing",
        versionDate: "2020-Infinity-39"
    },
    init: function() {
        Object.assign(this.config, {
            root: repod.psdle,
            userData: {},
            gameList: Object.entries(__NEXT_DATA__.props.apolloState.ROOT_QUERY).filter(i=>i[0].startsWith("purchasedTitlesRetrieve"))[0][1].games,
            catalogCache: {},
            locale: __NEXT_DATA__.props.appProps.session.userData.locale,
            gqlHost: __NEXT_DATA__.runtimeConfig.service.gqlBrowser.host,
            DOMElements: {
                collectionFilter: document.querySelector(".collection-filter.psw-grid-container"),
                filterExportContainer: "psdle-filter-section-export",
                filterExportSelects: "psdle-filter-export-selects"
            },
        })

        this.caches.props(this.config)
        this.userData.init(this.config)

        this.css()
        this.generate.filters.section(this.config)
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
                let includeProps = ['price']
                let catalogProps = Object.entries(config.catalogCache)
                .filter(data => data[1] !== null)
                .reduce((a,b) => Object.keys(b[1]))
                .concat(includeProps)

                config.propCache = config.propCache.concat(catalogProps)
            }

            config.propCache = config.propCache.filter(item => excludeProps.indexOf(item) < 0).sort()

            if (Object.keys(config.catalogCache).length > 0) {
                config.root.exportView.section.refresh(config)
            }
        }
    },
    userData: {
        key: "PSDLEuserData",
        defaults: {
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

            console.debug(localStorage.getItem(this.key))
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
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button"]
                )
                var sortCollection = this.button(config,
                    "h4",
                    "Sort",
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button", "psdle-filter-sort"],
                    (e => console.log(e))
                )
                var exportButton = this.button(config,
                    "h4",
                    `Export View (${config.gameList.length})`,
                    ["psw-cell", "psw-m-b-m", "psdle-filter-button", "psdle-filter-export"],
                    (e => this.toggleSectionVisibility(config, config.DOMElements.filterExportContainer))
                )

                var exportSection = this.sectionGroup(config,
                    "div",
                    config.root.exportView.section.generate(config),
                    ["psdle", "psw-cell", "psw-m-b-m", "psw-round-m"],
                    config.DOMElements.filterExportContainer,
                    true
                )

                config.DOMElements.collectionFilter.prepend(
                    psdleLogo,
                    exportButton,
                    exportSection
                )
                //sortCollection
            },
            logo: function(config) {
                var logo = document.createElement("div")
                logo.classList.add("psdle", "psdle-logo")
                logo.title = `${config.version} ${config.versionDate}`

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

                //Iterate over a prop cache.
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
                el.placeholder = "..?"
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
                                        prop = config.catalogCache[itemKeys.entitlementId].webctas[0].price.basePrice
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
        catalog: async function(config) {
            var process = this.process
            process.total = config.gameList.length
            this.customQueries.catalog.hash = await this.hash(this.customQueries.catalog.query)

            for (let id of config.gameList.map(e=>e.entitlementId)) {


                this.call(
                    config,
                    "catalog",
                    {"productId": id},
                )
                .then(r => r.json())
                .then(function(data) {
                    process.cur += 1
                    config.catalogCache[id] = (data.errors) ? null : data.data.productRetrieve

                    var p = Math.ceil(process.cur/process.total*100)
                    document.querySelector(".psdle-logo").style.background = `var(--psdle-logo-clear), linear-gradient(to right, var(--blue) ${p}%, var(--darker-blue) ${p}%)`

                    if (process.cur == process.total) {
                        config.root.caches.props(config)
                    }
                })
            }
        },
        call: function(config, custom, variables) {
            return this.fetch(
                config,
                custom,
                variables
            )
        },
        fetch: function(config, custom, variables) {
            //query = (query || this.queries[operationName])
            var customQuery = this.customQueries[custom]

            var gqlRequest = {
                query: customQuery.query,
                variables: variables,
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: customQuery.hash
                    }
                }
            }

            //Might as well since we're already here.
            var queryParams = Object.entries(gqlRequest).filter(e => e[0] !== 'query').map(e =>
                `${e[0]}=` + ((typeof e[1] === 'object') ? encodeURIComponent(JSON.stringify(e[1])) : e[1])
            ).join("&")

            return fetch(`${config.gqlHost}/op?${queryParams}`, {
                method: 'POST',
                credentials: 'same-origin',
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
        customQueries: {
            catalog: {
                query: `query queryRetrieveTelemetryDataPDPProduct($productId: String!) {\n  productRetrieve(productId: $productId) {\n    ... productFragment\n  }\n}\n  fragment productFragment on Product {\n    id\n    name\n    publisherName\n    topCategory\n    releaseDate\n    descriptions {\n        type\n        value\n    }\n    compatibilityNotices {\n        type\n        value\n    }\n    edition {\n      name\n    }\n    defaultSku {\n      id\n      name\n    }\n    skus {\n      id\n    }\n    contentRating {\n      name\n    }\n    localizedGenres {\n        value\n    }\n    webctas {\n      price {\n        basePrice\n        discountedPrice\n        serviceBranding\n      }\n    }\n  }`,
                hash: "" //COULD precalculate this, but effort.
            }
        },
        queries: {
            //Spooky not quite black box functions and persistent hashes for GQL.
            "productRetrieveForCtasWithPrice": "8532da7eda369efdad054ca8f885394a2d0c22d03c5259a422ae2bb3b98c5c99",
            "productRetrieveForUpsellWithCtas": "7d46a3b7949a7a980a04213ba6355c72b3713cb96f2e3cb077f318883fa3092b"
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
        style.innerHTML = `.psdle{--blue:#2185f4;--darker-blue:#063f7e;--bg-hover-filters:#e8e8e8;--psdle-logo-clear:url("data:image/webp;base64,UklGRnIAAABXRUJQVlA4TGUAAAAvU4AHEC9ApG1T/27Hzm6DINum/pwjuMAFBEX/R0OQbTOk+dMM4QYP8H8MbVsBRZEkNXMOAiAACUjAv6wMr3tG9H8Ckn3bhE1lUwEFhE0Nr2LzH4TNGLN5v5VtPgibV5YaT27fVgA=")}.psdle-logo{margin:0 auto;display:block;width:84px;height:31px;background-image:var(--psdle-logo-clear);background-color:var(--blue)}.psdle-filter-button{cursor:pointer}#psdle-filter-section-export{text-align:center;overflow:hidden;background-color:var(--bg-1)}#psdle-filter-section-export input{cursor:text}#psdle-filter-section-export select{border-style:solid;border:none;background-color:var(--bg-1);border-bottom:.0625rem solid #dedede}#psdle-filter-section-export select option{background-color:#fff}#psdle-filter-section-export input,#psdle-filter-section-export select{width:100%;padding:8px 16px}#psdle-filter-section-export input:hover,#psdle-filter-section-export select:hover{background-color:var(--bg-hover-filters)}#psdle-filter-section-export button{padding:.2rem .3rem;margin:.3rem}#psdle-filter-section-export button:hover{color:var(--blue);background-color:var(--bg-hover-filters)}`
        document.getElementsByTagName('head')[0].appendChild(style)
    }
}

//Find a ready state.
repod.psdle.init()