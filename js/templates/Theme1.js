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
        this.colorScheme = ['#A21BBF', '#295CF0', '#007EFF', '#0093F7', '#00A0D1', '#00AA9F'];
    }

    /**
     * Renders cover page HTML
     * @returns 
     */
    renderCoverPage() {

        let s = '';

        s += `<div class="report-cover-page">
            <div class="report-cover-header"></div>
            <div class="report-cover-name">${this.app.reporting.viewer.report.getReportDefinition().properties.name}</div>
            <div class="report-cover-description">${this.app.reporting.viewer.report.getReportDefinition().properties.description}</div>
            <div class="report-cover-footer"></div>
        </div>`;

        return s;

    }

    /**
     * Renders theme css
     * @returns 
     */
    renderThemeCSS() {

        return `

            .report-cell-header {
                background-color: #B4A8E1 !important;
            }

            .report-row-group td {
                background-color: #B174D8 !important;
            }
        
        `;

    }

    /**
     * Renders cover page CSS
     * @returns 
     */
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
                height: 355px;
                background-size: cover;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme1/footer.png');
            }

            .report-cover-header {
                height: 165px;
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

window.__Metadocx.Themes.Theme1 = Theme1;