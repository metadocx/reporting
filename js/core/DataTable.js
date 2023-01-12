/** 
 * DataTable renders a report section table
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataTable {

    constructor(app) {
        /**
         * Table id
         */
        this.id = null;
        /**
         * Metadocx App object
         */
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
        /**
         * Group by counter objects
         */
        this.groupCounters = {};
        /**
         * Grand total counter object
         */
        this.grandTotal = {};
    }

    /**
     * Called before the table HTML is rendered
     */
    preRender() {

    }

    /**
     * Called after the table HTML is rendered
     */
    postRender() {

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

    /**
     * Updates model column
     * @param {*} name 
     * @param {*} col 
     * @returns boolean
     */
    setColumn(name, col) {
        for (let x in this.model) {
            if (this.model[x].name == name) {
                this.model[x] = col;
                return true;
            }
        }

        return false;
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

    /**
     * Checks if column is visible or not
     * @param {*} name 
     * @returns boolean
     */
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

    /**
     * Hide a column
     * @param {*} name 
     */
    hideColumn(name) {
        for (let x in this.model) {
            if (this.model[x].name == name) {
                this.model[x].visible = false;
            }
        }
    }

    /**
     * Renders table html
     * @returns string
     */
    render() {
        this.preRender();

        this.groupCounters = [];
        this.grandTotal = {
            enabled: false,
            values: this.buildGroupCounters(),
            minValues: this.buildGroupCounters(null),
            maxValues: this.buildGroupCounters(null),
            count: 0,
            getSum: function (name) { return this.values[name]; },
            getAvg: function (name) { if (this.count != 0) { return this.values[name] / this.count; } else { return 0; } },
            getCount: function () { return this.count; },
            getMin: function (name) { return this.minValues[name]; },
            getMax: function (name) { return this.maxValues[name]; }
        }

        let s = '';
        s += '<table id="' + this.id + '" class="table table-bordered table-hover table-report-section" data-report-section-id="' + this.id + '">';

        /**
         * HEADER ROW
         */
        s += '<thead>';
        s += '<tr class="report-row-header">';
        for (let y in this.model) {
            let cellModel = this.model[y];
            let cellStyle = 'font-weight:bold;';
            if (cellModel['align']) {
                cellStyle += 'text-align:' + cellModel['align'] + ';';
            }
            if (cellModel['width']) {
                cellStyle += 'width:' + cellModel['width'] + 'px;';
            }
            if (cellModel["visible"] == undefined || cellModel["visible"]) {
                s += '<td class="report-cell-header" style="' + cellStyle + '">' + this.model[y].label + '</td>';
            }
        }
        s += '</tr>';
        s += '</thead>';

        /**
         * DATA ROWS
         */
        s += '<tbody>';

        let previousRow = null;
        for (let x in this.data) {
            let row = this.data[x];
            if (!row['__visible']) {
                continue;
            }
            s += this.renderGroupHeader(row, previousRow);

            s += '<tr class="report-row-data">';
            for (let y in this.model) {
                let cellStyle = '';
                let cellModel = this.model[y];
                let cellValue = row[this.model[y].name];
                let cellDisplayValue = cellValue;

                if (cellModel['align']) {
                    cellStyle += 'text-align:' + cellModel['align'] + ';';
                }

                /**
                 * Format numeric values
                 */
                cellDisplayValue = this.app.modules.Format.format(cellValue, cellModel['type'], cellModel['format']);

                if (cellModel["visible"] !== false) {
                    s += '<td class="report-cell-data" style="' + cellStyle + '">' + cellDisplayValue + '</td>';
                }
            }
            s += '</tr>';

            previousRow = row;
        }

        s += this.closeAllGroups();

        s += '</tbody>';

        s += '</table>';

        this.postRender();

        return s;

    }

    /**
     * Renders group by sub total lines 
     * @param {*} row 
     * @param {*} previousRow 
     * @returns string
     */
    renderGroupHeader(row, previousRow) {


        /**
         * Grand total calculation
         */
        this.grandTotal.count++;
        for (let y in this.model) {
            if (this.model[y].formula) {
                this.grandTotal.enabled = true;
                if (this.model[y].type == 'number') {
                    // GRAND TOTAL

                    this.grandTotal.values[this.model[y].name] += this.app.modules.DataType.parseFloat(row[this.model[y].name]);
                    // Set minimum value
                    if (this.grandTotal.minValues[this.model[y].name] == null || this.grandTotal.minValues[this.model[y].name] > this.app.modules.DataType.parseFloat(row[this.model[y].name])) {
                        this.grandTotal.minValues[this.model[y].name] = this.app.modules.DataType.parseFloat(row[this.model[y].name]);
                    }
                    // Set maximum value
                    if (this.grandTotal.maxValues[this.model[y].name] == null || this.grandTotal.maxValues[this.model[y].name] < this.app.modules.DataType.parseFloat(row[this.model[y].name])) {
                        this.grandTotal.maxValues[this.model[y].name] = this.app.modules.DataType.parseFloat(row[this.model[y].name]);
                    }
                }
            }
        }


        if (!this.groupBy || this.groupBy.length <= 0) {
            // nothing to do
            return '';
        }

        let s = '';

        /**
         * Check first if we must close group in reverse order
         */
        for (let nLevel = this.getLevelCount(); nLevel >= 1; nLevel--) {

            if (previousRow == null || previousRow[this.groupCounters['level' + nLevel].name] != row[this.groupCounters['level' + nLevel].name]) {

                /**
                 * Close previous group with same level
                 */
                if (this.groupCounters['level' + nLevel]) {
                    // Level exists close it
                    s += `<tr class="report-row-group-footer" data-close-level="${nLevel}">`;
                    for (let y in this.model) {

                        let cellModel = this.model[y];
                        let cellStyle = 'font-weight:bold;';
                        let cellValue = ''
                        let cellDisplayValue = '';

                        if (cellModel['align']) {
                            cellStyle += 'text-align:' + cellModel['align'] + ';';
                        }
                        if (cellModel['width']) {
                            cellStyle += 'width:' + cellModel['width'] + ';';
                        }

                        if (this.groupCounters['level' + nLevel].values[cellModel.name] != undefined) {
                            if (cellModel['formula'] != undefined && cellModel['formula'] != '') {
                                switch (cellModel['formula']) {
                                    case 'SUM':
                                        cellValue = this.groupCounters['level' + nLevel].getSum(cellModel.name);
                                        break;
                                    case 'AVG':
                                        cellValue = this.groupCounters['level' + nLevel].getAvg(cellModel.name);
                                        break;
                                    case 'COUNT':
                                        cellValue = this.groupCounters['level' + nLevel].getCount(cellModel.name);
                                        break;
                                    case 'MIN':
                                        cellValue = this.groupCounters['level' + nLevel].getMin(cellModel.name);
                                        break;
                                    case 'MAX':
                                        cellValue = this.groupCounters['level' + nLevel].getMax(cellModel.name);
                                        break;
                                }
                            } else {
                                //cellValue = this.groupCounters['level' + nLevel].values[cellModel.name];
                                cellValue = '';
                                cellDisplayValue = '';
                            }

                            if (cellModel['type'] == 'number' && cellModel['format'] != undefined && cellModel['format'] != '') {
                                cellDisplayValue = numeral(cellValue).format(cellModel['format']);
                            } else if (cellModel['formula'] == 'COUNT' && cellModel['format'] != undefined && cellModel['format'] != '') {
                                cellDisplayValue = numeral(cellValue).format(cellModel['format']);
                            } else {
                                cellDisplayValue = cellValue;
                            }

                        } else {
                            cellValue = '';
                            cellDisplayValue = '';
                        }

                        if (cellModel["visible"] == undefined || cellModel["visible"]) {
                            s += '<td class="report-row-group-footer-cell" style="' + cellStyle + '">' + cellDisplayValue + '</td>';
                        }
                    }
                    s += `</tr>`;
                    this.groupCounters['level' + nLevel] = null;
                }

            }

        }

        /**
         * Check if we start new groups
         */
        let nLevel = 1;
        for (let x in this.groupBy) {

            if (previousRow == null || previousRow[this.groupBy[x].name] != row[this.groupBy[x].name]) {

                s += `<tr class="report-row-group row-group-level-${nLevel}" data-table-group-level="${nLevel}">
                    <td colspan="100%">${row[this.groupBy[x].name]}</td>
                </tr>`;

                this.groupCounters['level' + nLevel] = {
                    level: nLevel,
                    name: this.groupBy[x].name,
                    values: this.buildGroupCounters(),
                    minValues: this.buildGroupCounters(null),
                    maxValues: this.buildGroupCounters(null),
                    count: 0,
                    getSum: function (name) { return this.values[name]; },
                    getAvg: function (name) { if (this.count != 0) { return this.values[name] / this.count; } else { return 0; } },
                    getCount: function () { return this.count; },
                    getMin: function (name) { return this.minValues[name]; },
                    getMax: function (name) { return this.maxValues[name]; }
                };


            }

            nLevel++;

        }


        for (let x in this.groupCounters) {
            this.groupCounters[x].count++;
            for (let y in this.model) {
                if (this.model[y].formula) {
                    if (this.model[y].type == 'number') {
                        this.groupCounters[x].values[this.model[y].name] += this.app.modules.DataType.parseFloat(row[this.model[y].name]);

                        // Set minimum value
                        if (this.groupCounters[x].minValues[this.model[y].name] == null || this.groupCounters[x].minValues[this.model[y].name] > this.app.modules.DataType.parseFloat(row[this.model[y].name])) {
                            this.groupCounters[x].minValues[this.model[y].name] = this.app.modules.DataType.parseFloat(row[this.model[y].name]);
                        }
                        // Set maximum value
                        if (this.groupCounters[x].maxValues[this.model[y].name] == null || this.groupCounters[x].maxValues[this.model[y].name] < this.app.modules.DataType.parseFloat(row[this.model[y].name])) {
                            this.groupCounters[x].maxValues[this.model[y].name] = this.app.modules.DataType.parseFloat(row[this.model[y].name]);
                        }

                    }
                }
            }
        }

        return s;


    }

    /**
     * Closes all group sections and renders grand total line
     * @returns string
     */
    closeAllGroups() {

        let s = '';

        /**
         * Check first if we must close group in reverse order
         */
        for (let nLevel = this.getLevelCount(); nLevel >= 1; nLevel--) {

            /**
             * Close previous group with same level
             */
            if (this.groupCounters['level' + nLevel]) {
                // Level exists close it
                s += `<tr class="report-row-group-footer" data-close-level="${nLevel}">`;
                for (let y in this.model) {
                    let cellModel = this.model[y];
                    let cellStyle = 'font-weight:bold;';
                    let cellValue = '&nbsp;'
                    let cellDisplayValue = '';
                    if (cellModel['align']) {
                        cellStyle += 'text-align:' + cellModel['align'] + ';';
                    }
                    if (cellModel['width']) {
                        cellStyle += 'width:' + cellModel['width'] + ';';
                    }

                    if (this.groupCounters['level' + nLevel].values[cellModel.name] != undefined) {
                        if (cellModel['formula']) {
                            switch (cellModel['formula']) {
                                case 'SUM':
                                    cellValue = this.groupCounters['level' + nLevel].getSum(cellModel.name);
                                    break;
                                case 'AVG':
                                    cellValue = this.groupCounters['level' + nLevel].getAvg(cellModel.name);
                                    break;
                                case 'COUNT':
                                    cellValue = this.groupCounters['level' + nLevel].getCount(cellModel.name);
                                    break;
                                case 'MIN':
                                    cellValue = this.groupCounters['level' + nLevel].getMin(cellModel.name);
                                    break;
                                case 'MAX':
                                    cellValue = this.groupCounters['level' + nLevel].getMax(cellModel.name);
                                    break;
                            }
                        } else {
                            cellValue = this.groupCounters['level' + nLevel].values[cellModel.name];
                        }

                    }

                    if (cellModel['type'] == 'number' && cellModel['format'] != undefined) {
                        cellDisplayValue = numeral(cellValue).format(cellModel['format']);
                    } else if (cellModel['formula'] == 'COUNT' && cellModel['format'] != undefined) {
                        cellDisplayValue = numeral(cellValue).format(cellModel['format']);
                    } else {
                        cellDisplayValue = cellValue;
                    }

                    if (cellModel["visible"] == undefined || cellModel["visible"]) {
                        s += '<td class="report-row-group-footer-cell" style="' + cellStyle + '">' + cellDisplayValue + '</td>';
                    }
                }
                s += `</tr>`;
                this.groupCounters['level' + nLevel] = null;
            }

        }

        /**
         * Add grand total
         */
        if (this.app.modules.DataType.toBool(this.grandTotal.enabled)) {
            s += `<tr class="report-row-grand-total">`;
            for (let y in this.model) {
                let cellModel = this.model[y];
                let cellStyle = 'font-weight:bold;';
                let cellValue = '&nbsp;'
                let cellDisplayValue = '';
                if (cellModel['align']) {
                    cellStyle += 'text-align:' + cellModel['align'] + ';';
                }
                if (cellModel['width']) {
                    cellStyle += 'width:' + cellModel['width'] + ';';
                }


                if (this.grandTotal.values[cellModel.name] != undefined) {
                    if (cellModel['formula']) {
                        switch (cellModel['formula']) {
                            case 'SUM':
                                cellValue = this.grandTotal.getSum(cellModel.name);
                                break;
                            case 'AVG':
                                cellValue = this.grandTotal.getAvg(cellModel.name);
                                break;
                            case 'COUNT':
                                cellValue = this.grandTotal.getCount(cellModel.name);
                                break;
                            case 'MIN':
                                cellValue = this.grandTotal.getMin(cellModel.name);
                                break;
                            case 'MAX':
                                cellValue = this.grandTotal.getMax(cellModel.name);
                                break;
                        }
                    } else {
                        cellValue = this.grandTotal.values[cellModel.name];
                    }

                }

                if (cellModel['type'] == 'number' && cellModel['format']) {
                    cellDisplayValue = numeral(cellValue).format(cellModel['format']);
                } else {
                    cellDisplayValue = cellValue;
                }

                if (cellModel["visible"] == undefined || cellModel["visible"]) {
                    s += '<td class="report-row-grand-total-cell" style="' + cellStyle + '">' + cellDisplayValue + '</td>';
                }
            }
            s += `</tr>`;
        }

        return s;
    }

    /**
     * Build group by counters object based on formulas defined in model
     * @param {*} defaultValue 
     * @returns object
     */
    buildGroupCounters(defaultValue) {
        if (defaultValue === undefined) {
            defaultValue = 0;
        }
        let counters = {};
        for (let x in this.model) {
            if (this.model[x].formula !== undefined && this.model[x].formula !== '') {
                counters[this.model[x].name] = defaultValue;
            }
        }
        return counters;
    }

    /**
     * Returns number of grop by levels currently open
     * @returns int
     */
    getLevelCount() {
        let nCount = 0;
        for (let x in this.groupCounters) {
            if (this.groupCounters[x]) { nCount++; }
        }
        return nCount;
    }

    /**
     * Returns order by 
     * @param {*} name 
     * @returns object
     */
    getOrderBy(name) {
        if (this.orderBy) {
            for (let x in this.orderBy) {
                if (this.orderBy[x].name == name) {
                    return this.orderBy[x];
                }
            }
        }

        return null;
    }

    /**
     * Returns group by
     * @param {*} name 
     * @returns object
     */
    getGroupBy(name) {
        if (this.groupBy) {
            for (let x in this.groupBy) {
                if (this.groupBy[x].name == name) {
                    return this.groupBy[x];
                }
            }
        }

        return null;
    }

}