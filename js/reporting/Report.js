/** 
 * Report
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Report {

    constructor() {

        /**
         * Report id
         */
        this.id = null;

        /**
         * Indicates if report is loaded or not
         */
        this.isLoaded = false;

        /**
         * Report definition object
         */
        this._reportDefinition = null;


        /**
         * Reference to Metadocx app
         */
        this.app = null;

        /**
         * Indicates if we rendered the report criteria html and js
         */
        this._reportCriteriasRendered = false;

        /**
         * Indicates if we rendered the report settings html and js
         */
        this._reportSettingsRendered = false;

        /**
         * Copy of initial criteria values
         */
        this._initialCriteriaValues = null;

        /**
         * Copy of initial report settings
         */
        this._initialReportSettings = null;

        /**
         * Event called when report is loaded on screen
         */
        this.onReportLoaded = null;

        /**
         * Event called when report definition file is loaded
         */
        this.onReportDefinitionFileLoaded = null;

    }

    /**
     * Set report unique id
     * @param {*} id 
     * @returns 
     */
    setId(id) {
        this.id = id;
        return this;
    }

    /**
     * Returns report unique id
     * @returns 
     */
    getId() {
        return this.id;
    }

    /**
    * Loads report definition file
    */
    loadReportDefinition(reportDefinitionUrl) {

        if (reportDefinitionUrl != undefined) {
            this._reportDefinitionUrl = reportDefinitionUrl;
        }

        console.log('Report definition file is ' + this._reportDefinitionUrl);

        if (this._reportDefinition === null) {
            $.get(this._reportDefinitionUrl, (data, status) => {
                this._reportDefinition = data;
                /**
                 * Copy Report definition options to viewer options, replaces default values
                 */
                this.app.modules.DataType.copyObjectProperties(this.getReportDefinition().options, this.app.viewer.options);

                if (this.onReportDefinitionFileLoaded) {
                    this.onReportDefinitionFileLoaded();
                }
            });
        } else {
            if (this.onReportDefinitionFileLoaded) {
                this.onReportDefinitionFileLoaded();
            }
        }

    }

    /**
     * Returns select options for paper sizes
     * @returns 
     */
    getPaperSizeOptions() {
        var s = '';
        for (var x in this.pageSizes) {
            s += '<option value="' + this.pageSizes[x].name + '">' + this.pageSizes[x].name + '</option>';
        }
        return s;
    }



    /**
     * Report definition object
     * @returns ReportDefinition
     */
    getReportDefinition() {
        return this._reportDefinition;
    }

    /**
     * Report definition url
     * @returns Report
     */
    setReportDefinitionUrl(reportDefinitionUrl) {
        this._reportDefinitionUrl = reportDefinitionUrl;
        return this;
    }

    /**
     * Returns report file definition url
     * @returns 
     */
    getReportDefinitionUrl() {
        return this._reportDefinitionUrl;
    }

    /**
     * Prints report
     */
    print() {
        if (this.app.viewer.options.printing.method == 'browser') {
            // Use default browser print 
            window.print();
        } else if (this.app.viewer.options.printing.method == 'pdf') {
            // Export as pdf and print the pdf file
            this.app.modules.PDF.print();
        }
    }

    /**
     * Close window if window was open by script
     */
    close() {
        window.close();
    }

    /**
     * Export / Convert report to a specific format
     * @param {*} format 
     */
    exportReport(format) {
        this.app.modules[format].showExportDialog();
    }

    /**
     * Renders report settings html
     * @returns 
     */
    renderReportSettings() {

        if (this._reportSettingsRendered) {
            return;
        }

        var s = '';

        s += `<div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0">Report properties</h4>
                </div>
                <div class="card-body">     
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsName">Name</label>
                        <input class="form-control" type="text" id="reportSettingsName" placeholder="Report name" value="${this.getReportDefinition().properties.name}">
                    </div> 
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsDescription">Description</label>
                        <input class="form-control" type="text" id="reportSettingsDescription" placeholder="Report description" value="${this.getReportDefinition().properties.description}">                        
                    </div> 
                </div>
            </div>`;

        for (var kSection in this.getReportDefinition().sections) {
            var oSection = this.getReportDefinition().sections[kSection];
            var sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            var sFields = '<table id="' + oSection.id + '_fields" class="table table-condensed report-sortable">';
            sFields += '<tbody>';
            for (var x in oSection.model) {

                var sFieldSelected = ' checked';
                if (!oReportSection.isColumnVisible(oSection.model[x].name)) {
                    sFieldSelected = '';
                }

                sFields += `<tr data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                    <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                    <td style="width:30px;text-align:center;"><input id="${oSection.id}_field_${oSection.model[x].name}" type="checkbox"${sFieldSelected}/></td>
                    <td id="${oSection.id}_label_${oSection.model[x].name}">${oSection.model[x].label}</td>
                    <td style="width:150px;">
                        <select id="${oSection.id}_formula_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                            <option value=""${(oSection.model[x].formula == '' ? ' selected' : '')}>(None)</option>
                            <option value="SUM"${(oSection.model[x].formula == 'SUM' ? ' selected' : '')}>Sum</option>
                            <option value="AVG"${(oSection.model[x].formula == 'AVG' ? ' selected' : '')}>Average</option>
                            <option value="MIN"${(oSection.model[x].formula == 'MIN' ? ' selected' : '')}>Min Value</option>
                            <option value="MAX"${(oSection.model[x].formula == 'MAX' ? ' selected' : '')}>Max Value</option>
                            <option value="COUNT"${(oSection.model[x].formula == 'COUNT' ? ' selected' : '')}>Count</option>
                        </select>
                    </td>
                    <td style="width:30px;">
                        <button class="btn btn-sm" onClick="Metadocx.viewer.showFieldPropertiesDialog('${oSection.id}', '${oSection.model[x].name}');"><i class="uil uil-ellipsis-h fs20"></i></button>
                    </td>
                </tr>`;
            }
            sFields += '</tbody>';
            sFields += '</table>';

            /**
             * ORDER BY 
             */
            var sOrderBy = '<table id="' + oSection.id + '_orderBy" class="table table-condensed report-sortable">';
            sOrderBy += '<tbody>';
            for (var x in oSection.model) {


                var oOrderBy = oReportSection.getOrderBy(oSection.model[x].name);

                var sAscSelected = '';
                var sDescSelected = '';
                var sOrderBySelected = '';
                if (oOrderBy != null) {
                    if (oOrderBy.order == 'desc') {
                        sAscSelected = '';
                        sDescSelected = ' selected';
                    } else {
                        sAscSelected = ' selected';
                        sDescSelected = '';
                    }
                    sOrderBySelected = ' checked';
                }

                sOrderBy += `<tr id="${oSection.id}_orderByRow_${oSection.model[x].name}" data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                                <td style="width:30px;text-align:center;"><input id="${oSection.id}_orderBy_${oSection.model[x].name}" type="checkbox"${sOrderBySelected}/></td>
                                <td>${oSection.model[x].label}</td>
                                <td style="width:150px;">
                                    <select id="${oSection.id}_orderByOrder_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                                        <option value="asc"${sAscSelected}>Ascending</option>
                                        <option value="desc"${sDescSelected}>Descending</option>                                    
                                    </select>
                                </td>
                            </tr>`;
            }
            sOrderBy += '</tbody>';
            sOrderBy += '</table>';

            /**
             * GROUP BY 
             */
            var sGroupBy = '<table id="' + oSection.id + '_groupBy" class="table table-condensed report-sortable">';
            sGroupBy += '<tbody>';
            for (var x in oSection.model) {

                var oGroupBy = oReportSection.getGroupBy(oSection.model[x].name);

                var sAscSelected = '';
                var sDescSelected = '';
                var sGroupBySelected = '';
                if (oGroupBy !== null) {
                    if (oGroupBy.order == 'desc') {
                        sAscSelected = '';
                        sDescSelected = ' selected';
                    } else {
                        sAscSelected = ' selected';
                        sDescSelected = '';
                    }
                    sGroupBySelected = ' checked';
                }

                sGroupBy += `<tr id="${oSection.id}_groupByRow_${oSection.model[x].name}" data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                                <td style="width:30px;text-align:center;"><input id="${oSection.id}_groupBy_${oSection.model[x].name}" type="checkbox"${sGroupBySelected}/></td>
                                <td>${oSection.model[x].label}</td>
                                <td style="width:150px;">
                                <select id="${oSection.id}_groupByOrder_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                                    <option value="asc"${sAscSelected}>Ascending</option>
                                    <option value="desc"${sDescSelected}>Descending</option>                                    
                                </select></td>
                            </tr>`;
            }
            sGroupBy += '</tbody>';
            sGroupBy += '</table>';

            /**
             * Main section card
             */
            s += `<div class="card">
                            <div class="card-header">
                                <h4 class="card-title mb-0">${oSection.properties.name}</h4>
                            </div>
                            <div class="card-body">              
                                <div class="accordion accordion-flush" id="reportSettingsAccordion${oSection.properties.name}">
                                    <div class="accordion-item">
                                        <h2 id="settingsFieldsHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsFieldsBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-columns fs20"></i>&nbsp;Fields
                                            </button>
                                        </h2>
                                        <div id="settingsFieldsBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sFields}
                                            </div>
                                        </div>
                                    </div>   
                                    
                                    <div class="accordion-item">
                                        <h2 id="settingsOrderByHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsOrderByBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-sort-amount-down fs20"></i>&nbsp;Order
                                            </button>
                                        </h2>
                                        <div id="settingsOrderByBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sOrderBy}
                                            </div>
                                        </div>
                                    </div>   

                                    <div class="accordion-item">
                                        <h2 id="settingsGroupByHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsGroupByBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-layer-group fs20"></i>&nbsp;Groups
                                            </button>
                                        </h2>
                                        <div id="settingsGroupByBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sGroupBy}                             
                                            </div>
                                        </div>
                                    </div>   
                                </div>                                                                                                             
                            </div>
                        </div>`;


        }

        s += `
        <div class="float-end">
            <button class="btn btn-secondary mr5" onClick="Metadocx.viewer.cancelSettings();">Cancel</button>
            <button class="btn btn-primary" onClick="Metadocx.viewer.applySettings();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;Apply Settings</button>
        </div>
       `;

        $('#' + this.id + '_reportSettingsZone').html(s);
        $('.report-sortable tbody').sortable({
            placeholder: 'ui-state-highlight',
            helper: 'clone',
            update: function (e, ui) {
                console.log(e);
                console.log(ui);
            },
        });


        for (var kSection in this.getReportDefinition().sections) {

            var oSection = this.getReportDefinition().sections[kSection];
            var oReportSection = new ReportSection(this.app, this, oSection);

            /**
             * Reorder table rows based on orderby and groupby config
             */
            var reversedKeys = Object.keys(oSection.orderBy).reverse();
            reversedKeys.forEach(key => {
                //console.log(key, oSection.orderBy[key]);                
                $('#' + oSection.id + '_orderByRow_' + oSection.orderBy[key].name).prependTo('#' + oSection.id + '_orderBy');
            });


            /**
             * Reorder table rows based on orderby and groupby config
             */
            reversedKeys = Object.keys(oSection.groupBy).reverse();
            reversedKeys.forEach(key => {
                //console.log(key, oSection.orderBy[key]);                
                $('#' + oSection.id + '_groupByRow_' + oSection.groupBy[key].name).prependTo('#' + oSection.id + '_groupBy');
            });
        }

        this._reportSettingsRendered = true;

    }

    /**
     * Renders report criteria controls HTML
     * @returns string
     */
    renderReportCriterias() {


        if (this._reportCriteriasRendered) {
            return;
        }

        // $('#criteriaDetails_Department').collapse('show')
        // $('#criteriaDetails_Department').collapse('hide')

        var sCriterias = '';
        var aCriterias = [];
        for (var x in this.getReportDefinition().criterias) {

            var oCriteria = new window.__Metadocx[this.getReportDefinition().criterias[x].type](this.app);
            oCriteria.id = this.getReportDefinition().criterias[x].id;
            oCriteria.reportCriteria = this.getReportDefinition().criterias[x];
            aCriterias.push(oCriteria);

            sCriterias += `<div class="accordion-item">
                            <h2 id="criteriaTitle${this.getReportDefinition().criterias[x].id}" class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#criteriaDetails_${this.getReportDefinition().criterias[x].id}" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div class="form-check form-switch form-switch-lg">
                                        <input class="form-check-input" type="checkbox" role="switch" id="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">
                                        <label class="form-check-label" for="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">&nbsp;</label>
                                    </div>                                
                                    ${this.getReportDefinition().criterias[x].name}
                                </button>
                            </h2>
                            <div id="criteriaDetails_${this.getReportDefinition().criterias[x].id}" class="accordion-collapse collapse" aria-labelledby="criteriaTitle${this.getReportDefinition().criterias[x].id}">
                                <div class="accordion-body">                                    
                                    <p>${this.getReportDefinition().criterias[x].description}</p>
                                    ${oCriteria.render()}                                    
                                </div>
                            </div>
                        </div>`;
        }

        var s = `<div class="accordion accordion-flush" id="reportCriteriaAccordion">
                  ${sCriterias}  
                </div>`;

        $('#' + this.id + '_criteriasBody').html(s);

        /**
         * Load JS code for components
         */
        for (var x in aCriterias) {
            aCriterias[x].initializeJS();
        }
        this.app.viewer.criterias = aCriterias;

        this._reportCriteriasRendered = true;


    }


    /**
     * Applies criteria values to report
     */
    applyCriterias() {

        this.hideReportCriterias();
        this.app.viewer.refreshReport();
    }

    /**
     * Displays report criteria section
     */
    showReportCriterias() {

        this._initialCriteriaValues = this.app.viewer.getCriteriaValues();

        $('#' + this.id + '_canvas').hide();
        $('#' + this.id + '_criteriasZone').show();
    }

    /**
     * Hides report criteria section
     */
    hideReportCriterias() {

        $('#' + this.id + '_criteriasZone').hide();
        $('#' + this.id + '_canvas').show();
    }

    /**
     * Cancels report criterias, does not apply changes
     */
    cancelCriterias() {
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.viewer.getCriteriaValues())) {
            // Criteria values have changed, confirm?
            // @todo reset criterias
        }

        this.hideReportCriterias();
    }

    /**
     * Reset criteria values to original values
     */
    resetCriterias() {
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.viewer.getCriteriaValues())) {
            // Criteria values have changed, confirm?
            // @todo reset criterias
        }

        this.hideReportCriterias();
    }

    /**
     * Makes a copy of original settings and criteria values
     * Used to reset properties of report
     */
    copyOriginalSettings() {
        this._initialCriteriaValues = this.app.viewer.getCriteriaValues();
        this._initialReportSettings = {
            sections: [],
        }
        for (var x in this.getReportDefinition().sections) {
            var oSection = this.getReportDefinition().sections[x];
            this._initialReportSettings['sections'] = {
                id: oSection.id,
                properties: JSON.parse(JSON.stringify(oSection.properties)),
                orderBy: JSON.parse(JSON.stringify(oSection.orderBy)),
                groupBy: JSON.parse(JSON.stringify(oSection.groupBy)),
                model: JSON.parse(JSON.stringify(oSection.model)),
            }
        }
    }

    getReportSections() {

        return this.getReportDefinition().sections;

    }

    getReportSection(id) {

        for (var x in this.getReportDefinition().sections) {
            if (this.getReportDefinition().sections[x].id == id) {
                return this.getReportDefinition().sections[x];
            }
        }

        return null;

    }




}