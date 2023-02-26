/** 
 * Report
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Report extends Consolable {

    constructor(app) {

        super(app);

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

        /**
         * Instance of the report definition file validator
         */
        this._reportValidator = null;

        /**
         * List of loads events that must be completed before report is considered loaded
         */
        this._loadEvents = {};

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

    addLoadEvent(name) {
        this.log('Load event :: ' + name);
        this._loadEvents[name] = false;
    }

    setLoadEventCompleted(name) {
        this.log('Load event :: ' + name + ' completed');
        this._loadEvents[name] = true;
        if (this.checkIfReportIsLoaded()) {
            this.app.modules.Console.log('Report is loaded, calling onReportLoaded');
            if (this.onReportLoaded !== null) {
                this.onReportLoaded();
            }
        }
    }

    checkIfReportIsLoaded() {
        for (let x in this._loadEvents) {
            if (this._loadEvents[x] == false) {
                return false;
            }
        }
        return true;
    }

    /**
    * Loads report definition file
    */
    loadReportDefinition(reportDefinitionUrl) {

        this.addLoadEvent('loadReportDefinition');

        if (reportDefinitionUrl != undefined) {
            this._reportDefinitionUrl = reportDefinitionUrl;
        }

        if (this._reportDefinition === null) {
            $.get(this._reportDefinitionUrl, (data, status) => {
                this._reportDefinition = data;
                /**
                 * Copy Report definition options to viewer options, replaces default values
                 */
                this.validateReportDefinitionFile();
                this.app.modules.DataType.copyObjectProperties(this.getReportDefinition().options, this.app.viewer.options);


                if (this.onReportDefinitionFileLoaded) {
                    this.onReportDefinitionFileLoaded();
                }
                this.setLoadEventCompleted('loadReportDefinition');

            });
        } else {

            if (this.onReportDefinitionFileLoaded) {
                this.onReportDefinitionFileLoaded();
            }
            this.setLoadEventCompleted('loadReportDefinition');
        }

    }

    validateReportDefinitionFile() {
        console.group('[Metadocx] Validating report definition file');
        if (this._reportValidator === null) {
            this._reportValidator = new ReportValidator(this.app);
        }
        this._reportValidator.validate(this._reportDefinition);
        console.groupEnd();
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

        let s = '';

        s += `<div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0" data-locale="ReportProperties">Report properties</h4>
                </div>
                <div class="card-body">     
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsName" data-locale="Name">Name</label>
                        <input class="form-control" type="text" id="reportSettingsName" placeholder="Report name" value="${this.getReportDefinition().properties.name}" data-locale="ReportName">
                    </div> 
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsDescription" data-locale="Description">Description</label>
                        <input class="form-control" type="text" id="reportSettingsDescription" placeholder="Report description" value="${this.getReportDefinition().properties.description}" data-locale="ReportDescription">                        
                    </div> 
                </div>
            </div>`;

        for (let kSection in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[kSection];
            let sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            switch (oSection.type) {
                case 'HTML':
                    s += this.renderReportSettingsHTML(oSection, oReportSection);
                    break;
                case 'Chart':
                    s += this.renderReportSettingsChart(oSection, oReportSection);
                    break;
                case 'DataTable':
                    s += this.renderReportSettingsDataTable(oSection, oReportSection);
                    break;
            }

        }

        s += `
        <div class="float-end">
            <button class="btn btn-secondary mr5" onClick="Metadocx.viewer.cancelSettings();" data-locale="Cancel">Cancel</button>
            <button class="btn btn-primary" onClick="Metadocx.viewer.applySettings();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;<span data-locale="ApplySettings">Apply Settings</span></button>
        </div>
        `;

        $('#' + this.id + '_reportSettingsZone').html(s);

        /**
         * Once html is inserted in report viewer call post render
         */
        for (let kSection in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[kSection];
            let sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            switch (oSection.type) {
                case 'HTML':
                    this.postRenderReportSettingsHTML(oSection, oReportSection);
                    break;
                case 'Chart':
                    this.postRenderReportSettingsChart(oSection, oReportSection);
                    break;
                case 'DataTable':
                    this.postRenderSettingsDataTable(oSection, oReportSection);
                    break;
            }

        }


        this._reportSettingsRendered = true;

    }



    renderReportSettingsHTML(oSection, oReportSection) { return ''; }

    postRenderReportSettingsHTML(oSection, oReportSection) { }

    renderReportSettingsChart(oSection, oReportSection) { return ''; }

    postRenderReportSettingsChart(oSection, oReportSection) { }

    renderReportSettingsDataTable(oSection, oReportSection) {

        let s = '';
        let sFields = '<table id="' + oSection.id + '_fields" class="table table-condensed report-sortable">';
        sFields += '<tbody>';
        for (let x in oSection.model) {

            let sFieldSelected = ' checked';
            if (!oReportSection.isColumnVisible(oSection.model[x].name)) {
                sFieldSelected = '';
            }

            sFields += `<tr data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                <td style="width:30px;text-align:center;"><input id="${oSection.id}_field_${oSection.model[x].name}" type="checkbox"${sFieldSelected}/></td>
                <td id="${oSection.id}_label_${oSection.model[x].name}">${oSection.model[x].label}</td>
                <td style="width:150px;">
                    <select id="${oSection.id}_formula_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                        <option value=""${(oSection.model[x].formula == '' ? ' selected' : '')} data-locale="None">(None)</option>
                        <option value="SUM"${(oSection.model[x].formula == 'SUM' ? ' selected' : '')} data-locale="Sum">Sum</option>
                        <option value="AVG"${(oSection.model[x].formula == 'AVG' ? ' selected' : '')} data-locale="Average">Average</option>
                        <option value="MIN"${(oSection.model[x].formula == 'MIN' ? ' selected' : '')} data-locale="MinValue">Min Value</option>
                        <option value="MAX"${(oSection.model[x].formula == 'MAX' ? ' selected' : '')} data-locale="MaxValue">Max Value</option>
                        <option value="COUNT"${(oSection.model[x].formula == 'COUNT' ? ' selected' : '')} data-locale="Count">Count</option>
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
        let sOrderBy = '<table id="' + oSection.id + '_orderBy" class="table table-condensed report-sortable">';
        sOrderBy += '<tbody>';
        for (let x in oSection.model) {


            let oOrderBy = oReportSection.getOrderBy(oSection.model[x].name);

            let sAscSelected = '';
            let sDescSelected = '';
            let sOrderBySelected = '';
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
                                    <option value="asc"${sAscSelected} data-locale="Ascending">Ascending</option>
                                    <option value="desc"${sDescSelected} data-locale="Descending">Descending</option>                                    
                                </select>
                            </td>
                        </tr>`;
        }
        sOrderBy += '</tbody>';
        sOrderBy += '</table>';

        /**
         * GROUP BY 
         */
        let sGroupBy = '<table id="' + oSection.id + '_groupBy" class="table table-condensed report-sortable">';
        sGroupBy += '<tbody>';
        for (let x in oSection.model) {

            let oGroupBy = oReportSection.getGroupBy(oSection.model[x].name);

            let sAscSelected = '';
            let sDescSelected = '';
            let sGroupBySelected = '';
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
                                <option value="asc"${sAscSelected} data-locale="Ascending">Ascending</option>
                                <option value="desc"${sDescSelected} data-locale="Descending">Descending</option>                                    
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
                                            <i class="uil uil-columns fs20"></i>&nbsp;<span data-locale="Fields">Fields</span>
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
                                            <i class="uil uil-sort-amount-down fs20"></i>&nbsp;<span data-locale="Order">Order</span>
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
                                            <i class="uil uil-layer-group fs20"></i>&nbsp;<span data-locale="Groups">Groups</span>
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


        return s;

    }

    postRenderSettingsDataTable(oSection, oReportSection) {
        $('.report-sortable tbody').sortable({
            placeholder: 'ui-state-highlight',
            helper: 'clone',
            update: function (e, ui) {
                console.log(e);
                console.log(ui);
            },
        });

        /**
         * Reorder table rows based on orderby and groupby config
         */
        let reversedKeys = Object.keys(oSection.orderBy).reverse();
        reversedKeys.forEach(key => {
            $('#' + oSection.id + '_orderByRow_' + oSection.orderBy[key].name).prependTo('#' + oSection.id + '_orderBy');
        });


        /**
         * Reorder table rows based on orderby and groupby config
         */
        reversedKeys = Object.keys(oSection.groupBy).reverse();
        reversedKeys.forEach(key => {
            $('#' + oSection.id + '_groupByRow_' + oSection.groupBy[key].name).prependTo('#' + oSection.id + '_groupBy');
        });
    }


    /**
     * Renders report criteria controls HTML
     * @returns string
     */
    renderReportCriterias() {


        if (this._reportCriteriasRendered) {
            return;
        }

        if (this.app.viewer.options.criterias.automatic) {
            this.createAutomaticCriterias();
        }

        let sCriterias = '';
        let aCriterias = [];
        for (let x in this.getReportDefinition().criterias) {

            let oCriteria = new window.__Metadocx[this.getReportDefinition().criterias[x].type](this.app);
            oCriteria.id = this.getReportDefinition().criterias[x].id;
            oCriteria.reportCriteria = this.getReportDefinition().criterias[x];
            aCriterias.push(oCriteria);

            sCriterias += `<div class="accordion-item">
                            <h2 id="criteriaTitle${this.getReportDefinition().criterias[x].id}" class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#criteriaDetails_${this.getReportDefinition().criterias[x].id}" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div class="form-check form-switch form-switch-lg">
                                        <input class="form-check-input criteria-toggle" type="checkbox" role="switch" data-bs-toggle="collapse" data-bs-target id="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">
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

        let s = `<div class="accordion accordion-flush" id="reportCriteriaAccordion">
                  ${sCriterias}  
                </div>`;

        $('#' + this.id + '_criteriasBody').html(s);

        /**
         * Load JS code for components
         */
        for (let x in aCriterias) {
            aCriterias[x].initializeJS();
        }
        this.app.viewer.criterias = aCriterias;

        // Set parent and child components
        for (let x in aCriterias) {
            if (aCriterias[x].reportCriteria.parent) {
                this.app.viewer.getCriteria(aCriterias[x].reportCriteria.parent).addChildCriteria(aCriterias[x]);
            }
        }


        this._reportCriteriasRendered = true;

    }

    /**
     * Analyze model and add criterias for fields based on field data type
     */
    createAutomaticCriterias() {

        let criteriaType

        for (let sectionID in this.getReportDefinition().sections) {

            let oSection = this.getReportDefinition().sections[sectionID];

            if (oSection.type != 'DataTable') {
                continue;
            }

            for (let x in oSection.model) {
                let col = oSection.model[x];

                if (col.automaticCriteria !== undefined && col.automaticCriteria === false) {
                    // Skip automatic criteria for this column
                    continue;
                }

                switch (col.type) {
                    case 'date':

                        criteriaType = 'DatePeriodCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push(
                            {
                                "id": col.name,
                                "name": oSection.properties.name + ' - ' + col.label,
                                "description": "",
                                "type": criteriaType,
                                "defaultValue": null,
                                "isRequired": false,
                                "parameters": {
                                    "locale": {
                                        "format": "YYYY-MM-DD",
                                        "separator": " / "
                                    },
                                    "alwaysShowCalendars": true
                                },
                                "applyTo": [
                                    { "section": oSection.id, "field": col.name }
                                ]
                            }
                        );

                        break;
                    case 'number':

                        criteriaType = 'NumericCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });

                        break;
                    case 'boolean':

                        criteriaType = 'BooleanCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });
                        break;
                    case 'string':

                        criteriaType = 'SelectCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }


                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                                "multiple": true,
                                "allowClear": true,
                                "placeholder": "",
                                "closeOnSelect": true
                            },
                            "options": {
                                "source": "data",
                                "field": col.name
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });

                        break;
                }

            }
        }

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
        for (let x in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[x];
            switch (oSection.type) {
                case 'HTML':
                    break;
                case 'Chart':
                    break;
                case 'DataTable':
                    this._initialReportSettings['sections'].push({
                        id: oSection.id,
                        properties: JSON.parse(JSON.stringify(oSection.properties)),
                        orderBy: JSON.parse(JSON.stringify(oSection.orderBy)),
                        groupBy: JSON.parse(JSON.stringify(oSection.groupBy)),
                        model: JSON.parse(JSON.stringify(oSection.model)),
                    })
                    break;
            }


        }
    }

    getReportSections() {

        return this.getReportDefinition().sections;

    }

    getReportSection(id) {

        for (let x in this.getReportDefinition().sections) {
            if (this.getReportDefinition().sections[x].id == id) {
                return this.getReportDefinition().sections[x];
            }
        }

        return null;

    }

    /**
     * Filter all report section data 
     */
    filter() {

        for (let x in this.getReportDefinition().sections) {
            let oFilter = new DataFilter(this.app);
            oFilter.setReportSection(this.getReportDefinition().sections[x]);
            oFilter.process();
        }

    }

    sort() {
        for (let x in this.getReportDefinition().sections) {
            let oSorter = new DataSorter(this.app);
            oSorter.setReportSection(this.getReportDefinition().sections[x]);
            oSorter.process();
        }
    }


    save() {

        if ($('#newOption').prop('checked')) {
            // Create new report

            if ($('#saveReportName').val().trim() == '') {
                return;
            }

            let reportUID = this.app.modules.DataType.uid();
            this.app.modules.DB.saveReport({
                reportId: this.getReportDefinition().id,
                reportUID: reportUID,
                metadocxVersion: this.app.version,
                creationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                name: $('#saveReportName').val(),
                criteriaValues: Metadocx.viewer.getCriteriaValues()
            }, () => {
                this.app.viewer.showToastMessage('Report saved');
            });
            this.app.viewer.currentSavedReport = reportUID;
            this.app.viewer.updateUI();
            this.app.viewer.saveDialog.hide();


        } else {
            // Save as or replace existing report
            let reportUID = $('#savedReports').val();
            this.app.modules.DB.updateReport({
                reportId: this.getReportDefinition().id,
                reportUID: reportUID,
                metadocxVersion: this.app.version,
                creationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                name: $("#savedReports option:selected").text(),
                criteriaValues: Metadocx.viewer.getCriteriaValues()
            }, (report) => {
                this.app.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportSaved') + ' - ' + report.name);
            });
            this.app.viewer.currentSavedReport = reportUID;
            this.app.viewer.updateUI();
            this.app.viewer.saveDialog.hide();

        }


    }

    /**
     * Open a saved report
     */
    open() {
        this.app.modules.DB.getReport($('#savedReports').val(), (report) => {

            if (report == null) {
                return;
            }
            this.app.viewer.setCriteriaValues(report.criteriaValues);
            this.app.viewer.currentSavedReport = report.reportUID;
            this.app.viewer.saveDialog.hide();
            this.app.viewer.updateUI();
            this.app.viewer.refreshReport();
            this.app.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportOpened') + ' - ' + report.name);

        });
    }

    delete() {

        if (this.app.viewer.currentSavedReport === null) {
            return;
        }

        bootbox.confirm({
            message: this.app.modules.Locale.getKey('DeleteReport'),
            title: this.app.modules.Locale.getKey('Delete'),
            callback: (result) => {
                if (result) {
                    // Delete the report
                    this.app.modules.DB.deleteReport(this.app.viewer.currentSavedReport,
                        (reportUID) => {
                            this.app.viewer.currentSavedReport = null;
                            this.app.viewer.updateUI();
                            this.app.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportDeleted'));
                        });
                }
            }
        });
    }


}