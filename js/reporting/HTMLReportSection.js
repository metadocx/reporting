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

        let content = '';

        if (Array.isArray(this.reportSection.content)) {
            // Array of strings
            content = this.reportSection.content.join('');
        } else if (typeof this.reportSection.content === 'object') {
            if (this.reportSection.content.url !== undefined) {
                // Url ajax content
                $.ajax(this.reportSection.content.url, {
                    async: false,
                    dataType: 'json',
                    success: (data, status, xhr) => {
                        content = data.content;
                    }
                });

            }
        } else {
            // Default string content
            content = this.reportSection.content;
        }


        return `<div class="report-section-html">
                    ${content}
                </div>`;
    }

}
window.__Metadocx.HTMLReportSection = HTMLReportSection;