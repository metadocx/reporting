/** 
 * CriteriaControl base class for all criteria controls
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class CriteriaControl {

    constructor(app) {
        this.id = null;
        this.app = app;
        this.reportCriteria = null;
        this._instance = null;
    }

    /**
     * Initializes any javascript code for this criteria
     * Sets JS object (if any) to this._instance
     */
    initializeJS() { }

    /**
     * Renders the criterias HTML code
     */
    render() { }

    /**
     * Returns current JS instance of criteria UX component
     * For example select2 or daterangepicker objects
     * @returns object
     */
    getInstance() {
        return this._instance;
    }

    /**
     * Returns if criteria is enabled by user
     * @returns bool
     */
    getIsEnabled() {
        return $('#criteriaEnabled_' + this.id).prop('checked');
    }

    /**
     * Returns criteria value
     * @returns mixed
     */
    getValue() { return null; }

    /**
     * Sets criteria value
     * @param {*} v 
     */
    setValue(v) {
        // must overload this function
    }

}
