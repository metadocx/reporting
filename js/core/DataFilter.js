/** 
 * DataFilter filters data using criteria values
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataFilter {

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
     * Sets report section to filter
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
        let applicableCriterias = [];
        let criterias = this.app.viewer.report.getReportDefinition().criterias;
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
     * Filter report section data
     */
    process() {

        /**
         * Make all rows visible
         */
        for (let x in this.data) {
            this.data[x]['__visible'] = true;
        }

        let aCriterias = this.criterias;
        for (let x in aCriterias) {

            /**
             * Check if criterias is enabled
             */
            let criteriaValue = this.app.viewer.getCriteriaValue(aCriterias[x].id);
            if (criteriaValue && criteriaValue.enabled === false) {
                continue;
            }

            for (let r in this.data) {
                for (let a in aCriterias[x].applyTo) {

                    if (this.hasColumn(aCriterias[x].applyTo[a].field)) {

                        switch (aCriterias[x].type) {
                            case 'DatePeriodCriteria':
                                if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                            case 'SelectCriteria':
                                let selectedItems = criteriaValue.value;
                                let bFound = false;
                                for (let v in selectedItems) {
                                    if (this.data[r][aCriterias[x].applyTo[a].field] == selectedItems[v].text) {
                                        bFound = true;
                                    }
                                }
                                if (!bFound) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                            case 'BooleanCriteria':
                                if (criteriaValue.value !== 'ALL') {
                                    if (this.app.modules.DataType.toBool(this.data[r][aCriterias[x].applyTo[a].field]) != this.app.modules.DataType.toBool(criteriaValue.value)) {
                                        this.data[r]['__visible'] = false;
                                    }
                                }

                                break;
                            case 'NumericCriteria':

                                switch (criteriaValue.value.operator) {
                                    case 'EQUAL':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'NOT_EQUAL':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] == criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'GREATER_THAN':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] <= criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'GREATER_OR_EQUAL':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] < criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'SMALLER_THAN':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] >= criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'SMALLER_OR_EQUAL':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] > criteriaValue.value.startValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                    case 'BETWEEN':
                                        if (this.data[r][aCriterias[x].applyTo[a].field] < criteriaValue.value.startValue &&
                                            this.data[r][aCriterias[x].applyTo[a].field] > criteriaValue.value.endValue) {
                                            this.data[r]['__visible'] = false;
                                        }
                                        break;
                                }


                                break;
                            case 'CheckboxCriteria':
                                if (criteriaValue.value.indexOf(this.data[r][aCriterias[x].applyTo[a].field]) === -1) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                        }

                    }

                }



            }

        }

    }

    /**
     * Checks if model has a column
     * @param {*} name 
     * @returns boolean
     */
    hasColumn(name) {
        for (let x in this.model) {
            if (this.model[x].name == name) {
                return true;
            }
        }
        return false;
    }

}