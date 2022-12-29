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
    }

    /**
     * Renders page (canvas) where report will be rendered
     * @returns 
     */
    render() {

        var s = '';
        var sReportSection = '';
        for (var x in this.report.getReportDefinition().sections) {

            var sReportSectionType = this.report.getReportDefinition().sections[x].type + 'ReportSection';
            var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportDefinition().sections[x]);
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

}
window.__Metadocx.ReportCanvas = ReportCanvas;