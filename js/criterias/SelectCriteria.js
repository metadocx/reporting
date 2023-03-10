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

        super.initializeJS();

        var thisObject = this;

        if (!Array.isArray(this.reportCriteria.options)) {
            if (this.reportCriteria.options.source = 'ajax' && this.reportCriteria.options.url) {
                this.reportCriteria.parameters.ajax = {
                    url: this.reportCriteria.options.url,
                    dataType: 'json',
                    data: function (params) {
                        var data = {};
                        for (var x in params) {
                            data[x] = params[x];
                        }
                        data['locale'] = thisObject.app.modules.Locale.getCurrentLocale();
                        if (thisObject.getParentCriteria() != null) {

                            data['parent'] = thisObject.getParentCriteria().getValue().map(function (row) {
                                return {
                                    id: row.id,
                                    text: row.text
                                }
                            }
                            );
                        }

                        return data;
                    }

                };
            }
        }

        this._instance = $('#' + this.id).select2(this.reportCriteria.parameters);
        this._instance.on('change', function () {
            if (thisObject.resetChildCriteriaOnChange) {
                for (var x in thisObject.getChildCriterias()) {
                    // Reset child criterias
                    thisObject.getChildCriterias()[x].setValue(null);
                }
            }

            if (thisObject.getValue().length > 0) {
                $('#criteriaEnabled_' + thisObject.id).prop('checked', true);
            } else {
                $('#criteriaEnabled_' + thisObject.id).prop('checked', false);
            }


        });
        $('#' + this.id).val(null).trigger("change");
    }

    render() {

        let sOptionTags = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (let x in this.reportCriteria.options) {
                sOptionTags += `<option value="${this.reportCriteria.options[x].id}">${this.reportCriteria.options[x].text}</option>`;
            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sOptionTags = this.buildOptionTagsFromReportData(this.reportCriteria.options.field);
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

    setValue(v) {
        $('#' + this.id).val(v).trigger('change');
    }

    buildOptionTagsFromReportData(field) {
        let sOptionTags = '';
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

        for (let x in aOptions) {
            sOptionTags += `<option value="${aOptions[x]}">${aOptions[x]}</option>`;
        }

        return sOptionTags;

    }



}
window.__Metadocx.SelectCriteria = SelectCriteria;