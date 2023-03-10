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
        this.criteriaValues = this.app.reporting.viewer.getCriteriaValues();
    }

    getApplicableReportCriterias() {
        let applicableCriterias = [];
        let criterias = this.app.reporting.viewer.report.getReportDefinition().criterias;
        for (let x in criterias) {
            let criteria = criterias[x];
            for (let y in criteria.applyTo) {
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

            for (let x in this.groupBy) {

                let column = this.getColumn(this.groupBy[x].name)
                let aValue = a[this.groupBy[x].name];
                let bValue = b[this.groupBy[x].name];

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

            for (let x in this.orderBy) {

                let column = this.getColumn(this.orderBy[x].name)
                let aValue = a[this.orderBy[x].name];
                let bValue = b[this.orderBy[x].name];

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
        for (let x in this.model) {
            if (this.model[x].name == name) {
                return this.model[x];
            }
        }
        return null;
    }

}