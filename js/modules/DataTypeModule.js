/**
 * DataType module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataTypeModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
    }

    initialize() {
        super.initialize();
    }

    /**
     * Convert value to boolean value
     * @param {*} v 
     * @returns 
     */
    toBool(v) {
        if (typeof v === 'string' || v instanceof String) {
            v = v.toLowerCase();
        }

        switch (v) {
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
            case "oui":
            case "vrai":
                return true;
            default:
                return false;
        }

    }

    /**
     * Parses float value
     * @param {*} v 
     * @returns 
     */
    parseFloat(v) {
        return Number(v.toPrecision(15));
    }

    /**
     * Deep copy of object 
     * @param {*} from 
     * @param {*} to 
     */
    copyObjectProperties(from, to) {

        for (let x in from) {
            if (typeof from[x] === 'object') {
                this.copyObjectProperties(from[x], to[x]);
            } else {
                to[x] = from[x];
            }
        }

    }

    /**
     * Return unique ID
     * @returns 
     */
    uid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

}
window.__Metadocx.DataTypeModule = DataTypeModule;