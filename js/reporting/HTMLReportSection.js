/** 
 * DataTable Report section
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class HTMLReportSection extends ReportSection {

    constructor(app, reportSection) {
        super(app, reportSection);
    }

    render() {
        return `<div class="report-section-html">
                    ${this.reportSection.content}
                </div>`;
    }

}
window.__Metadocx.HTMLReportSection = HTMLReportSection;