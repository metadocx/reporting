/** 
 * ReportViewer, renders report viewer UI interface 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportViewer extends Consolable {

    constructor(app) {
        super();
        /**
         * Report criterias
         */
        this.criterias = null;
        /**
         * Initial criteria values on load
         */
        this.originalCriteriaValues = null;
        /**
         * Reference to main app
         */
        this.app = app;
        /**
         * Report viewer options
         */
        this.options = null;
        /**
         * Option Proxy instance
         */
        this._optionsProxy = null;
        /**
         * Options dialog instance 
         */
        this.optionsDialog = null;
        /**
         * Field properties dialog instance 
         */
        this.fieldPropertiesDialog = null;
        /**
         * Settings offcanvas reference
         */
        this.settingsOffCanvas = null;
        /**
         * 
         */
        this._bDisableApplyReportViewerOptions = false;

        /**
         * Report instance displayed in report viewer
         */
        this.report = new Report();

        /**
         * Initialize options with default options
         */
        this.loadDefaultOptions();

    }

    /**
     * Load report default options
     */
    loadDefaultOptions() {

        this.log('Loading default options');

        this.options = {
            "id": "metadocxReport",
            "locale": "en",
            "toolbar": {
                "showLocaleButton": true,
                "showOptionsButton": true,
                "showSettingsButton": true,
                "showCriteriasButton": true,
                "showPrintButton": true,
                "showExportButton": true,
                "showCloseButton": true
            },
            "exportFormats": {
                "pdf": true,
                "word": false,
                "excel": false
            },
            "page": {
                "orientation": "portrait",
                "paperSize": "Letter",
                "margins": {
                    "top": 0.5,
                    "bottom": 0.5,
                    "left": 0.5,
                    "right": 0.5
                }
            },
            "additionalCSS": "",
            "coverPage": {
                "enabled": false,
                "template": "CoverPage1"
            },
            "settings": {
                "fields": true,
                "fieldsReorder": true,
                "fieldsSelection": true,
                "fieldsFormula": true,

                "orderBy": true,
                "orderByReorder": true,
                "orderBySelection": true,
                "orderByOrder": true,

                "groupBy": true,
                "groupByReorder": true,
                "groupBySelection": true,
                "groupByOrder": true
            },
            "formats": {
                "date": {
                    "format": "YYYY-MM-DD"
                },
                "boolean": {
                    "format": {
                        "trueValue": "Yes",
                        "falseValue": "No",
                        "ALL": "All"
                    }
                },
                "number": {
                    "format": "0.00"
                }
            },
            "printing": {
                "method": "pdf"
            }
        };

        this.options = new Proxy(this.options, ProxyHandler);

    }

    /**
     * Loads a report definition file
     */
    load(reportDefinitionUrl) {

        /**
         * If we have a report definition file passed as parameter, load it and render
         */
        if (reportDefinitionUrl) {
            this.log('Loading report ' + reportDefinitionUrl);
            /**
             * Create report object
             */
            if (this.report === null) {
                this.report = new Report();
            }
            this.report.app = this.app;

            window[this.options.id] = this.report;
            this.report.setId(this.options.id);

            this.report.onReportLoaded = () => {
                this.applyReportViewerOptions();
            }

            this.report.onReportDefinitionFileLoaded = () => {
                this.refreshReport();
            }

            this.report.loadReportDefinition(reportDefinitionUrl);
            this.applyReportViewerOptions();
            this.originalCriteriaValues = this.getCriteriaValues();

        }

    }


    applyReportViewerOptions() {

        if (this._bDisableApplyReportViewerOptions) {
            return;
        }

        if (!this.report.isLoaded) {
            // Report is not yet loaded hide all toolbar buttons
            $('.report-toolbar-button').hide();
            return;
        }

        this.app.modules.Locale.setLocale(this.options.locale);


        $('#' + this.options.id + '_headerName').html(this.report.getReportDefinition().properties.name);
        $('#' + this.options.id + '_headerDescription').html(this.report.getReportDefinition().properties.description);

        $('.report-toolbar-button').show();

        if (this.options.toolbar.showLocaleButton) {
            $('#' + this.options.id + '_localeGroup').show();
        } else {
            $('#' + this.options.id + '_localeGroup').hide();
        }

        if (this.options.toolbar.showExportButton) {
            $('#' + this.options.id + '_export').show();
        } else {
            $('#' + this.options.id + '_export').hide();
        }

        if (this.options.toolbar.showExportButton) {
            $('#' + this.options.id + '_export').show();
        } else {
            $('#' + this.options.id + '_export').hide();
        }

        if (this.options.toolbar.showPrintButton) {
            $('#' + this.options.id + '_print').show();
        } else {
            $('#' + this.options.id + '_print').hide();
        }

        if (this.options.toolbar.showCriteriasButton) {
            $('#' + this.options.id + '_criterias').show();
        } else {
            $('#' + this.options.id + '_criterias').hide();
        }

        if (this.options.toolbar.showSettingsButton) {
            $('#' + this.options.id + '_settings').show();
        } else {
            $('#' + this.options.id + '_settings').hide();
        }

        if (this.options.toolbar.showOptionsButton) {
            $('#' + this.options.id + '_options').show();
        } else {
            $('#' + this.options.id + '_options').hide();
        }

        if (this.options.toolbar.showCloseButton && window.opener != null) {
            $('#' + this.options.id + '_close').show();
        } else {
            $('#' + this.options.id + '_close').hide();
        }



    }

    /**
     * Renders the report viewer
     */
    render() {
        this.log('Report viewer render');
        var s = '';

        s += this.renderMainLayout();
        s += this.renderReportCriterias();
        s += this.renderOptionsDialog();
        s += this.renderReportSettings();
        s += this.renderFieldPropertiesDialog();

        $('#' + this.options.container).html(s);
        $('.report-viewer-criterias').hide();

        this.app.modules.Locale.translate();

    }

    /**
     * Displays info section when no report definition file is supplied
     */
    showNoReportAlert() {

        this.log('No report data, displaying no report warning');
        var s = `<div class="alert alert-warning mb-0 report-no-definition" role="alert">
                    <h4 class="alert-heading" data-locale="MissingReportDefinition">Missing report definition</h4>
                    <p data-locale="OupsNoReport">Oups! Something went wrong. We did not get a report to load.</p>                    
                </div>`;

        $('#' + this.app.viewer.options.id + '_canvas').html(s);
        $('.report-toolbar-button').hide();
    }

    /**
     * Renders main layout html of report viewer
     * @returns 
     */
    renderMainLayout() {

        this.log('Render main layout');
        var sCloseButtonClasses = '';
        if (window.opener == null) {
            // This window is not open by script can not use close button
            sCloseButtonClasses = ' hidden';
        }

        var sExportPDFClasses = '';
        if (!this.options.exportFormats.pdf) {
            sExportPDFClasses = ' hidden';
        }
        var sExportWordClasses = '';
        if (!this.options.exportFormats.word) {
            sExportWordClasses = ' hidden';
        }
        var sExportExcelClasses = '';
        if (!this.options.exportFormats.excel) {
            sExportExcelClasses = ' hidden';
        }

        /**
         * Main layout
         */
        return `<header id="${this.options.id}_header" class="page-topbar no-print">
             <div class="navbar-header">
                 <div class="d-flex">
                     <div class="ms-4">
                         <div class="report-header-icon">
                            <i class="uil uil-file-graph" style="font-size: 36px;line-height: 36px;"></i>
                         </div>
                         <div class="report-header-title-section">
                            <div id="${this.options.id}_headerName" class="report-header-title"></div>
                            <div id="${this.options.id}_headerDescription" class="report-header-description"></div>
                         </div>
                     </div>
                 </div>
                 <div class="d-flex">                   
                    <div id="${this.options.id}_localeGroup" class="btn-group me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_locale" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-english-to-chinese"></i>
                         </button>
                         <div id="${this.options.id}_localeOptions" class="dropdown-menu">
                             ${this.app.modules.Locale.getLocaleMenuOptions()}
                         </div>
                     </div>
                     <div class="btn-group me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_export" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-file-export"></i>
                         </button>
                         <div class="dropdown-menu">
                             <a id="${this.options.id}_exportPdf" class="dropdown-item${sExportPDFClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('PDF');">PDF</a>
                             <a id="${this.options.id}_exportExcel" class="dropdown-item${sExportExcelClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('Excel');">Excel</a>
                             <a id="${this.options.id}_exportWord" class="dropdown-item${sExportWordClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('Word');">Word</a>
                         </div>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_print" type="button" class="btn header-item" onClick="Metadocx.viewer.report.print();"><i class="uil uil-print"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_criterias" type="button" class="btn header-item" onClick="Metadocx.viewer.report.showReportCriterias();"><i class="uil uil-filter"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_settings" type="button" class="btn header-item" onClick="Metadocx.viewer.showReportSettings();"><i class="uil uil-file-graph"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_options" type="button" class="btn header-item" onClick="Metadocx.viewer.showReportOptions();"><i class="uil uil-cog"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button${sCloseButtonClasses}">
                         <button id="${this.options.id}_close" type="button" class="btn header-item" onClick="Metadocx.viewer.report.close();"><i class="uil uil-times"></i></button>
                     </div>
                 </div>
             </div>
         </header>
         <div id="${this.options.id}_canvas" class="report-viewer-canvas">
         </div>
         <div class="powered-by no-print"><span data-locale="PoweredBy">powered by</span> <a href="https://www.metadocx.com" target="_blank">Metadocx</a></div>`;

    }

    /**
     * Renders report criteria sections html, criterias will be rendered by the report object
     * @returns 
     */
    renderReportCriterias() {

        this.log('Render report criterias');
        return `<div id="${this.options.id}_criteriasZone" class="report-viewer-criterias">
                    <div class="page-content">
                        <div class="container-fluid">
                            <div class="row">                                
                                <div class="col-12">                                
                                    <div class="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 class="mb-0" data-locale="Criterias">Criterias</h4>
                                        <div class="d-flex">
                                            <button class="btn btn-primary mr5" onClick="Metadocx.viewer.report.applyCriterias();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;<span data-locale="ApplyCriterias">Apply criterias</span></button>
                                            <button class="btn btn-danger mr5" onClick="Metadocx.viewer.report.resetCriterias();" data-locale="Reset">Reset</button>
                                            <button class="btn btn-secondary" onClick="Metadocx.viewer.report.cancelCriterias();" data-locale="Cancel">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div id="${this.options.id}_criteriasBody" class="card-body">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>            
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Render report options dialoag html
     * @returns 
     */
    renderOptionsDialog() {

        /**
         * Options dialog
         */
        this.log('Render report options dialog');

        return `<div id="${this.options.id}_optionsDialog" class="modal" tabindex="-1">
               <div class="modal-dialog">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 class="modal-title" data-locale="Options">Options</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="d-flex justify-content-between">
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="Orientation">Orientation</label>
                             
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationPortrait">
                                     <label class="form-check-label" for="orientationPortrait" data-locale="Portrait">
                                         Portrait
                                     </label>
                                 </div>
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationLandscape">
                                     <label class="form-check-label" for="orientationLandscape" data-locale="Landscape">
                                         Landscape
                                     </label>
                                 </div>
                             </div>
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="PaperSize">Paper size</label>
                                 <select id="paperSize" class="form-select">
                                 ${this.app.modules.Printing.getPaperSizeOptions()}
                                 </select>
                             </div>
                         </div>
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="Margins">Margins</label>
                             
                                 <div class="mb-3 row">
                                     <label for="topMargin" class="col-sm-4 col-form-label" data-locale="Top">Top</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="topMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="bottomMargin" class="col-sm-4 col-form-label" data-locale="Bottom">Bottom</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="bottomMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="leftMargin" class="col-sm-4 col-form-label" data-locale="Left">Left</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="leftMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="rightMargin" class="col-sm-4 col-form-label" data-locale="Right">Right</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="rightMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>                                                    
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal" data-locale="Cancel">Cancel</button>
                     <button type="button" class="btn btn-primary" onClick="Metadocx.viewer.applyOptions();"><i class="fa-solid fa-check"></i>&nbsp;<span data-locale="ApplyOptions">Apply Options</span></button>
                 </div>
                 </div>
             </div>
             </div>`;

    }

    /**
     * Render report field properties dialog html
     * @returns 
     */
    renderFieldPropertiesDialog() {

        /**
         * Field properties dialog
         */
        this.log('Render report field properties dialog');

        return `<div id="${this.options.id}_fieldPropertyDialog" class="modal modal-lg" tabindex="-1" data-backdrop="false">
               <div class="modal-dialog">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 class="modal-title">Properties</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                    <div class="row">
                            <div class="col-6">
                                <div class="mb-3" style="display:none;">
                                <label for="fieldSectionID" class="col-form-label">Section ID</label>                            
                                <input type="text" class="form-control" id="fieldSectionID" readonly value=""/>
                            </div>
                            <div class="mb-3" style="display:none;">
                                <label for="fieldName" class="col-form-label">Name</label>                            
                                <input type="text" class="form-control" id="fieldName" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldLabel" class="col-form-label">Label</label>                            
                                <input type="text" class="form-control" id="fieldLabel" value=""/>                            
                            </div>
                            <div class="mb-3">
                                <label for="fieldWidth" class="col-form-label">Width (px)</label>                            
                                <input type="number" class="form-control" id="fieldWidth" value=""/>                            
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="fieldVisible">
                                <label class="form-check-label" for="fieldVisible">
                                    Is Visible
                                </label>
                            </div>
                        
                        </div>
                        <div class="col-6">
                            
                            <div class="mb-3" style="display:none;">
                                <label for="fieldType" class="col-form-label">Type</label>                            
                                <input type="text" class="form-control" id="fieldType" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldAlign" class="col-form-label">Alignment</label>                            
                                <select id="fieldAlign" class="form-control">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="center">Center</option>
                                </select>
                            </div>

                            <div id="fieldFormula_container" class="mb-3">
                                <label for="fieldFormula" class="col-form-label">Formula</label>                            
                                <select id="fieldFormula" class="form-control">
                                    <option value="">(None)</option>
                                    <option value="SUM">Sum</option>
                                    <option value="AVG">Average</option>
                                    <option value="MIN">Min Value</option>
                                    <option value="MAX">Max Value</option>
                                    <option value="COUNT">Count</option>
                                </select>
                            </div>

                            <div id="fieldFormat_container" class="mb-3">
                                <label for="fieldFormat" class="col-form-label">Format</label>                            
                                <input type="text" class="form-control" id="fieldFormat" value=""/>                            
                            </div>                            
                        
                        </div>
                    </div>    

                     
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
                     <button type="button" class="btn btn-primary" onClick="Metadocx.viewer.applyFieldProperties();"><i class="fa-solid fa-check"></i>&nbsp;Apply Properties</button>
                 </div>
                 </div>
             </div>
             </div>`;

    }

    /**
     * Render report settings offcanvas html
     * @returns 
     */
    renderReportSettings() {

        this.log('Render report settings offcanvas');

        return `<div id="${this.options.id}_settingsOffCanvas" class="offcanvas offcanvas-end report-section-offcanvas" data-bs-backdrop="static" tabindex="-1" aria-labelledby="${this.options.id}_settingsOffCanvasLabel">
                    <div class="offcanvas-header">
                        <h5 id="${this.options.id}_settingsOffCanvasLabel" class="offcanvas-title" data-locale="ReportSettings">Report Settings</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div id="${this.options.id}_reportSettingsZone" class="offcanvas-body">
                        
                    </div>
                </div>`;

    }

    /**
     * Display report options in a modal dialog
     */
    showFieldPropertiesDialog(sectionID, fieldName) {

        if (this.fieldPropertiesDialog === null) {
            this.fieldPropertiesDialog = new bootstrap.Modal('#' + this.options.id + '_fieldPropertyDialog', {})
        }

        var sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        var field = oReportSection.getColumn(fieldName);

        $('#fieldSectionID').val(sectionID);
        $('#fieldName').val(field.name);
        $('#fieldType').val(field.type);
        $('#fieldLabel').val(field.label);

        var bIsVisible = true;
        if (field.visible != undefined) {
            bIsVisible = this.app.modules.DataType.toBool(field.visible);
        }

        $('#fieldVisible').prop('checked', bIsVisible);

        if (field.formula != undefined) {
            $('#fieldFormula').val(field.formula);
        }
        if (field.format != undefined) {
            $('#fieldFormat').val(field.format);
        }
        if (field.width != undefined) {
            $('#fieldWidth').val(field.width);
        }


        if (field.type == 'number') {
            $('#fieldFormula_container').show();
            $('#fieldFormat_container').show();
        } else {
            $('#fieldFormula_container').hide();
            $('#fieldFormat_container').hide();
        }



        this.fieldPropertiesDialog.show();
    }

    applyFieldProperties() {

        var sectionID = $('#fieldSectionID').val();
        var fieldName = $('#fieldName').val();

        var sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        var field = oReportSection.getColumn(fieldName);

        field.label = $('#fieldLabel').val();
        if ($('#fieldWidth').val() != '') {
            field.width = parseInt($('#fieldWidth').val());
        } else {
            field.width = '';
        }
        field.visible = $('#fieldVisible').prop('checked');

        if (field.type == 'number') {
            if ($('#fieldFormula').val() != '') {
                field.formula = $('#fieldFormula').val();
            } else {
                field.formula = '';
            }

            if ($('#fieldFormat').val() != '') {
                field.format = $('#fieldFormat').val();
            } else {
                field.format = '';
            }
        }

        field.align = $('#fieldAlign').val();

        oReportSection.setColumn(fieldName, field);
        this.refreshReportSettings();
        this.refreshReport();

        this.fieldPropertiesDialog.hide();
    }

    /**
     * Returns object of all criteria values
     * @returns 
     */
    getCriteriaValues() {

        var values = {};
        if (this.criterias) {
            for (var x in this.criterias) {
                values[this.criterias[x].id] = {
                    id: this.criterias[x].id,
                    enabled: this.criterias[x].getIsEnabled(),
                    value: this.criterias[x].getValue(),
                }
            }
        }

        return values;
    }

    /**
     * Returns a specific criteria value
     * @param {*} criteria 
     * @returns 
     */
    getCriteriaValue(criteriaName) {
        return this.getCriteriaValues()[criteriaName];
    }

    /**
     * Returns criteria 
     * @param {*} id 
     * @returns 
     */
    getCriteria(id) {
        if (this.criterias) {
            for (var x in this.criterias) {
                if (this.criterias[x].id == id) {
                    return this.criterias[x];
                }
            }
        }
    }

    /**
     * Returns is a specific criteria is enabled or not
     * @param {*} id 
     * @returns 
     */
    isCriteriaEnabled(id) {
        return this.getCriteria(id).getIsEnabled();
    }

    /**
     * Display report options in a modal dialog
     */
    showReportOptions() {

        if (this.optionsDialog === null) {
            this.optionsDialog = new bootstrap.Modal('#' + this.options.id + '_optionsDialog', {})
        }

        if (this.options.page.orientation == 'portrait') {
            $('#orientationPortrait').prop('checked', true);
            $('#orientationLandscape').prop('checked', false);
        } else {
            $('#orientationPortrait').prop('checked', false);
            $('#orientationLandscape').prop('checked', true);
        }

        $('#paperSize').val(this.options.page.paperSize);

        $('#topMargin').val(this.options.page.margins.top);
        $('#bottomMargin').val(this.options.page.margins.bottom);
        $('#leftMargin').val(this.options.page.margins.left);
        $('#rightMargin').val(this.options.page.margins.right);

        this.optionsDialog.show();
    }

    /**
     * Apply report options selected by user
     */
    applyOptions() {

        this._bDisableApplyReportViewerOptions = true;
        this.options.page.margins.top = $('#topMargin').val();
        this.options.page.margins.bottom = $('#bottomMargin').val();
        this.options.page.margins.left = $('#leftMargin').val();
        this.options.page.margins.right = $('#rightMargin').val();

        this.options.page.paperSize = $('#paperSize').val();

        if ($('#orientationPortrait').prop('checked')) {
            this.options.page.orientation = 'portrait';
        } else {
            this.options.page.orientation = 'landscape';
        }

        this.optionsDialog.hide();

        this._bDisableApplyReportViewerOptions = false;
        this.applyReportViewerOptions();
        this.refreshReport();

    }


    /**
     * Refresh report view (reload the report)
     */
    refreshReport() {

        this.report.renderReportCriterias();
        this.report.renderReportSettings();
        this.report.filter();
        this.report.sort();

        var oReportCanvas = new ReportCanvas(this.app, this.report, this);
        $('#' + this.options.id + '_canvas').html(oReportCanvas.render());

        oReportCanvas.initialiseJS();

        this.updateCSS();
        this.scaleReportSections();

        if (!this.report.isLoaded) {
            this.report.isLoaded = true;
            this.report.copyOriginalSettings();
            if (this.report.onReportLoaded) {
                this.report.onReportLoaded();
            }
        }

    }

    /**
     * Update reportPage style tag with print media css
     */
    updateCSS() {

        var paperSize = this.app.modules.Printing.getPaperSize(this.app.viewer.options.page.paperSize);
        var pageOrientation = this.app.viewer.options.page.orientation;

        var width = 0;
        var height = 0;

        if (pageOrientation == this.app.modules.Printing.PageOrientation.Landscape) {
            width = paperSize.height;
            height = paperSize.width;
        } else {
            width = paperSize.width;
            height = paperSize.height;
        }

        var s = `
               
        @media print {

            html, body {
                width: ${width}mm;
                margin: 0;
                padding: 0;
            }

            @page {
                size: ${width}mm ${height}mm;
                margin-top: ${this.options.page.margins.top}in !important;
                margin-bottom: ${this.options.page.margins.bottom}in !important;
                margin-left: ${this.options.page.margins.left}in !important;
                margin-right: ${this.options.page.margins.right}in !important;
                bleed: auto;
                @bottom-center {
                    content: counter(page) ' of ' counter(pages);
                }
            }

            .report-page {
                padding-top: 0px !important;
                padding-bottom: 0px !important;
                padding-left: 0px !important;
                padding-right: 0px !important; 
                box-shadow: none;
                border: none;
                margin-left: inherit;
                margin-right: inherit;    
                width : ${width}mm;
                height: ${height}mm;          
            }
 
            .no-print {
                display: none;
            }
          
            .report-viewer-canvas {
                overflow:visible;
                height: auto;
                padding:0px;
            }
                                            
            table { page-break-after:auto }
            tr    { page-break-inside:avoid; page-break-after:auto }
            td    { page-break-inside:avoid; page-break-after:auto }
            thead { display:table-header-group }
            tfoot { display:table-footer-group }
        }`;

        $('#' + this.options.id + '_style').text(s);
        this.app.modules.Printing.applyPageStyles();
    }

    /**
     * Scales report section to fit in page width
     */
    scaleReportSections() {

        $('.table-report-section').each(function () {

            if ($(this).width() > 0) {
                var ratio = $('#reportPage').width() / $(this).width();
                if (ratio != 1) {
                    $(this).css('transform', 'scaleX(' + parseFloat(ratio).toFixed(2) + ')');
                    $(this).css('transform-origin', 'top left')
                }
            }

        });

    }

    /**
     * Displays report settings right off canvas
     */
    showReportSettings() {

        if (this.settingsOffCanvas === null) {
            this.settingsOffCanvas = new bootstrap.Offcanvas($('#' + this.options.id + '_settingsOffCanvas')[0], {})
        }
        this.settingsOffCanvas.show();

    }

    refreshReportSettings() {

        for (var kSection in this.report.getReportDefinition().sections) {
            var oSection = this.report.getReportDefinition().sections[kSection];

            for (var y in oSection.model) {
                var field = oSection.model[y];
                var bIsVisible = true;
                if (field.visible != undefined) {
                    bIsVisible = this.app.modules.DataType.toBool(field.visible);
                }
                $('#' + oSection.id + '_field_' + oSection.model[y].name).prop('checked', bIsVisible);
                if (field.formula) {
                    $('#' + oSection.id + '_formula_' + oSection.model[y].name).val(field.formula);
                } else {
                    $('#' + oSection.id + '_formula_' + oSection.model[y].name).val('');
                }
                $('#' + oSection.id + '_label_' + oSection.model[y].name).html(field.label);

            }

        }

    }

    /**
     * Cancels report settings 
     */
    cancelSettings() {
        if (this.settingsOffCanvas !== null) {
            this.settingsOffCanvas.hide();
        }
    }

    /**
     * Apply report settings
     */
    applySettings() {
        if (this.settingsOffCanvas === null) {
            this.settingsOffCanvas = new bootstrap.Offcanvas($('#' + this.app.viewer.options.id + '_settingsOffCanvas')[0], {})
        }
        this.settingsOffCanvas.hide();

        // Update report properties name and description
        this.report.getReportDefinition().properties.name = $('#reportSettingsName').val();
        this.report.getReportDefinition().properties.description = $('#reportSettingsDescription').val();

        // Update report sections 
        for (var x in this.report.getReportDefinition().sections) {
            var oSection = this.report.getReportDefinition().sections[x];

            /**
             * Apply field settings
             */
            for (var f in oSection.model) {
                var oCol = oSection.model[f];
                oCol.visible = $('#' + oSection.id + '_field_' + oCol.name).prop('checked');
                oCol['formula'] = $('#' + oSection.id + '_formula_' + oCol.name).val();
            }

            /**
             * Reorder model columns
             */
            $('#' + oSection.id + '_fields tbody tr').each(function () {
                var columnName = $(this).attr('data-column');
                oSection.model.forEach(function (item, i) {
                    if (item.name == columnName) {
                        oSection.model.splice(i, 1);
                        oSection.model.unshift(item);
                    }
                });
            });

            oSection.model.reverse();

            /**
             * Apply order by settings
             */

            oSection.orderBy = [];
            $('#' + oSection.id + '_orderBy tbody tr').each(function () {
                var columnName = $(this).attr('data-column');

                if ($('#' + oSection.id + '_orderBy_' + columnName).prop('checked')) {
                    oSection.orderBy.push({
                        "name": columnName,
                        "order": $('#' + oSection.id + '_orderByOrder_' + columnName).val()
                    });
                }

            });

            oSection.groupBy = [];
            $('#' + oSection.id + '_groupBy tbody tr').each(function () {
                var columnName = $(this).attr('data-column');

                if ($('#' + oSection.id + '_groupBy_' + columnName).prop('checked')) {
                    oSection.groupBy.push({
                        "name": columnName,
                        "order": $('#' + oSection.id + '_groupByOrder_' + columnName).val()
                    });
                }

            });


        }

        /**
         * Apply settings changes
         */
        $('#' + this.options.id + '_headerName').html(this.report.getReportDefinition().properties.name);
        $('#' + this.options.id + '_headerDescription').html(this.report.getReportDefinition().properties.description);

        this.refreshReport();

    }

    /**
     * Hide main toolbar in report viewer
     */
    hideToolbar() {
        $('#' + this.report.id + '_toolbar').hide();
    }

    /**
     * Show main toolbar in report viewer
     */
    showToolbar() {
        $('#' + this.report.id + '_toolbar').show();
    }


    /**
     * Returns container element selector
     * @returns 
     */
    getContainerSelector() {
        return '#' + this.options.id;
    }

}
window.__Metadocx.ReportViewer = ReportViewer;