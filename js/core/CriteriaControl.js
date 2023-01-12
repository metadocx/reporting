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
        this.parentCriteria = null;
        this.childCriterias = [];
        this.resetChildCriteriaOnChange = true;
    }

    /**
     * Initializes any javascript code for this criteria
     * Sets JS object (if any) to this._instance
     */
    initializeJS() {
        throw new Error('Must redefine function initializeJS');
    }

    /**
     * Renders the criterias HTML code
     */
    render() {
        throw new Error('Must redefine function render');
    }

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
     * Sets is criterias is enabled or not
     * @param {*} bEnabled 
     */
    setIsEnabled(bEnabled) {
        $('#criteriaEnabled_' + this.id).prop('checked', bEnabled);
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

    /**
     * Sets parent criteria control
     * @param {*} ctl 
     */
    setParentCriteria(ctl) {
        this.parentCriteria = ctl;
    }

    /**
     * Returns parent criteria control
     * @returns 
     */
    getParentCriteria() {
        return this.parentCriteria;
    }

    /**
     * Adds a child criteria control
     * @param {*} ctl 
     */
    addChildCriteria(ctl) {
        ctl.setParentCriteria(this);
        this.childCriterias.push(ctl);
    }

    /**
     * Returns child criteria controls
     * @returns 
     */
    getChildCriterias() {
        return this.childCriterias;
    }

}
