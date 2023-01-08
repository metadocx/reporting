/**
 * Import module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ImportModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 200;
        this.isConsoleDisabled = false;
        this.loaded = false;
        this.onLibrairiesLoaded = null;
        this._bInjectionWasMade = false;

        this.loadStatus = {};

        this.stacks = {
            default: {
                requires: [
                    'Metadocx', 'jQuery', 'jQueryUI', 'IconScout', 'Numeral', 'Bootstrap', 'Select2', 'Moment', 'DateRangePicker', 'ChartJS'
                ],
            },
        };

        this.libraries = {
            Metadocx: {
                head: {
                    links: [
                        {
                            id: 'metadocxcss',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: '/css/metadocx.css',
                            tests: ['metadocx.css', 'metadocx.min.css'],
                            crossorigin: 'anonymous',
                            code: '<link rel="stylesheet" href="/css/metadocx.css" />',
                        }
                    ],
                }
            },
            jQuery: {
                bottom: {
                    scripts: [
                        {
                            id: 'jquery',
                            type: 'script',
                            priority: 100,
                            src: 'https://code.jquery.com/jquery-3.6.1.min.js',
                            crossorigin: 'anonymous',
                            integrity: 'sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=',
                            code: '<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>',
                        }
                    ],
                }
            },
            jQueryUI: {
                head: {
                    links: [
                        {
                            id: 'jqueryui',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css',
                            integrity: 'sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css" integrity="sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        },
                        {
                            id: 'jqueryuitheme',
                            type: 'link',
                            priority: 110,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css',
                            integrity: 'sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css" integrity="sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        }
                    ]
                },
                bottom: {
                    scripts: [
                        {
                            id: 'jqueryui',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js',
                            code: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js" integrity="sha512-57oZ/vW8ANMjR/KQ6Be9v/+/h6bq9/l3f0Oc7vn6qMqyhvPd1cvKBRWWpzu0QoneImqr2SkmO4MSqU+RpHom3Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
                        },
                    ]
                }
            },
            FontAwesome: {
                head: {
                    links: [
                        {
                            id: 'fontawesome',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css',
                            integrity: 'sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        },
                    ],
                }
            },
            IconScout: {
                head: {
                    links: [
                        {
                            id: 'iconscoutcss',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://unicons.iconscout.com/release/v3.0.0/css/line.css',
                            crossorigin: 'anonymous',
                            code: '<link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.0/css/line.css">        ',
                        },
                    ],
                }
            },
            Moment: {
                bottom: {
                    scripts: [
                        {
                            id: 'momentjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js',
                            code: '<script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>',
                        },
                    ],
                },
            },
            DateRangePicker: {
                head: {
                    links: [
                        {
                            id: 'daterangepickercss',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css',
                            rel: 'stylesheet',
                            crossorigin: 'anonymous',
                            code: '<link href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" crossorigin="anonymous">',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'daterangepickerjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js',
                            code: '<script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>',
                        },
                    ],
                },
            },
            Numeral: {
                bottom: {
                    scripts: [
                        {
                            id: 'numeral',
                            type: 'script',
                            priority: 100,
                            src: '//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js',
                            code: '<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>',
                        },
                    ],
                },
            },
            Bootstrap: {
                head: {
                    links: [
                        {
                            id: 'bootstrapcss',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
                            rel: 'stylesheet',
                            integrity: 'sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65',
                            crossorigin: 'anonymous',
                            code: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'popperjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js',
                            integrity: 'sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3',
                            crossorigin: 'anonymous',
                            code: '<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>',
                        },
                        {
                            id: 'bootstrapjs',
                            type: 'script',
                            priority: 110,
                            src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
                            integrity: 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4',
                            crossorigin: 'anonymous',
                            code: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
                        },
                    ],
                }
            },
            ChartJS: {
                bottom: {
                    scripts: [
                        {
                            id: 'chartjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/chart.js@4.1.1/dist/chart.umd.min.js',
                            code: '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.1.1/dist/chart.umd.min.js"></script>',
                        },
                    ]
                }
            },
            Select2: {
                head: {
                    links: [
                        {
                            id: 'select2css',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css',
                            rel: 'stylesheet',
                            crossorigin: 'anonymous',
                            code: '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'select2js',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
                            crossorigin: 'anonymous',
                            code: '<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>',
                        },
                    ],
                }
            },
        };
    }

    initialize() {
        super.initialize();
    }

    /**
     * Checks if all injected items are loaded
     * @returns 
     */
    isLoaded() {

        for (var x in this.loadStatus) {
            if (!this.loadStatus[x].loaded) {
                return false;
            }
        }

        return true;

    }


    /**
     * Scans all required files in a library and creates link and script tags
     * @param {*} libName 
     */
    injectLibrary(libName) {
        var sections = this.libraries[libName];
        if (sections.head && sections.head.links) {
            for (var x in sections.head.links) {
                if (!this.isStyleSheetLoaded(sections.head.links[x].href, sections.head.links[x].tests)) {
                    this.log('   Injecting head link ' + sections.head.links[x].id);
                    this.createElement(sections.head.links[x]);
                } else {
                    this.log('   Script ' + sections.head.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.head && sections.head.scripts) {
            for (var x in sections.head.scripts) {
                if (!this.isScriptLoaded(sections.head.scripts[x].src)) {
                    this.log('   Injecting head script ' + sections.head.scripts[x].id);
                    this.createElement(sections.head.scripts[x]);
                } else {
                    this.log('   Script ' + sections.head.scripts[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.links) {
            for (var x in sections.bottom.links) {
                if (!this.isStyleSheetLoaded(sections.bottom.links[x].href, sections.bottom.links[x].tests)) {
                    this.log('   Injecting bootom link ' + sections.bottom.links[x].id);
                    this.createElement(sections.bottom.links[x]);
                } else {
                    this.log('   Script ' + sections.bottom.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.scripts) {
            for (var x in sections.bottom.scripts) {
                if (!this.isScriptLoaded(sections.bottom.scripts[x].src)) {
                    this.log('   Injecting bottom script ' + sections.bottom.scripts[x].id);
                    this.createElement(sections.bottom.scripts[x]);
                } else {
                    this.log('   Script ' + sections.bottom.scripts[x].id + ' already loaded');
                }
            }
        }
    }

    triggerLibrariesLoaded(libName) {

        if (this.loadStatus[libName]) {
            this.loadStatus[libName].loaded = true;
        }

        if (this.isLoaded()) {
            if (this.onLibrairiesLoaded) {
                this.onLibrairiesLoaded();
            }
        }
    }

    createElement(options) {

        var module = this;

        this._bInjectionWasMade = true;

        this.loadStatus[options.id] = {
            loaded: false,
        };

        (function (d, s, id) {
            var js, lsjs = d.getElementsByTagName(s)[0];

            if (d.getElementById(id)) {
                console.log('Package is already loaded, skipping');
                return;
            }
            js = d.createElement(s); js.id = id;
            if (options.onload) {
                js.onload = options.onload;
            } else {
                js.onload = () => {
                    module.triggerLibrariesLoaded(id);
                };
            }
            if (options.src) {
                js.src = options.src;
            }
            if (options.crossorigin) {
                js.crossOrigin = options.crossorigin;
            }
            if (options.integrity) {
                js.integrity = options.integrity;
            }
            if (options.href) {
                js.href = options.href;
            }
            if (options.rel) {
                js.rel = options.rel;
            }
            if (!lsjs) {
                // Inject in head
                lsjs = document.getElementsByTagName('head')[0];
                lsjs.appendChild(js);
            } else {
                lsjs.parentNode.insertBefore(js, lsjs);
            }

        }(document, options.type, options.id));
    }

    injectRequiredLibraries() {
        console.groupCollapsed('[Metadocx] Checking for required link and script tags');

        if (this.app.viewer.options.ui == undefined) {
            this.app.viewer.options.ui = 'default';
        }

        this.log('Injecting required librairies for stack ' + this.app.viewer.options.ui);
        for (var x in this.stacks[this.app.viewer.options.ui].requires) {
            var libName = this.stacks[this.app.viewer.options.ui].requires[x];
            this.injectLibrary(libName);
        }

        if (!this._bInjectionWasMade) {
            // No injection made call 
            if (this.onLibrairiesLoaded) {
                this.onLibrairiesLoaded();
            }
        }

    }

    test() {
        console.log('Testing required librairies');

        if (this.app.viewer.options.ui == undefined) {
            this.app.viewer.options.ui = 'default';
        }

        var bValid = true;
        for (var x in this.stacks[this.app.viewer.options.ui].requires) {
            var libName = this.stacks[this.app.viewer.options.ui].requires[x];
            var bLibIsValid = this.testLibrary(libName);
            if (!bLibIsValid && bValid) {
                bValid = false;
            }
        }

        if (bValid) {
            console.log('All required libraries are loaded');
        } else {
            console.warn('Some required libraries are missing');
        }

        return bValid;

    }

    /**
     * Test library link and script to se if they are loaded
     * @param {*} libName 
     * @returns 
     */
    testLibrary(libName) {

        var sections = this.libraries[libName];
        if (sections.head && sections.head.links) {
            for (var x in sections.head.links) {
                if (!this.isStyleSheetLoaded(sections.head.links[x].href, sections.head.links[x].tests)) {
                    this.log('   Style sheet ' + sections.head.links[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.head && sections.head.scripts) {
            for (var x in sections.head.scripts) {
                if (!this.isScriptLoaded(sections.head.scripts[x].src)) {
                    this.log('   Script ' + sections.head.scripts[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.bottom && sections.bottom.links) {
            for (var x in sections.bottom.links) {
                if (!this.isStyleSheetLoaded(sections.bottom.links[x].href, sections.bottom.links[x].tests)) {
                    this.log('   Style sheet ' + sections.bottom.links[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.bottom && sections.bottom.scripts) {
            for (var x in sections.bottom.scripts) {
                if (!this.isScriptLoaded(sections.bottom.scripts[x].src)) {
                    this.log('   Script ' + sections.bottom.scripts[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        return true;

    }

    isStyleSheetLoaded(sUrl, tests) {

        for (var x in document.styleSheets) {
            if (document.styleSheets[x].href) {
                if (document.styleSheets[x].href.toLowerCase().endsWith(sUrl.toLowerCase())) {
                    return true;
                }

                if (tests != undefined && Array.isArray(tests)) {
                    for (var t in tests) {
                        if (document.styleSheets[x].href.toLowerCase().endsWith(tests[t].toLowerCase())) {
                            return true;
                        }

                    }
                }

            }
        }

        return false;
    }

    isScriptLoaded(sUrl) {

        for (var x in document.scripts) {
            if (document.scripts[x].src) {
                if (document.scripts[x].src.toLowerCase().endsWith(sUrl.toLowerCase())) {
                    return true;
                }
            }
        }

        return false;
    }

}
window.__Metadocx.ImportModule = ImportModule;