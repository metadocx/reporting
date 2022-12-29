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

        for (var x in from) {
            if (typeof from[x] === 'object') {
                this.copyObjectProperties(from[x], to[x]);
            } else {
                to[x] = from[x];
            }
        }

    }

}
window.__Metadocx.DataTypeModule = DataTypeModule;