/** 
 * Report Canvas
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportCanvas {

    constructor(app, report, viewer) {
        this.app = app;
        this.report = report;
        this.viewer = viewer;
        this.reportSections = [];
    }

    /**
     * Renders page (canvas) where report will be rendered
     * @returns 
     */
    render() {

        var s = '';
        var sReportSection = '';

        if (this.viewer.options.coverPage.enabled) {
            // Add cover page to report

            var oCover = new window.__Metadocx[this.viewer.options.coverPage.template](this.app);

            s += `<div id="reportCoverPage" class="report-page orientation-${this.viewer.options.page.orientation} size-${this.viewer.options.page.paperSize.toString().toLowerCase()}">
                    <style>
                        ${oCover.renderCSS()}    
                    </style>
                    ${oCover.render()}
                  </div>`;
        }

        for (var x in this.report.getReportDefinition().sections) {

            var sReportSectionType = this.report.getReportDefinition().sections[x].type + 'ReportSection';
            var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportDefinition().sections[x]);
            this.reportSections.push(oReportSection);
            sReportSection += oReportSection.render();

        }

        s += `<div id="reportPage" class="report-page orientation-${this.viewer.options.page.orientation} size-${this.viewer.options.page.paperSize.toString().toLowerCase()}">                
                <div id="reportContent">
                    <style id="${this.viewer.options.id}_style">
                    </style>
                    ${sReportSection}
                </div>
            </div>`;

        return s;

    }

    initialiseJS() {
        for (var x in this.reportSections) {
            if (this.reportSections[x].initialiseJS != undefined) {
                this.reportSections[x].initialiseJS();
            }
        }
    }

}
window.__Metadocx.ReportCanvas = ReportCanvas;