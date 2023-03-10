/**
 * UI module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class UIModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 200;
        this.isConsoleDisabled = false;

        /**
        * Conversion ratio centimeters to pixels
        */
        this._cmToPx = 37.7952;

        /**
         * Conversion ratio points to pixels
         */
        this._ptToPx = 1.32835;

        /**
         * Conversion ratio inches to pixels
         */
        this._inchToPx = 96;

        /**
        * Conversion ratio mm to inches
        */
        this._mmToInches = 0.0393701;

    }

    initialize() {
        super.initialize();
    }

    renderReportViewer(app) {
        console.groupEnd();
        console.groupCollapsed('[Metadocx] Render report viewer');
        app.reporting.viewer.render();
        console.groupEnd();
    }

    convertInchesToPixels(inches) {
        return inches * this._inchToPx;
    }

    convertPixelsToInches(pixels) {
        return pixels / this._inchToPx;
    }

    convertInchesToMM(inches) {
        return parseFloat((inches / this._mmToInches).toFixed(2));
    }

    convertMMtoInches(mm) {
        return parseFloat(mm * this._mmToInches);
    }


}
window.__Metadocx.UIModule = UIModule;