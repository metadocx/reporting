/**
 * CoverPage1 class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class CoverPage1 extends CoverPage {

    constructor(app) {
        super(app);
    }

    render() {

        var s = '';

        s += `<div class="report-cover-page">
            <div class="report-cover-header"></div>
            <div class="report-cover-name">${this.app.viewer.report.getReportDefinition().properties.name}</div>
            <div class="report-cover-description">${this.app.viewer.report.getReportDefinition().properties.description}</div>
            <div class="report-cover-footer"></div>
        </div>`;

        return s;

    }

    renderCSS() {

        return `

            .report-cover-page {
                position:relative;
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
                bottom: -0.5in;
                left: -0.5in;
                right: -0.5in;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/assets/images/templates/CoverPage1/header.png');
            }

            .report-cover-header {
                height: 162px;
                background-size: cover;
                position: absolute;
                top: -0.5in;
                left: -0.5in;
                right: -0.5in;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@latest/assets/images/templates/CoverPage1/footer.png');
            }
        
        `;

    }

}

window.__Metadocx.CoverPage1 = CoverPage1;