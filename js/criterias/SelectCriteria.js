/** 
 * SelectCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class SelectCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = {};
    }

    initializeJS() {

        if (!Array.isArray(this.reportCriteria.options)) {
            if (this.reportCriteria.options.source = 'ajax' && this.reportCriteria.options.url) {
                this.reportCriteria.parameters.ajax = {
                    url: this.reportCriteria.options.url,
                    dataType: 'json'
                };
            }
        }

        this._instance = $('#' + this.id).select2(this.reportCriteria.parameters);
        $('#' + this.id).val(null).trigger("change");
    }

    render() {

        var sOptionTags = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (var x in this.reportCriteria.options) {
                sOptionTags += `<option value="${this.reportCriteria.options[x].id}">${this.reportCriteria.options[x].text}</option>`;
            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sOptionTags = this.buildOptionTagsFromReportData(this.reportCriteria.options.field);
            } else if (this.reportCriteria.options.source == 'ajax') {

            }

        }



        return `<div class="mb-3">
                    <label class="form-label" for="${this.id}">
                        ${this.reportCriteria.name}
                    </label>            
                    <select id="${this.id}" class="form-control">
                        ${sOptionTags}
                    </select>                    
                </div>`;
    }

    getValue() {
        return this._instance.select2('data');
    }

    buildOptionTagsFromReportData(field) {
        var sOptionTags = '';
        var aOptions = [];
        var aReportSections = this.app.viewer.report.getReportSections();
        for (var s in aReportSections) {
            for (var x in aReportSections[s].data) {
                var row = aReportSections[s].data[x];
                if (aOptions.indexOf(row[field]) === -1) {
                    aOptions.push(row[field]);
                }
            }
        }

        aOptions.sort();

        for (var x in aOptions) {
            sOptionTags += `<option value="${aOptions[x]}">${aOptions[x]}</option>`;
        }

        return sOptionTags;

    }



}
window.__Metadocx.SelectCriteria = SelectCriteria;