/** 
 * CheckboxCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class CheckboxCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {
        return null;
    }

    /**
     * Render criteria HTML
     * @returns 
     */
    render() {

        let sCheckboxes = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (let x in this.reportCriteria.options) {
                sCheckboxes += `<div class="col-3 form-check mb-2">
                                    <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${this.reportCriteria.options[x].id}" value="${this.reportCriteria.options[x].id}">
                                    <label class="form-check-label" for="chk${this.id}_${this.reportCriteria.options[x].id}">
                                        ${this.reportCriteria.options[x].text}
                                    </label>
                                </div>`;

            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sCheckboxes = this.buildCheckboxesFromReportData(this.reportCriteria.options.field);
            } else if (this.reportCriteria.options.source == 'ajax') {
                sCheckboxes = '<div id="__tempHolder' + this.id + '"></div>';
                this.getCheckboxOptionsFromAjax(this.reportCriteria.options.url);
            }

        }

        return `<div class="row">${sCheckboxes}</div>`;

    }

    /**
     * Calls page for list of options
     * @param {*} url 
     */
    getCheckboxOptionsFromAjax(url) {

        $.get(url, (data, status) => {

            this.buildCheckboxesFromAjaxData(data);

        });

    }

    /**
     * Builds checkboxes from ajax response
     * @param {*} response 
     */
    buildCheckboxesFromAjaxData(response) {

        let sCheckboxes = '';
        let data = response.results;
        for (let x in data) {
            sCheckboxes += `<div class="col-3 form-check mb-2">
                                <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${data[x].id}" value="${data[x].id}">
                                <label class="form-check-label" for="chk${this.id}_${data[x].id}">
                                    ${data[x].text}
                                </label>
                            </div>`;

        }
        $('#__tempHolder' + this.id).replaceWith(sCheckboxes);

    }

    /**
     * Loads checkboxes from report data
     * @param {*} field 
     * @returns 
     */
    buildCheckboxesFromReportData(field) {
        let sCheckboxes = '';
        let aOptions = [];
        let aReportSections = this.app.reporting.viewer.report.getReportSections();
        for (let s in aReportSections) {
            for (let x in aReportSections[s].data) {
                let row = aReportSections[s].data[x];
                if (aOptions.indexOf(row[field]) === -1) {
                    aOptions.push(row[field]);
                }
            }
        }

        aOptions.sort();

        let nIndex = 0;
        for (let x in aOptions) {
            sCheckboxes += `<div class="col-3 form-check mb-2">
                                    <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${nIndex}" value="${aOptions[x]}">
                                    <label class="form-check-label" for="chk${this.id}_${nIndex}">
                                        ${aOptions[x]}
                                    </label>
                                </div>`;
            nIndex++;
        }

        return sCheckboxes;

    }

    /**
     * Returns criteria select value(s)
     * @returns array
     */
    getValue() {

        let values = [];
        $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"]').each(function () {
            if ($(this).prop('checked')) {
                values.push($(this).val());
            }
        });

        return values;
    }

    /**
     * Sets value for criteria
     * @param {*} v 
     */
    setValue(v) {
        $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"]').prop('checked', false);
        if (Array.isArray(v)) {
            for (let x in v) {
                $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"][value="' + v[x] + '"]').prop('checked', true);
            }
        }
    }

}
window.__Metadocx.CheckboxCriteria = CheckboxCriteria;