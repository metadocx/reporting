/** 
 * NumericCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class NumericCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {
        this._instance = $('#' + this.id).daterangepicker(this.reportCriteria.parameters);
    }

    render() {

        return `<div class="mb-3">
                    <label class="form-label" for="${this.id}">
                        ${this.reportCriteria.name}
                    </label>            
                    <input id="${this.id}" class="form-control"/>                        
                </div>`;

    }

    getValue() {
        return {
            startDate: this._instance.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            endDate: this._instance.data('daterangepicker').endDate.format('YYYY-MM-DD'),
        };
    }

    setValue(v) {
        this._instance.data('daterangepicker').setStartDate(v.startDate);
        this._instance.data('daterangepicker').setEndDate(v.endDate);
    }



}
window.__Metadocx.NumericCriteria = NumericCriteria;