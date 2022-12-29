/** 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportSection {

    constructor(app, reportSection) {
        /**
         * Main app reference
         */
        this.app = app;
        /**
         * Types of report sections
         */
        this.ReportSectionTypes = {
            DataTable: 'DataTable',
            Graph: 'Graph',
            HTML: 'HTML'
        }
        this.type = reportSection.type;
        this.reportSection = reportSection;
        this.preRender();
    }

    preRender() {
    }



    render() {

    }




    getApplicableReportCriterias() {
        var applicableCriterias = [];
        var criterias = this.app.viewer.report.getReportDefinition().criterias;
        for (var x in criterias) {
            var criteria = criterias[x];
            for (var y in criteria.applyTo) {
                if (criteria.applyTo[y].section == this.reportSection.id) {
                    applicableCriterias.push(criteria);
                }
            }
        }

        return applicableCriterias;
    }

    criteriaAppliesToReportSection(criteria) {
        for (var x in criteria.applyTo) {
            if (criteria.applyTo[x].section == this.reportSection.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Sorts report data based on orderBy criterias of report section
     * @param {*} report 
     * @param {*} reportSection 
     */
    sort() {


        this.reportSection.data.sort((a, b) => {

            for (var x in this.reportSection.groupBy) {

                var column = this.getColumn(this.reportSection.groupBy[x].name)
                var aValue = a[this.reportSection.groupBy[x].name];
                var bValue = b[this.reportSection.groupBy[x].name];

                switch (column.type) {
                    case 'number':
                        aValue = parseFloat(aValue);
                        bValue = parseFloat(bValue);
                        break;
                    case 'date':
                        aValue = moment(aValue).format('YYYY-MM-DD');
                        bValue = moment(bValue).format('YYYY-MM-DD');
                        break;
                }

                if (this.reportSection.groupBy[x].order.toString().toLowerCase().trim() == 'desc') {
                    if (aValue > bValue) {
                        return -1;
                    }
                    if (aValue < bValue) {
                        return 1;
                    }
                } else {
                    if (aValue < bValue) {
                        return -1;
                    }
                    if (aValue > bValue) {
                        return 1;
                    }
                }
            }

            for (var x in this.reportSection.orderBy) {

                var column = this.getColumn(this.reportSection.orderBy[x].name)
                var aValue = a[this.reportSection.orderBy[x].name];
                var bValue = b[this.reportSection.orderBy[x].name];

                switch (column.type) {
                    case 'number':
                        aValue = parseFloat(aValue);
                        bValue = parseFloat(bValue);
                        break;
                    case 'date':
                        aValue = moment(aValue).format('YYYY-MM-DD');
                        bValue = moment(bValue).format('YYYY-MM-DD');
                        break;
                }

                if (this.reportSection.orderBy[x].order.toString().toLowerCase().trim() == 'desc') {
                    if (aValue > bValue) {
                        return -1;
                    }
                    if (aValue < bValue) {
                        return 1;
                    }
                } else {
                    if (aValue < bValue) {
                        return -1;
                    }
                    if (aValue > bValue) {
                        return 1;
                    }
                }
            }

            return 0;

        });



    }

    getOrderBy(name) {
        if (this.reportSection.orderBy) {
            for (var x in this.reportSection.orderBy) {
                if (this.reportSection.orderBy[x].name == name) {
                    return this.reportSection.orderBy[x];
                }
            }
        }

        return null;
    }

    getGroupBy(name) {
        if (this.reportSection.groupBy) {
            for (var x in this.reportSection.groupBy) {
                if (this.reportSection.groupBy[x].name == name) {
                    return this.reportSection.groupBy[x];
                }
            }
        }

        return null;
    }



}
window.__Metadocx.ReportSection = ReportSection;