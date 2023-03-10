/**
 * Theme2 class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Theme2 extends Theme {

    constructor(app) {
        super(app);
        this.colorScheme = ['#1C85D6', '#00A8E5', '#00C5D5', '#00DEB0', '#95EF87', '#F9F871'];
    }

    /**
     * Renders cover page html
     * @returns 
     */
    renderCoverPage() {

        let s = '';

        s += `<div class="report-cover-page">
            <div class="report-cover-header"></div>
            <div class="report-cover-name">${this.app.reporting.viewer.report.getReportDefinition().properties.name}</div>
            <div class="report-cover-description">${this.app.reporting.viewer.report.getReportDefinition().properties.description}</div>
            <div class="custom-cover-author">${this.app.reporting.viewer.report.getReportDefinition().properties.author ?? ''}</div>
            <div class="custom-cover-version">Version ${this.app.reporting.viewer.report.getReportDefinition().properties.version ?? ''}</div>
            <div class="report-cover-footer"></div>
            <div class="report-cover-date"><span data-locale="CreatedAt">Created at</span> ${moment().format('YYYY-MM-DD HH:mm')}</div>
            <div class="report-cover-powered-by"><span data-locale="PoweredBy">powered by</span> <a href="https://www.metadocx.com" target="_blank">Metadocx</a></div>
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
                background-color: #1C85D6 !important;
            }

            .report-row-group td {
                background-color: #7DB7E4 !important;
            }
        
        `;

    }

    /**
     * Renders cover page css
     * @returns 
     */
    renderCoverPageCSS() {

        return `

            #reportCoverPage {
                position:relative;
            }

            .custom-cover-author {
                position: absolute;
                right: 50px;
                top: 500px;    
                font-color: #c0c0c0;            
            }

            .custom-cover-version {
                position: absolute;
                right: 50px;
                top: 530px;    
                font-color: #c0c0c0;            
                font-size:9pt;
            }

            .report-cover-date {
                color: #fff;
                position:absolute;
                left:50px;
                bottom:50px;
                font-size: 9pt;
            }

            .report-cover-powered-by {
                color: #fff;
                position:absolute;
                right:50px;
                bottom:50px;
                text-align:right;
                font-size: 9pt;
            }

            .report-cover-powered-by a {
                color: #ffcc00;
            }

            .report-cover-powered-by a:visited {
                color: #ffcc00;
            }

            .report-cover-page {
                height: 100%;
            }

            .report-cover-name {
                position: absolute;
                top: 360px;
                font-size: 56px;
                font-weight: bold;
                text-align: right;
                right: 50px;
            }

            .report-cover-description {
                position: absolute;                
                top: 450px;
                font-size: 24px;  
                text-align: right;
                right: 50px;         
                width: 100%;
            }

            .report-cover-footer {
                height: 310px;
                background-size: cover;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme2/footer.png');
            }

            .orientation-landscape .report-cover-header {
                height: 332px;
            }

            .report-cover-header {
                height: 255px;
                background-size: cover;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background-image : url('https://cdn.jsdelivr.net/gh/metadocx/reporting@main/assets/images/templates/Theme2/header.png');
            }
        
        `;

    }

}

window.__Metadocx.Themes.Theme2 = Theme2;