/** 
 * Theme
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Theme {

    constructor(app) {
        this.app = app;
        this.colorScheme = ['#9999ff', '#993366', '#ffffcc', '#ccffff', '#660066', '#ff8080', '#0066cc', '#ccccff', '#000080', '#ff00ff', '#ffff00', '#0000ff', '#800080', '#800000', '#008080', '#0000ff'];
        this.applyChartColorTheme();
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
        `;
    }

    renderThemeCSS() { return ''; }

    getColorScheme() {
        return this.colorScheme;
    }

    applyChartColorTheme() {

    }

}

window.__Metadocx.Theme = Theme;