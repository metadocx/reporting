/** 
 * Report Canvas
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportCanvas {

    constructor(app, report) {
        this.app = app;
        this.report = report;
        this.reportSections = [];
    }

    /**
     * Renders page (canvas) where report will be rendered
     * @returns 
     */
    render() {

        let s = '';
        let sReportSection = '';

        let oReportTemplate = new Theme(this.app);

        if (window.__Metadocx.Themes[this.app.reporting.viewer.options.template] != undefined) {
            oReportTemplate = new window.__Metadocx.Themes[this.app.reporting.viewer.options.template](this.app);
        }

        if (this.app.reporting.viewer.options.coverPage.enabled) {
            // Add cover page to report
            s += `<div id="reportCoverPage" class="report-page orientation-${this.app.reporting.viewer.options.page.orientation} size-${this.app.reporting.viewer.options.page.paperSize.toString().toLowerCase()}">
                    <style id="${this.app.reporting.viewer.options.id}_coverPage">
                        ${oReportTemplate.renderCoverPageCSS()}    
                    </style>
                    ${oReportTemplate.renderCoverPage()}
                  </div>`;
        }

        for (let x in this.report.getReportDefinition().sections) {

            let sReportSectionType = this.report.getReportDefinition().sections[x].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportDefinition().sections[x]);
            this.reportSections.push(oReportSection);

            if (this.app.modules.DataType.toBool(this.report.getReportDefinition().sections[x].breakBefore)) {
                sReportSection += this.renderPageBreak();
            }

            sReportSection += oReportSection.render();

            if (this.app.modules.DataType.toBool(this.report.getReportDefinition().sections[x].breakAfter)) {
                sReportSection += this.renderPageBreak();
            }

        }

        s += `<div id="reportPage" class="report-page orientation-${this.app.reporting.viewer.options.page.orientation} size-${this.app.reporting.viewer.options.page.paperSize.toString().toLowerCase()}">                
                <div id="reportContent">
                    <style id="${this.app.reporting.viewer.options.id}_style">
                    </style>
                    <style id="${this.app.reporting.viewer.options.id}_theme">
                        ${oReportTemplate.renderThemeCSS()}
                    </style>
                    ${sReportSection}
                </div>
            </div>`;

        return s;

    }

    renderPageBreak() {
        return `<div class="page-break"></div>`;
    }

    initialiseJS() {
        for (let x in this.reportSections) {
            if (this.reportSections[x].initialiseJS != undefined) {
                this.reportSections[x].initialiseJS();
            }
        }
    }

}
window.__Metadocx.ReportCanvas = ReportCanvas;