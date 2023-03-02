/**
 * Metadocx application
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
window.__Metadocx = { Locales: {}, Themes: {} };

class MetadocxApplication {

    constructor() {

        /**
         * Metadocx version
         */
        this.version = '0.1.0';

        /**
         * Application modules 
         * 
         * All Module classes will be instanciated and 
         * loaded in this property for easy access
         */
        this.modules = {};

        /**
         * Array of callbacks that will be called after modules are loaded
         */
        this.onInitializeCallbacks = [];

        /**
         * The script tag that loaded this script
         * Used to pass parameters to the script directly in the DOM
         */
        this.scriptTag = null;

        /**
         * ReportViewer instance
         */
        this.viewer = new ReportViewer(this);

    }

    /**
     * Initializes application, this is the starting point of the app
     */
    initialize() {

        /**
         * Scan script tag data- attributes for options
         */
        this.loadScriptTagOptions();


        /**
         * MODULES 
         * 
         * List available modules in Metadocx namespace 
         */
        let aModules = [];
        for (let x in window.__Metadocx) {
            if (x.endsWith('Module')) {
                aModules.push(new window.__Metadocx[x](this));
            }
        }
        /**
         * Sort boot priority of modules and register them
         */
        aModules.sort((a, b) => {
            if (a.bootPriority < b.bootPriority) { return -1; }
            if (a.bootPriority > b.bootPriority) { return 1; }
            return 0;
        });

        /**
         * Initialize modules
         */
        console.groupCollapsed('[Metadocx] Modules initialization');
        for (let x in aModules) {
            this.registerModule(aModules[x]);
        }
        console.groupEnd();

        /**
         * Call other initialize callback scripts
         */
        for (let x in this.onInitializeCallbacks) {
            this.onInitializeCallbacks[x]();
        }

        /**
         * REQUIRED LIBRARIES 
         * Event once all libraries are loaded (if injected)
         */
        this.modules.Import.onLibrairiesLoaded = () => {
            /**
            * Build report view interface
            */
            this.modules.UI.renderReportViewer(this);

            if (this.viewer.options.report) {
                this.viewer.load(this.viewer.options.report);
            } else {
                this.viewer.showNoReportAlert();
            }
        }
        /**
         * Inject required js and css files
         */
        this.modules.Import.injectRequiredLibraries();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

    }

    /**
     * Gets script tag data attributes and applies them to report options
     */
    loadScriptTagOptions() {

        this.scriptTag = document.querySelector('script[src$="metadocx.js"]');
        if (this.scriptTag == null) {
            this.scriptTag = document.querySelector('script[src$="metadocx.min.js"]');
        }

        for (let x in this.scriptTag.dataset) {
            this.viewer.options[x] = this.scriptTag.dataset[x];
        }

        /**
         * Check if we have a name if not set default value
         */
        if (!this.viewer.options.id) {
            this.viewer.options.id = "metadocxReport";
        }

        if (!this.viewer.options.container) {
            this.viewer.options.container = "metadocx-report";
        }

    }


    /**
     * Adds module to Metadocx object and initializes the module
     * @param {*} oModule 
     */
    registerModule(oModule) {
        this.modules[oModule.name] = oModule;
        oModule.initialize();
        oModule.app = this;
    }


}