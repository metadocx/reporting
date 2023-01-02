/**
 * Theme1 class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Theme1 extends Theme {

    constructor(app) {
        super(app);
    }

    renderCoverPage() {

        var s = '';

        s += `<div class="report-cover-page">
            <div class="report-cover-header"></div>
            <div class="report-cover-name">${this.app.viewer.report.getReportDefinition().properties.name}</div>
            <div class="report-cover-description">${this.app.viewer.report.getReportDefinition().properties.description}</div>
            <div class="report-cover-footer"></div>
        </div>`;

        return s;

    }

    renderCoverPageCSS() {

        return `

            #reportCoverPage {
                position:relative;
            }

            .report-cover-page {
                height: 100%;
            }

            .report-cover-name {
                position: absolute;
                top: 360px;
                font-size: 36px;
                font-weight: bold;
            }

            .report-cover-description {
                position: absolute;
                top: 410px;                
            }

            .report-cover-footer {
                height: 162px;
                background-size: cover;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme1/footer.png');
            }

            .report-cover-header {
                height: 162px;
                background-size: cover;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme1/header.png');
            }
        
        `;

    }

}

window.__Metadocx.Theme1 = Theme1;