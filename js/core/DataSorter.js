/** 
 * DataSorter sorts data 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataSorter {

    constructor(app) {
        this.app = app;
        /**
         * Model, column definition
         */
        this.model = [];
        /**
         * Data to display
         */
        this.data = [];
        /**
         * Order by settings
         */
        this.orderBy = [];
        /**
         * Group by settings
         */
        this.groupBy = [];
        /**
         * Report criterias
         */
        this.criterias = [];
        /**
         * Report criteria values
         */
        this.criteriaValues = null;

        this.reportSection = null;
    }

    /**
     * Sets report section to sort
     * @param {*} oReportSection 
     */
    setReportSection(oReportSection) {
        this.reportSection = oReportSection;
        this.data = this.reportSection.data;
        this.model = this.reportSection.model;
        this.orderBy = this.reportSection.orderBy;
        this.groupBy = this.reportSection.groupBy;
        this.criterias = this.getApplicableReportCriterias();
        this.criteriaValues = this.app.viewer.getCriteriaValues();
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

    /**
     * Sorts report data based on orderBy criterias of report section
     * @param {*} report 
     * @param {*} reportSection 
     */
    process() {

        if (!this.data) {
            return;
        }

        this.data.sort((a, b) => {

            for (var x in this.groupBy) {

                var column = this.getColumn(this.groupBy[x].name)
                var aValue = a[this.groupBy[x].name];
                var bValue = b[this.groupBy[x].name];

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

                if (this.groupBy[x].order.toString().toLowerCase().trim() == 'desc') {
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

            for (var x in this.orderBy) {

                var column = this.getColumn(this.orderBy[x].name)
                var aValue = a[this.orderBy[x].name];
                var bValue = b[this.orderBy[x].name];

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

                if (this.orderBy[x].order.toString().toLowerCase().trim() == 'desc') {
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

    /**
     * Returns a column from the model based on it's name
     * @param {*} name 
     * @returns object
     */
    getColumn(name) {
        for (var x in this.model) {
            if (this.model[x].name == name) {
                return this.model[x];
            }
        }
        return null;
    }

}