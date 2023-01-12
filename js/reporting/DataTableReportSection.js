/** 
 * DataTable Report section
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataTableReportSection extends ReportSection {

    constructor(app, reportSection) {
        super(app, reportSection);
    }


    render() {

        let oTable = new DataTable(this.app);
        oTable.id = 'ReportSection_' + this.reportSection.id;
        oTable.data = this.reportSection.data;
        oTable.model = this.reportSection.model;
        oTable.orderBy = this.reportSection.orderBy;
        oTable.groupBy = this.reportSection.groupBy;
        oTable.criterias = this.getApplicableReportCriterias();
        oTable.criteriaValues = this.app.viewer.getCriteriaValues();

        let s = '';

        this.preRender();

        s += '<div class="report-section-title">';
        if (this.app.viewer.report.getReportDefinition().properties.name) {
            s += '<h1 class="report-title">' + this.app.viewer.report.getReportDefinition().properties.name + '</h1>';
        }
        if (this.app.viewer.report.getReportDefinition().properties.description) {
            s += '<h4 class="report-description">' + this.app.viewer.report.getReportDefinition().properties.description + '</h4>';
        }
        //s += '<hr/>';
        s += '</div>';

        s += oTable.render();

        return s;

    }

    getColumn(name) {
        for (let x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                return this.reportSection.model[x];
            }
        }
        return null;
    }

    setColumn(name, column) {
        for (let x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                this.reportSection.model[x] = column;
                return true;
            }
        }
        return false;
    }

    hasColumn(name) {
        for (let x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                return true;
            }
        }
        return false;
    }

    isColumnVisible(name) {
        if (this.hasColumn(name)) {
            let column = this.getColumn(name);
            if (column.visible == undefined) {
                // visible by default
                return true;
            } else if (column.visible) {
                return true;
            }
        }

        return false;
    }

    hideColumn(name) {
        for (let x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                this.reportSection.model[x].visible = false;
            }
        }
    }


}
window.__Metadocx.DataTableReportSection = DataTableReportSection;
