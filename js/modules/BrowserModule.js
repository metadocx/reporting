/**
 * Browser module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class BrowserModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
    }

    initialize() {
        super.initialize();
    }

    /**
     * Returns browser type
     * @returns 
     */
    getBrowser() {
        if (this.isChrome()) {
            return 'chrome';
        } else if (this.isIE()) {
            return 'ie';
        } else if (this.isEdge()) {
            return 'edge';
        } else if (this.isFirefox()) {
            return 'firefox';
        } else if (this.isSafari()) {
            return 'safari';
        } else if (this.isIOSChrome()) {
            return 'chrome';
        }
    }

    /**
     * Check if browser is chrome
     * @returns 
     */
    isChrome() {
        return !!window.chrome;
    }

    /**
     * Check if browser is internet explorer
     * @returns 
     */
    isIE() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode
    }

    /**
     * Check if browser is Edge
     * @returns 
     */
    isEdge() {
        return !this.isIE() && !!window.StyleMedia
    }

    /**
     * Check if browser is firefox
     * @returns 
     */
    isFirefox() {
        return typeof InstallTrigger !== 'undefined'
    }

    /**
     * Check if browser is safari
     * @returns 
     */
    isSafari() {
        return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
            navigator.userAgent.toLowerCase().indexOf('safari') !== -1
    }

    /**
     * Check if browser is chrome on iOs
     * @returns 
     */
    isIOSChrome() {
        return navigator.userAgent.toLowerCase().indexOf('crios') !== -1
    }



}
window.__Metadocx.BrowserModule = BrowserModule;