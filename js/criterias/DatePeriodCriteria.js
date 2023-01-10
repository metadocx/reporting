/** 
 * DatePeriodCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DatePeriodCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {

        this.reportCriteria.parameters.ranges = {
            "Today": [moment(), moment()],
            "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            "Last 7 Days": [moment().subtract(6, 'days'), moment()],
            "Last 30 Days": [moment().subtract(29, 'days'), moment()],
            "This Month": [moment().startOf('month'), moment().endOf('month')],
            "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        };

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

    /**
     * Gets value for criteria
     * @returns 
     */
    getValue() {
        return {
            startDate: this._instance.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            endDate: this._instance.data('daterangepicker').endDate.format('YYYY-MM-DD'),
            selectedRange: this._instance.data('daterangepicker').chosenLabel,
        };
    }

    /**
     * Sets value for criteria
     * @param {*} v 
     */
    setValue(v) {
        this._instance.data('daterangepicker').setStartDate(v.startDate);
        this._instance.data('daterangepicker').setEndDate(v.endDate);
        if (v.chosenLabel) {
            // Apply label after start and end date
            this._instance.data('daterangepicker').clickRange({ target: $('[data-range-key="' + v.chosenLabel + '"]').get(0) });
        }
    }

    setStartDate(dt) {
        this._instance.data('daterangepicker').setStartDate(dt);
    }

    setEndDate(dt) {
        this._instance.data('daterangepicker').setEndDate(dt);
    }

}
window.__Metadocx.DatePeriodCriteria = DatePeriodCriteria;