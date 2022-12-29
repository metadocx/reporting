/**
 * Copied from https://stackoverflow.com/questions/7395686/how-can-i-serialize-a-function-in-javascript/51123745#51123745
 */
Function.deserialise = function (key, data) {
    return (data instanceof Array && data[0] == 'window.Function') ?
        new (Function.bind.apply(Function, [Function].concat(data[1], [data[2]]))) :
        data
        ;
};
Function.prototype.toJSON = function () {
    var whitespace = /\s/;
    var pair = /\(\)|\[\]|\{\}/;

    var args = new Array();
    var string = this.toString();

    var fat = (new RegExp(
        '^\s*(' +
        ((this.name) ? this.name + '|' : '') +
        'function' +
        ')[^)]*\\('
    )).test(string);

    var state = 'start';
    var depth = new Array();
    var tmp;

    for (var index = 0; index < string.length; ++index) {
        var ch = string[index];

        switch (state) {
            case 'start':
                if (whitespace.test(ch) || (fat && ch != '('))
                    continue;

                if (ch == '(') {
                    state = 'arg';
                    tmp = index + 1;
                }
                else {
                    state = 'singleArg';
                    tmp = index;
                }
                break;

            case 'arg':
            case 'singleArg':
                var escaped = depth.length > 0 && depth[depth.length - 1] == '\\';
                if (escaped) {
                    depth.pop();
                    continue;
                }
                if (whitespace.test(ch))
                    continue;

                switch (ch) {
                    case '\\':
                        depth.push(ch);
                        break;

                    case ']':
                    case '}':
                    case ')':
                        if (depth.length > 0) {
                            if (pair.test(depth[depth.length - 1] + ch))
                                depth.pop();
                            continue;
                        }
                        if (state == 'singleArg')
                            throw '';
                        args.push(string.substring(tmp, index).trim());
                        state = (fat) ? 'body' : 'arrow';
                        break;

                    case ',':
                        if (depth.length > 0)
                            continue;
                        if (state == 'singleArg')
                            throw '';
                        args.push(string.substring(tmp, index).trim());
                        tmp = index + 1;
                        break;

                    case '>':
                        if (depth.length > 0)
                            continue;
                        if (string[index - 1] != '=')
                            continue;
                        if (state == 'arg')
                            throw '';
                        args.push(string.substring(tmp, index - 1).trim());
                        state = 'body';
                        break;

                    case '{':
                    case '[':
                    case '(':
                        if (
                            depth.length < 1 ||
                            !(depth[depth.length - 1] == '"' || depth[depth.length - 1] == '\'')
                        )
                            depth.push(ch);
                        break;

                    case '"':
                        if (depth.length < 1)
                            depth.push(ch);
                        else if (depth[depth.length - 1] == '"')
                            depth.pop();
                        break;
                    case '\'':
                        if (depth.length < 1)
                            depth.push(ch);
                        else if (depth[depth.length - 1] == '\'')
                            depth.pop();
                        break;
                }
                break;

            case 'arrow':
                if (whitespace.test(ch))
                    continue;
                if (ch != '=')
                    throw '';
                if (string[++index] != '>')
                    throw '';
                state = 'body';
                break;

            case 'body':
                if (whitespace.test(ch))
                    continue;
                string = string.substring(index);

                if (ch == '{')
                    string = string.replace(/^{\s*(.*)\s*}\s*$/, '$1');
                else
                    string = 'return ' + string.trim();

                index = string.length;
                break;

            default:
                throw '';
        }
    }

    return ['window.Function', args, string];
};
/**
 * Copied from https://stackoverflow.com/a/50723478/2277399
 */
const ProxyHandler = {
    get(target, key) {
        if (key == 'isProxy')
            return true;

        const prop = target[key];

        // return if property not found
        if (typeof prop == 'undefined')
            return;

        // set value as proxy if object
        if (!prop.isProxy && typeof prop === 'object')
            target[key] = new Proxy(prop, ProxyHandler);

        return target[key];
    },
    set(target, key, value) {

        target[key] = value;
        Metadocx.viewer.applyReportViewerOptions();
        return true;
    }
};
/** 
 * Consolable
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Consolable {

    constructor(app) {

        /**
         * Main app reference
         */
        this.app = app;
        /**
         * If console is enabled or not
         */
        this.debugEnabled = true;
        /**
         * Name to display in tag, class name by default
         */
        this.tag = this.constructor.name;
        /**
        * Console text color and backcolor for title
        */
        this.consoleColor = '#fff';
        this.consoleBackColor = 'blue';
    }

    /**
    * Console log with module tag and color
    */
    log() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.log.apply(this.app.modules.Console, arguments);
        } else {
            console.log.apply(null, arguments);
        }
    }


    /**
     * Console debug with module tag and color
     */
    debug() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.debug.apply(this.app.modules.Console, arguments);
        } else {
            console.debug.apply(null, arguments);
        }
    }

    /**
     * Console debug with module tag and color
     */
    error() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.error.apply(this.app.modules.Console, arguments);
        } else {
            console.error.apply(null, arguments);
        }
    }

    /**
     * Console debug with module tag and color
     */
    warn() {
        if (!this.debugEnabled) {
            return;
        }
        if (this.app && this.app.modules.Console) {
            this.app.modules.Console.setTag(this.tag);
            this.app.modules.Console.setColor(this.consoleColor, this.consoleBackColor);
            this.app.modules.Console.warn.apply(this.app.modules.Console, arguments);
        } else {
            console.warn.apply(null, arguments);
        }
    }

}

/** 
 * CriteriaControl base class for all criteria controls
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier. 
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class CriteriaControl {

    constructor(app) {
        this.id = null;
        this.app = app;
        this.reportCriteria = null;
        this._instance = null;
    }

    /**
     * Initializes any javascript code for this criteria
     * Sets JS object (if any) to this._instance
     */
    initializeJS() { }

    /**
     * Renders the criterias HTML code
     */
    render() { }

    /**
     * Returns current JS instance of criteria UX component
     * For example select2 or daterangepicker objects
     * @returns object
     */
    getInstance() {
        return this._instance;
    }

    /**
     * Returns if criteria is enabled by user
     * @returns bool
     */
    getIsEnabled() {
        return $('#criteriaEnabled_' + this.id).prop('checked');
    }

    /**
     * Returns criteria value
     * @returns mixed
     */
    getValue() { return null; }

    /**
     * Sets criteria value
     * @param {*} v 
     */
    setValue(v) {
        // must overload this function
    }

}

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
        for (var x in this.model) {
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
        for (var x in this.model) {
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
        for (var x in this.model) {
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
            var column = this.getColumn(name);
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
        for (var x in this.model) {
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

        var s = '';
        s += '<table id="' + this.id + '" class="table table-bordered table-hover table-report-section" data-report-section-id="' + this.id + '">';

        /**
         * HEADER ROW
         */
        s += '<thead>';
        s += '<tr class="report-row-header">';
        for (var y in this.model) {
            var cellModel = this.model[y];
            var cellStyle = 'font-weight:bold;';
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
        this.filter();
        this.sort();
        var previousRow = null;
        for (var x in this.data) {
            var row = this.data[x];
            if (!row['__visible']) {
                continue;
            }
            s += this.renderGroupHeader(row, previousRow);

            s += '<tr class="report-row-data">';
            for (var y in this.model) {
                var cellStyle = '';
                var cellModel = this.model[y];
                var cellValue = row[this.model[y].name];
                var cellDisplayValue = cellValue;

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

        if (!this.groupBy || this.groupBy.length <= 0) {
            // nothing to do
            return '';
        }

        var s = '';

        /**
         * Check first if we must close group in reverse order
         */
        for (var nLevel = this.getLevelCount(); nLevel >= 1; nLevel--) {

            if (previousRow == null || previousRow[this.groupCounters['level' + nLevel].name] != row[this.groupCounters['level' + nLevel].name]) {

                /**
                 * Close previous group with same level
                 */
                if (this.groupCounters['level' + nLevel]) {
                    // Level exists close it
                    s += `<tr class="report-row-group-footer" data-close-level="${nLevel}">`;
                    for (var y in this.model) {

                        var cellModel = this.model[y];
                        var cellStyle = 'font-weight:bold;';
                        var cellValue = ''
                        var cellDisplayValue = '';

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
        var nLevel = 1;
        for (var x in this.groupBy) {

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


        for (var x in this.groupCounters) {
            this.groupCounters[x].count++;
            this.grandTotal.count++;
            for (var y in this.model) {
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
        }

        return s;


    }

    /**
     * Closes all group sections and renders grand total line
     * @returns string
     */
    closeAllGroups() {
        if (!this.groupBy || this.groupBy.length <= 0) {
            // nothing to do
            return '';
        }

        var s = '';

        /**
         * Check first if we must close group in reverse order
         */
        for (var nLevel = this.getLevelCount(); nLevel >= 1; nLevel--) {

            /**
             * Close previous group with same level
             */
            if (this.groupCounters['level' + nLevel]) {
                // Level exists close it
                s += `<tr class="report-row-group-footer" data-close-level="${nLevel}">`;
                for (var y in this.model) {
                    var cellModel = this.model[y];
                    var cellStyle = 'font-weight:bold;';
                    var cellValue = '&nbsp;'
                    var cellDisplayValue = '';
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
        s += `<tr class="report-row-grand-total" data-close-level="${nLevel}">`;
        for (var y in this.model) {
            var cellModel = this.model[y];
            var cellStyle = 'font-weight:bold;';
            var cellValue = '&nbsp;'
            var cellDisplayValue = '';
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
        var counters = {};
        for (var x in this.model) {
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
        var nCount = 0;
        for (var x in this.groupCounters) {
            if (this.groupCounters[x]) { nCount++; }
        }
        return nCount;
    }

    /**
     * Filter model data using criteria values
     */
    filter() {

        /**
         * Make all rows visible
         */
        for (var x in this.data) {
            this.data[x]['__visible'] = true;
        }

        var aCriterias = this.criterias;
        for (var x in aCriterias) {

            /**
             * Check if criterias is enabled
             */
            if (!$('#criteriaEnabled_' + aCriterias[x].id).prop('checked')) {
                continue;
            }



            for (var r in this.data) {
                for (var a in aCriterias[x].applyTo) {

                    if (this.hasColumn(aCriterias[x].applyTo[a].field)) {

                        var criteriaValue = this.app.viewer.getCriteriaValue(aCriterias[x].id);

                        switch (aCriterias[x].type) {
                            case 'DatePeriodCriteria':
                                if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                            case 'SelectCriteria':
                                var selectedItems = criteriaValue.value;
                                var bFound = false;
                                for (var v in selectedItems) {
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
                                if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                            case 'CheckboxCriteria':
                                if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value) {
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
     * Sorts report data based on orderBy criterias of report section
     * @param {*} report 
     * @param {*} reportSection 
     */
    sort() {


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
     * Returns order by 
     * @param {*} name 
     * @returns object
     */
    getOrderBy(name) {
        if (this.orderBy) {
            for (var x in this.orderBy) {
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
            for (var x in this.groupBy) {
                if (this.groupBy[x].name == name) {
                    return this.groupBy[x];
                }
            }
        }

        return null;
    }

}
/**
 * Metadocx application
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
window.__Metadocx = {};

class MetadocxApplication {

    constructor() {

        /**
         * Metadocx version
         */
        this.version = '0.1.0';

        /**
         * Application modules 
         * 
         * All Module classes will be instanciated and 
         * loaded in this property for easy access
         */
        this.modules = {};

        /**
         * Array of callbacks that will be called after modules are loaded
         */
        this.onInitializeCallbacks = [];

        /**
         * The script tag that loaded this script
         * Used to pass parameters to the script directly in the DOM
         */
        this.scriptTag = null;

        /**
         * ReportViewer instance
         */
        this.viewer = new ReportViewer(this);

    }

    /**
     * Initializes application, this is the starting point of the app
     */
    initialize() {

        /**
         * Scan script tag data- attributes for options
         */
        this.loadScriptTagOptions();


        /**
         * MODULES 
         * 
         * List available modules in Metadocx namespace 
         */
        var aModules = [];
        for (var x in window.__Metadocx) {
            if (x.endsWith('Module')) {
                aModules.push(new window.__Metadocx[x](this));
            }
        }
        /**
         * Sort boot priority of modules and register them
         */
        aModules.sort((a, b) => {
            if (a.bootPriority < b.bootPriority) { return -1; }
            if (a.bootPriority > b.bootPriority) { return 1; }
            return 0;
        });

        /**
         * Initialize modules
         */
        console.groupCollapsed('[Metadocx] Modules initialization');
        for (var x in aModules) {
            this.registerModule(aModules[x]);
        }
        console.groupEnd();

        /**
         * Call other initialize callback scripts
         */
        for (var x in this.onInitializeCallbacks) {
            this.onInitializeCallbacks[x]();
        }

        /**
         * REQUIRED LIBRARIES 
         * Event once all libraries are loaded (if injected)
         */
        this.modules.Import.onLibrairiesLoaded = () => {
            /**
            * Build report view interface
            */
            this.modules.UI.renderReportViewer(this);

            if (this.viewer.options.report) {
                this.viewer.load(this.viewer.options.report);
            } else {
                this.viewer.showNoReportAlert();
            }
        }
        /**
         * Inject required js and css files
         */
        this.modules.Import.injectRequiredLibraries();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

    }

    /**
     * Gets script tag data attributes and applies them to report options
     */
    loadScriptTagOptions() {

        this.scriptTag = document.querySelector('script[src$="metadocx.js"]');
        if (this.scriptTag == null) {
            this.scriptTag = document.querySelector('script[src$="metadocx.min.js"]');
        }

        for (var x in this.scriptTag.dataset) {
            this.viewer.options[x] = this.scriptTag.dataset[x];
        }

        /**
         * Check if we have a name if not set default value
         */
        if (!this.viewer.options.id) {
            this.viewer.options.id = "metadocxReport";
        }

        if (!this.viewer.options.container) {
            this.viewer.options.container = "root";
        }

    }


    /**
     * Adds module to Metadocx object and initializes the module
     * @param {*} oModule 
     */
    registerModule(oModule) {
        this.modules[oModule.name] = oModule;
        oModule.initialize();
        oModule.app = this;
    }


}
/** 
 * Application Module
 * 
 * Modules classes can be loaded using boot priority and 
 * will be made available in Metadocx.module property
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Module extends Consolable {

    constructor(app) {

        super(app);

        /**
         * Set name of module, remove the Module suffix to the class name
         * Modules will be added in Metadocx.modules 
         */
        this.name = this.constructor.name.replace(/Module$/, '');
        this.tag = this.constructor.name.replace(/Module$/, '');
        /**
         * Indicates if the module has been initialized or not
         */
        this.isInitialized = false;

        /**
         * Modules will be loaded using bootPriority from lowest to highest
         * This allows us to load modules in a specific order if needed
         */
        this.bootPriority = 1000;

        /**
         * Reference to Metadocx application
         */
        this.app = app;

    }

    /**
     * Initialize module     
     */
    initialize() {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;

        this.log('Initializing module ' + this.name);
    }

}
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
/** 
 * DataTable Report section
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataTableReportSection extends ReportSection {

    constructor(app, report, reportSection) {
        super(app, report, reportSection);
    }


    render() {

        var oTable = new DataTable(this.app);
        oTable.id = 'ReportSection_' + this.reportSection.id;
        oTable.data = this.reportSection.data;
        oTable.model = this.reportSection.model;
        oTable.orderBy = this.reportSection.orderBy;
        oTable.groupBy = this.reportSection.groupBy;
        oTable.criterias = this.getApplicableReportCriterias();
        oTable.criteriaValues = this.app.viewer.getCriteriaValues();

        var s = '';

        this.preRender();

        s += '<div class="report-section-title">';
        if (this.app.viewer.report.getReportDefinition().properties.name) {
            s += '<h1 class="report-title">' + this.app.viewer.report.getReportDefinition().properties.name + '</h1>';
        }
        if (this.app.viewer.report.getReportDefinition().properties.description) {
            s += '<h4 class="report-description">' + this.app.viewer.report.getReportDefinition().properties.description + '</h4>';
        }
        s += '<hr>';
        s += '</div>';

        s += oTable.render();

        return s;

    }

    getColumn(name) {
        for (var x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                return this.reportSection.model[x];
            }
        }
        return null;
    }

    setColumn(name, column) {
        for (var x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                this.reportSection.model[x] = column;
                return true;
            }
        }
        return false;
    }

    hasColumn(name) {
        for (var x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                return true;
            }
        }
        return false;
    }

    isColumnVisible(name) {
        if (this.hasColumn(name)) {
            var column = this.getColumn(name);
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
        for (var x in this.reportSection.model) {
            if (this.reportSection.model[x].name == name) {
                this.reportSection.model[x].visible = false;
            }
        }
    }


}
window.__Metadocx.DataTableReportSection = DataTableReportSection;

/** 
 * Report
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Report {

    constructor() {

        /**
         * Report id
         */
        this.id = null;

        /**
         * Indicates if report is loaded or not
         */
        this.isLoaded = false;

        /**
         * Report definition object
         */
        this._reportDefinition = null;


        /**
         * Reference to Metadocx app
         */
        this.app = null;

        /**
         * Indicates if we rendered the report criteria html and js
         */
        this._reportCriteriasRendered = false;

        /**
         * Indicates if we rendered the report settings html and js
         */
        this._reportSettingsRendered = false;

        /**
         * Copy of initial criteria values
         */
        this._initialCriteriaValues = null;

        /**
         * Copy of initial report settings
         */
        this._initialReportSettings = null;

        /**
         * Event called when report is loaded on screen
         */
        this.onReportLoaded = null;

        /**
         * Event called when report definition file is loaded
         */
        this.onReportDefinitionFileLoaded = null;

    }

    /**
     * Set report unique id
     * @param {*} id 
     * @returns 
     */
    setId(id) {
        this.id = id;
        return this;
    }

    /**
     * Returns report unique id
     * @returns 
     */
    getId() {
        return this.id;
    }

    /**
    * Loads report definition file
    */
    loadReportDefinition(reportDefinitionUrl) {

        if (reportDefinitionUrl != undefined) {
            this._reportDefinitionUrl = reportDefinitionUrl;
        }

        console.log('Report definition file is ' + this._reportDefinitionUrl);

        if (this._reportDefinition === null) {
            $.get(this._reportDefinitionUrl, (data, status) => {
                this._reportDefinition = data;
                /**
                 * Copy Report definition options to viewer options, replaces default values
                 */
                this.app.modules.DataType.copyObjectProperties(this.getReportDefinition().options, this.app.viewer.options);

                if (this.onReportDefinitionFileLoaded) {
                    this.onReportDefinitionFileLoaded();
                }
            });
        } else {
            if (this.onReportDefinitionFileLoaded) {
                this.onReportDefinitionFileLoaded();
            }
        }

    }

    /**
     * Returns select options for paper sizes
     * @returns 
     */
    getPaperSizeOptions() {
        var s = '';
        for (var x in this.pageSizes) {
            s += '<option value="' + this.pageSizes[x].name + '">' + this.pageSizes[x].name + '</option>';
        }
        return s;
    }



    /**
     * Report definition object
     * @returns ReportDefinition
     */
    getReportDefinition() {
        return this._reportDefinition;
    }

    /**
     * Report definition url
     * @returns Report
     */
    setReportDefinitionUrl(reportDefinitionUrl) {
        this._reportDefinitionUrl = reportDefinitionUrl;
        return this;
    }

    /**
     * Returns report file definition url
     * @returns 
     */
    getReportDefinitionUrl() {
        return this._reportDefinitionUrl;
    }

    /**
     * Prints report
     */
    print() {
        if (this.app.viewer.options.printing.method == 'browser') {
            // Use default browser print 
            window.print();
        } else if (this.app.viewer.options.printing.method == 'pdf') {
            // Export as pdf and print the pdf file
            this.app.modules.PDF.print();
        }
    }

    /**
     * Close window if window was open by script
     */
    close() {
        window.close();
    }

    /**
     * Export / Convert report to a specific format
     * @param {*} format 
     */
    exportReport(format) {
        this.app.modules[format].showExportDialog();
    }

    /**
     * Renders report settings html
     * @returns 
     */
    renderReportSettings() {

        if (this._reportSettingsRendered) {
            return;
        }

        var s = '';

        s += `<div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0">Report properties</h4>
                </div>
                <div class="card-body">     
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsName">Name</label>
                        <input class="form-control" type="text" id="reportSettingsName" placeholder="Report name" value="${this.getReportDefinition().properties.name}">
                    </div> 
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsDescription">Description</label>
                        <input class="form-control" type="text" id="reportSettingsDescription" placeholder="Report description" value="${this.getReportDefinition().properties.description}">                        
                    </div> 
                </div>
            </div>`;

        for (var kSection in this.getReportDefinition().sections) {
            var oSection = this.getReportDefinition().sections[kSection];
            var sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            var sFields = '<table id="' + oSection.id + '_fields" class="table table-condensed report-sortable">';
            sFields += '<tbody>';
            for (var x in oSection.model) {

                var sFieldSelected = ' checked';
                if (!oReportSection.isColumnVisible(oSection.model[x].name)) {
                    sFieldSelected = '';
                }

                sFields += `<tr data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                    <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                    <td style="width:30px;text-align:center;"><input id="${oSection.id}_field_${oSection.model[x].name}" type="checkbox"${sFieldSelected}/></td>
                    <td id="${oSection.id}_label_${oSection.model[x].name}">${oSection.model[x].label}</td>
                    <td style="width:150px;">
                        <select id="${oSection.id}_formula_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                            <option value=""${(oSection.model[x].formula == '' ? ' selected' : '')}>(None)</option>
                            <option value="SUM"${(oSection.model[x].formula == 'SUM' ? ' selected' : '')}>Sum</option>
                            <option value="AVG"${(oSection.model[x].formula == 'AVG' ? ' selected' : '')}>Average</option>
                            <option value="MIN"${(oSection.model[x].formula == 'MIN' ? ' selected' : '')}>Min Value</option>
                            <option value="MAX"${(oSection.model[x].formula == 'MAX' ? ' selected' : '')}>Max Value</option>
                            <option value="COUNT"${(oSection.model[x].formula == 'COUNT' ? ' selected' : '')}>Count</option>
                        </select>
                    </td>
                    <td style="width:30px;">
                        <button class="btn btn-sm" onClick="Metadocx.viewer.showFieldPropertiesDialog('${oSection.id}', '${oSection.model[x].name}');"><i class="uil uil-ellipsis-h fs20"></i></button>
                    </td>
                </tr>`;
            }
            sFields += '</tbody>';
            sFields += '</table>';

            /**
             * ORDER BY 
             */
            var sOrderBy = '<table id="' + oSection.id + '_orderBy" class="table table-condensed report-sortable">';
            sOrderBy += '<tbody>';
            for (var x in oSection.model) {


                var oOrderBy = oReportSection.getOrderBy(oSection.model[x].name);

                var sAscSelected = '';
                var sDescSelected = '';
                var sOrderBySelected = '';
                if (oOrderBy != null) {
                    if (oOrderBy.order == 'desc') {
                        sAscSelected = '';
                        sDescSelected = ' selected';
                    } else {
                        sAscSelected = ' selected';
                        sDescSelected = '';
                    }
                    sOrderBySelected = ' checked';
                }

                sOrderBy += `<tr id="${oSection.id}_orderByRow_${oSection.model[x].name}" data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                                <td style="width:30px;text-align:center;"><input id="${oSection.id}_orderBy_${oSection.model[x].name}" type="checkbox"${sOrderBySelected}/></td>
                                <td>${oSection.model[x].label}</td>
                                <td style="width:150px;">
                                    <select id="${oSection.id}_orderByOrder_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                                        <option value="asc"${sAscSelected}>Ascending</option>
                                        <option value="desc"${sDescSelected}>Descending</option>                                    
                                    </select>
                                </td>
                            </tr>`;
            }
            sOrderBy += '</tbody>';
            sOrderBy += '</table>';

            /**
             * GROUP BY 
             */
            var sGroupBy = '<table id="' + oSection.id + '_groupBy" class="table table-condensed report-sortable">';
            sGroupBy += '<tbody>';
            for (var x in oSection.model) {

                var oGroupBy = oReportSection.getGroupBy(oSection.model[x].name);

                var sAscSelected = '';
                var sDescSelected = '';
                var sGroupBySelected = '';
                if (oGroupBy !== null) {
                    if (oGroupBy.order == 'desc') {
                        sAscSelected = '';
                        sDescSelected = ' selected';
                    } else {
                        sAscSelected = ' selected';
                        sDescSelected = '';
                    }
                    sGroupBySelected = ' checked';
                }

                sGroupBy += `<tr id="${oSection.id}_groupByRow_${oSection.model[x].name}" data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                                <td style="width:30px;text-align:center;"><input id="${oSection.id}_groupBy_${oSection.model[x].name}" type="checkbox"${sGroupBySelected}/></td>
                                <td>${oSection.model[x].label}</td>
                                <td style="width:150px;">
                                <select id="${oSection.id}_groupByOrder_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                                    <option value="asc"${sAscSelected}>Ascending</option>
                                    <option value="desc"${sDescSelected}>Descending</option>                                    
                                </select></td>
                            </tr>`;
            }
            sGroupBy += '</tbody>';
            sGroupBy += '</table>';

            /**
             * Main section card
             */
            s += `<div class="card">
                            <div class="card-header">
                                <h4 class="card-title mb-0">${oSection.properties.name}</h4>
                            </div>
                            <div class="card-body">              
                                <div class="accordion accordion-flush" id="reportSettingsAccordion${oSection.properties.name}">
                                    <div class="accordion-item">
                                        <h2 id="settingsFieldsHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsFieldsBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-columns fs20"></i>&nbsp;Fields
                                            </button>
                                        </h2>
                                        <div id="settingsFieldsBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sFields}
                                            </div>
                                        </div>
                                    </div>   
                                    
                                    <div class="accordion-item">
                                        <h2 id="settingsOrderByHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsOrderByBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-sort-amount-down fs20"></i>&nbsp;Order
                                            </button>
                                        </h2>
                                        <div id="settingsOrderByBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sOrderBy}
                                            </div>
                                        </div>
                                    </div>   

                                    <div class="accordion-item">
                                        <h2 id="settingsGroupByHeader_${oSection.properties.name}" class="accordion-header">
                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsGroupByBody_${oSection.properties.name}" aria-expanded="false" aria-controls="flush-collapseOne">                                                                        
                                                <i class="uil uil-layer-group fs20"></i>&nbsp;Groups
                                            </button>
                                        </h2>
                                        <div id="settingsGroupByBody_${oSection.properties.name}" class="accordion-collapse collapse" aria-labelledby="reportSettingsAccordion${oSection.properties.name}">
                                            <div class="accordion-body">                                    
                                                ${sGroupBy}                             
                                            </div>
                                        </div>
                                    </div>   
                                </div>                                                                                                             
                            </div>
                        </div>`;


        }

        s += `
        <div class="float-end">
            <button class="btn btn-secondary mr5" onClick="Metadocx.viewer.cancelSettings();">Cancel</button>
            <button class="btn btn-primary" onClick="Metadocx.viewer.applySettings();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;Apply Settings</button>
        </div>
       `;

        $('#' + this.id + '_reportSettingsZone').html(s);
        $('.report-sortable tbody').sortable({
            placeholder: 'ui-state-highlight',
            helper: 'clone',
            update: function (e, ui) {
                console.log(e);
                console.log(ui);
            },
        });


        for (var kSection in this.getReportDefinition().sections) {

            var oSection = this.getReportDefinition().sections[kSection];
            var oReportSection = new ReportSection(this.app, this, oSection);

            /**
             * Reorder table rows based on orderby and groupby config
             */
            var reversedKeys = Object.keys(oSection.orderBy).reverse();
            reversedKeys.forEach(key => {
                //console.log(key, oSection.orderBy[key]);                
                $('#' + oSection.id + '_orderByRow_' + oSection.orderBy[key].name).prependTo('#' + oSection.id + '_orderBy');
            });


            /**
             * Reorder table rows based on orderby and groupby config
             */
            reversedKeys = Object.keys(oSection.groupBy).reverse();
            reversedKeys.forEach(key => {
                //console.log(key, oSection.orderBy[key]);                
                $('#' + oSection.id + '_groupByRow_' + oSection.groupBy[key].name).prependTo('#' + oSection.id + '_groupBy');
            });
        }

        this._reportSettingsRendered = true;

    }

    /**
     * Renders report criteria controls HTML
     * @returns string
     */
    renderReportCriterias() {


        if (this._reportCriteriasRendered) {
            return;
        }

        // $('#criteriaDetails_Department').collapse('show')
        // $('#criteriaDetails_Department').collapse('hide')

        var sCriterias = '';
        var aCriterias = [];
        for (var x in this.getReportDefinition().criterias) {

            var oCriteria = new window.__Metadocx[this.getReportDefinition().criterias[x].type](this.app);
            oCriteria.id = this.getReportDefinition().criterias[x].id;
            oCriteria.reportCriteria = this.getReportDefinition().criterias[x];
            aCriterias.push(oCriteria);

            sCriterias += `<div class="accordion-item">
                            <h2 id="criteriaTitle${this.getReportDefinition().criterias[x].id}" class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#criteriaDetails_${this.getReportDefinition().criterias[x].id}" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div class="form-check form-switch form-switch-lg">
                                        <input class="form-check-input" type="checkbox" role="switch" id="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">
                                        <label class="form-check-label" for="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">&nbsp;</label>
                                    </div>                                
                                    ${this.getReportDefinition().criterias[x].name}
                                </button>
                            </h2>
                            <div id="criteriaDetails_${this.getReportDefinition().criterias[x].id}" class="accordion-collapse collapse" aria-labelledby="criteriaTitle${this.getReportDefinition().criterias[x].id}">
                                <div class="accordion-body">                                    
                                    <p>${this.getReportDefinition().criterias[x].description}</p>
                                    ${oCriteria.render()}                                    
                                </div>
                            </div>
                        </div>`;
        }

        var s = `<div class="accordion accordion-flush" id="reportCriteriaAccordion">
                  ${sCriterias}  
                </div>`;

        $('#' + this.id + '_criteriasBody').html(s);

        /**
         * Load JS code for components
         */
        for (var x in aCriterias) {
            aCriterias[x].initializeJS();
        }
        this.app.viewer.criterias = aCriterias;

        this._reportCriteriasRendered = true;


    }


    /**
     * Applies criteria values to report
     */
    applyCriterias() {

        this.hideReportCriterias();
        this.app.viewer.refreshReport();
    }

    /**
     * Displays report criteria section
     */
    showReportCriterias() {

        this._initialCriteriaValues = this.app.viewer.getCriteriaValues();

        $('#' + this.id + '_canvas').hide();
        $('#' + this.id + '_criteriasZone').show();
    }

    /**
     * Hides report criteria section
     */
    hideReportCriterias() {

        $('#' + this.id + '_criteriasZone').hide();
        $('#' + this.id + '_canvas').show();
    }

    /**
     * Cancels report criterias, does not apply changes
     */
    cancelCriterias() {
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.viewer.getCriteriaValues())) {
            // Criteria values have changed, confirm?
            // @todo reset criterias
        }

        this.hideReportCriterias();
    }

    /**
     * Reset criteria values to original values
     */
    resetCriterias() {
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.viewer.getCriteriaValues())) {
            // Criteria values have changed, confirm?
            // @todo reset criterias
        }

        this.hideReportCriterias();
    }

    /**
     * Makes a copy of original settings and criteria values
     * Used to reset properties of report
     */
    copyOriginalSettings() {
        this._initialCriteriaValues = this.app.viewer.getCriteriaValues();
        this._initialReportSettings = {
            sections: [],
        }
        for (var x in this.getReportDefinition().sections) {
            var oSection = this.getReportDefinition().sections[x];
            this._initialReportSettings['sections'] = {
                id: oSection.id,
                properties: JSON.parse(JSON.stringify(oSection.properties)),
                orderBy: JSON.parse(JSON.stringify(oSection.orderBy)),
                groupBy: JSON.parse(JSON.stringify(oSection.groupBy)),
                model: JSON.parse(JSON.stringify(oSection.model)),
            }
        }
    }

    getReportSections() {

        return this.getReportDefinition().sections;

    }

    getReportSection(id) {

        for (var x in this.getReportDefinition().sections) {
            if (this.getReportDefinition().sections[x].id == id) {
                return this.getReportDefinition().sections[x];
            }
        }

        return null;

    }




}
/** 
 * Report Canvas
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportCanvas {

    constructor(app, report, viewer) {
        this.app = app;
        this.report = report;
        this.viewer = viewer;
    }

    /**
     * Renders page (canvas) where report will be rendered
     * @returns 
     */
    render() {

        var s = '';
        var sReportSection = '';
        for (var x in this.report.getReportDefinition().sections) {

            var sReportSectionType = this.report.getReportDefinition().sections[x].type + 'ReportSection';
            var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportDefinition().sections[x]);
            sReportSection += oReportSection.render();

        }

        s += `<div id="reportPage" class="report-page orientation-${this.viewer.options.page.orientation} size-${this.viewer.options.page.paperSize.toString().toLowerCase()}">                
                <div id="reportContent">
                    <style id="${this.viewer.options.id}_style">
                    </style>
                    ${sReportSection}
                </div>
            </div>`;

        return s;

    }

}
window.__Metadocx.ReportCanvas = ReportCanvas;
/** 
 * ReportViewer, renders report viewer UI interface 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportViewer extends Consolable {

    constructor(app) {
        super();
        /**
         * Report criterias
         */
        this.criterias = null;
        /**
         * Initial criteria values on load
         */
        this.originalCriteriaValues = null;
        /**
         * Reference to main app
         */
        this.app = app;
        /**
         * Report viewer options
         */
        this.options = null;
        /**
         * Option Proxy instance
         */
        this._optionsProxy = null;
        /**
         * Options dialog instance 
         */
        this.optionsDialog = null;
        /**
         * Field properties dialog instance 
         */
        this.fieldPropertiesDialog = null;
        /**
         * Settings offcanvas reference
         */
        this.settingsOffCanvas = null;
        /**
         * 
         */
        this._bDisableApplyReportViewerOptions = false;

        /**
         * Report instance displayed in report viewer
         */
        this.report = new Report();

        /**
         * Initialize options with default options
         */
        this.loadDefaultOptions();

    }

    /**
     * Load report default options
     */
    loadDefaultOptions() {

        this.log('Loading default options');

        this.options = {
            "id": "metadocxReport",
            "toolbar": {
                "showOptionsButton": true,
                "showSettingsButton": true,
                "showCriteriasButton": true,
                "showPrintButton": true,
                "showExportButton": true,
                "showCloseButton": true
            },
            "exportFormats": {
                "pdf": true,
                "word": false,
                "excel": false
            },
            "page": {
                "orientation": "portrait",
                "paperSize": "Letter",
                "margins": {
                    "top": 0.5,
                    "bottom": 0.5,
                    "left": 0.5,
                    "right": 0.5
                }
            },
            "settings": {
                "fields": true,
                "fieldsReorder": true,
                "fieldsSelection": true,
                "fieldsFormula": true,

                "orderBy": true,
                "orderByReorder": true,
                "orderBySelection": true,
                "orderByOrder": true,

                "groupBy": true,
                "groupByReorder": true,
                "groupBySelection": true,
                "groupByOrder": true
            },
            "formats": {
                "date": {
                    "format": "YYYY-MM-DD"
                },
                "boolean": {
                    "format": {
                        "trueValue": "Yes",
                        "falseValue": "No",
                        "ALL": "All"
                    }
                },
                "number": {
                    "format": "0.00"
                }
            },
            "printing": {
                "method": "pdf"
            }
        };

        this.options = new Proxy(this.options, ProxyHandler);

    }

    /**
     * Loads a report definition file
     */
    load(reportDefinitionUrl) {

        /**
         * If we have a report definition file passed as parameter, load it and render
         */
        if (reportDefinitionUrl) {
            this.log('Loading report ' + reportDefinitionUrl);
            /**
             * Create report object
             */
            if (this.report === null) {
                this.report = new Report();
            }
            this.report.app = this.app;

            window[this.options.id] = this.report;
            this.report.setId(this.options.id);

            this.report.onReportLoaded = () => {
                this.applyReportViewerOptions();
            }

            this.report.onReportDefinitionFileLoaded = () => {
                this.refreshReport();
            }

            this.report.loadReportDefinition(reportDefinitionUrl);
            this.applyReportViewerOptions();
            this.originalCriteriaValues = this.getCriteriaValues();

        }

    }


    applyReportViewerOptions() {

        if (this._bDisableApplyReportViewerOptions) {
            return;
        }

        if (!this.report.isLoaded) {
            // Report is not yet loaded hide all toolbar buttons
            $('.report-toolbar-button').hide();
            return;
        }


        $('#' + this.options.id + '_headerName').html(this.report.getReportDefinition().properties.name);
        $('#' + this.options.id + '_headerDescription').html(this.report.getReportDefinition().properties.description);

        $('.report-toolbar-button').show();

        if (this.options.toolbar.showExportButton) {
            $('#' + this.options.id + '_export').show();
        } else {
            $('#' + this.options.id + '_export').hide();
        }

        if (this.options.toolbar.showPrintButton) {
            $('#' + this.options.id + '_print').show();
        } else {
            $('#' + this.options.id + '_print').hide();
        }

        if (this.options.toolbar.showCriteriasButton) {
            $('#' + this.options.id + '_criterias').show();
        } else {
            $('#' + this.options.id + '_criterias').hide();
        }

        if (this.options.toolbar.showSettingsButton) {
            $('#' + this.options.id + '_settings').show();
        } else {
            $('#' + this.options.id + '_settings').hide();
        }

        if (this.options.toolbar.showOptionsButton) {
            $('#' + this.options.id + '_options').show();
        } else {
            $('#' + this.options.id + '_options').hide();
        }

        if (this.options.toolbar.showCloseButton && window.opener != null) {
            $('#' + this.options.id + '_close').show();
        } else {
            $('#' + this.options.id + '_close').hide();
        }



    }

    /**
     * Renders the report viewer
     */
    render() {
        this.log('Report viewer render');
        var s = '';

        s += this.renderMainLayout();
        s += this.renderReportCriterias();
        s += this.renderOptionsDialog();
        s += this.renderReportSettings();
        s += this.renderFieldPropertiesDialog();

        $('#' + this.options.container).html(s);
        $('.report-viewer-criterias').hide();

    }

    /**
     * Displays info section when no report definition file is supplied
     */
    showNoReportAlert() {

        this.log('No report data, displaying no report warning');
        var s = `<div class="alert alert-warning mb-0 report-no-definition" role="alert">
                    <h4 class="alert-heading">Missing report definition</h4>
                    <p>Oups! Something went wrong. We did not get a report to load.</p>                    
                </div>`;

        $('#' + this.app.viewer.options.id + '_canvas').html(s);
        $('.report-toolbar-button').hide();
    }

    /**
     * Renders main layout html of report viewer
     * @returns 
     */
    renderMainLayout() {

        this.log('Render main layout');
        var sCloseButtonClasses = '';
        if (window.opener == null) {
            // This window is not open by script can not use close button
            sCloseButtonClasses = ' hidden';
        }

        var sExportPDFClasses = '';
        if (!this.options.exportFormats.pdf) {
            sExportPDFClasses = ' hidden';
        }
        var sExportWordClasses = '';
        if (!this.options.exportFormats.word) {
            sExportWordClasses = ' hidden';
        }
        var sExportExcelClasses = '';
        if (!this.options.exportFormats.excel) {
            sExportExcelClasses = ' hidden';
        }

        /**
         * Main layout
         */
        return `<header id="${this.options.id}_header" class="page-topbar no-print">
             <div class="navbar-header">
                 <div class="d-flex">
                     <div class="ms-4">
                         <div class="report-header-icon">
                            <i class="uil uil-file-graph" style="font-size: 36px;line-height: 36px;"></i>
                         </div>
                         <div class="report-header-title-section">
                            <div id="${this.options.id}_headerName" class="report-header-title"></div>
                            <div id="${this.options.id}_headerDescription" class="report-header-description"></div>
                         </div>
                     </div>
                 </div>
                 <div class="d-flex">                   
                     <div class="btn-group me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_export" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-file-export"></i>
                         </button>
                         <div class="dropdown-menu">
                             <a id="${this.options.id}_exportPdf" class="dropdown-item${sExportPDFClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('PDF');">PDF</a>
                             <a id="${this.options.id}_exportExcel" class="dropdown-item${sExportExcelClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('Excel');">Excel</a>
                             <a id="${this.options.id}_exportWord" class="dropdown-item${sExportWordClasses}" href="#" onClick="Metadocx.viewer.report.exportReport('Word');">Word</a>
                         </div>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_print" type="button" class="btn header-item" onClick="Metadocx.viewer.report.print();"><i class="uil uil-print"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_criterias" type="button" class="btn header-item" onClick="Metadocx.viewer.report.showReportCriterias();"><i class="uil uil-filter"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_settings" type="button" class="btn header-item" onClick="Metadocx.viewer.showReportSettings();"><i class="uil uil-file-graph"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_options" type="button" class="btn header-item" onClick="Metadocx.viewer.showReportOptions();"><i class="uil uil-cog"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button${sCloseButtonClasses}">
                         <button id="${this.options.id}_close" type="button" class="btn header-item" onClick="Metadocx.viewer.report.close();"><i class="uil uil-times"></i></button>
                     </div>
                 </div>
             </div>
         </header>
         <div id="${this.options.id}_canvas" class="report-viewer-canvas">
         </div>
         <div class="powered-by no-print">powered by <a href="https://www.metadocx.com" target="_blank">Metadocx</a></div>`;

    }

    /**
     * Renders report criteria sections html, criterias will be rendered by the report object
     * @returns 
     */
    renderReportCriterias() {

        this.log('Render report criterias');
        return `<div id="${this.options.id}_criteriasZone" class="report-viewer-criterias">
                    <div class="page-content">
                        <div class="container-fluid">
                            <div class="row">                                
                                <div class="col-12">                                
                                    <div class="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 class="mb-0">Criterias</h4>
                                        <div class="d-flex">
                                            <button class="btn btn-primary mr5" onClick="Metadocx.viewer.report.applyCriterias();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;Apply criterias</button>
                                            <button class="btn btn-danger mr5" onClick="Metadocx.viewer.report.resetCriterias();">Reset</button>
                                            <button class="btn btn-secondary" onClick="Metadocx.viewer.report.cancelCriterias();">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div id="${this.options.id}_criteriasBody" class="card-body">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>            
                        </div>
                    </div>
                </div>`;
    }

    /**
     * Render report options dialoag html
     * @returns 
     */
    renderOptionsDialog() {

        /**
         * Options dialog
         */
        this.log('Render report options dialog');

        return `<div id="${this.options.id}_optionsDialog" class="modal" tabindex="-1">
               <div class="modal-dialog">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 class="modal-title">Options</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="d-flex justify-content-between">
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold">Orientation</label>
                             
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationPortrait">
                                     <label class="form-check-label" for="orientationPortrait">
                                         Portrait
                                     </label>
                                 </div>
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationLandscape">
                                     <label class="form-check-label" for="orientationLandscape">
                                         Landscape
                                     </label>
                                 </div>
                             </div>
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold">Paper size</label>
                                 <select id="paperSize" class="form-select">
                                 ${this.app.modules.Printing.getPaperSizeOptions()}
                                 </select>
                             </div>
                         </div>
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold">Margins</label>
                             
                                 <div class="mb-3 row">
                                     <label for="topMargin" class="col-sm-4 col-form-label">Top</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="topMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="bottomMargin" class="col-sm-4 col-form-label">Bottom</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="bottomMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="leftMargin" class="col-sm-4 col-form-label">Left</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="leftMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="rightMargin" class="col-sm-4 col-form-label">Right</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="rightMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label">in.</label>
                                 </div>                                                    
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
                     <button type="button" class="btn btn-primary" onClick="Metadocx.viewer.applyOptions();"><i class="fa-solid fa-check"></i>&nbsp;Apply Options</button>
                 </div>
                 </div>
             </div>
             </div>`;

    }

    /**
     * Render report field properties dialog html
     * @returns 
     */
    renderFieldPropertiesDialog() {

        /**
         * Field properties dialog
         */
        this.log('Render report field properties dialog');

        return `<div id="${this.options.id}_fieldPropertyDialog" class="modal modal-lg" tabindex="-1" data-backdrop="false">
               <div class="modal-dialog">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 class="modal-title">Properties</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                    <div class="row">
                            <div class="col-6">
                                <div class="mb-3" style="display:none;">
                                <label for="fieldSectionID" class="col-form-label">Section ID</label>                            
                                <input type="text" class="form-control" id="fieldSectionID" readonly value=""/>
                            </div>
                            <div class="mb-3" style="display:none;">
                                <label for="fieldName" class="col-form-label">Name</label>                            
                                <input type="text" class="form-control" id="fieldName" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldLabel" class="col-form-label">Label</label>                            
                                <input type="text" class="form-control" id="fieldLabel" value=""/>                            
                            </div>
                            <div class="mb-3">
                                <label for="fieldWidth" class="col-form-label">Width (px)</label>                            
                                <input type="number" class="form-control" id="fieldWidth" value=""/>                            
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="fieldVisible">
                                <label class="form-check-label" for="fieldVisible">
                                    Is Visible
                                </label>
                            </div>
                        
                        </div>
                        <div class="col-6">
                            
                            <div class="mb-3" style="display:none;">
                                <label for="fieldType" class="col-form-label">Type</label>                            
                                <input type="text" class="form-control" id="fieldType" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldAlign" class="col-form-label">Alignment</label>                            
                                <select id="fieldAlign" class="form-control">
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="center">Center</option>
                                </select>
                            </div>

                            <div id="fieldFormula_container" class="mb-3">
                                <label for="fieldFormula" class="col-form-label">Formula</label>                            
                                <select id="fieldFormula" class="form-control">
                                    <option value="">(None)</option>
                                    <option value="SUM">Sum</option>
                                    <option value="AVG">Average</option>
                                    <option value="MIN">Min Value</option>
                                    <option value="MAX">Max Value</option>
                                    <option value="COUNT">Count</option>
                                </select>
                            </div>

                            <div id="fieldFormat_container" class="mb-3">
                                <label for="fieldFormat" class="col-form-label">Format</label>                            
                                <input type="text" class="form-control" id="fieldFormat" value=""/>                            
                            </div>                            
                        
                        </div>
                    </div>    

                     
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
                     <button type="button" class="btn btn-primary" onClick="Metadocx.viewer.applyFieldProperties();"><i class="fa-solid fa-check"></i>&nbsp;Apply Properties</button>
                 </div>
                 </div>
             </div>
             </div>`;

    }

    /**
     * Render report settings offcanvas html
     * @returns 
     */
    renderReportSettings() {

        this.log('Render report settings offcanvas');

        return `<div id="${this.options.id}_settingsOffCanvas" class="offcanvas offcanvas-end report-section-offcanvas" data-bs-backdrop="static" tabindex="-1" aria-labelledby="${this.options.id}_settingsOffCanvasLabel">
                    <div class="offcanvas-header">
                        <h5 id="${this.options.id}_settingsOffCanvasLabel" class="offcanvas-title">Report Settings</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div id="${this.options.id}_reportSettingsZone" class="offcanvas-body">
                        
                    </div>
                </div>`;

    }

    /**
     * Display report options in a modal dialog
     */
    showFieldPropertiesDialog(sectionID, fieldName) {

        if (this.fieldPropertiesDialog === null) {
            this.fieldPropertiesDialog = new bootstrap.Modal('#' + this.options.id + '_fieldPropertyDialog', {})
        }

        var sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        var field = oReportSection.getColumn(fieldName);

        $('#fieldSectionID').val(sectionID);
        $('#fieldName').val(field.name);
        $('#fieldType').val(field.type);
        $('#fieldLabel').val(field.label);

        var bIsVisible = true;
        if (field.visible != undefined) {
            bIsVisible = this.app.modules.DataType.toBool(field.visible);
        }

        $('#fieldVisible').prop('checked', bIsVisible);

        if (field.formula != undefined) {
            $('#fieldFormula').val(field.formula);
        }
        if (field.format != undefined) {
            $('#fieldFormat').val(field.format);
        }
        if (field.width != undefined) {
            $('#fieldWidth').val(field.width);
        }


        if (field.type == 'number') {
            $('#fieldFormula_container').show();
            $('#fieldFormat_container').show();
        } else {
            $('#fieldFormula_container').hide();
            $('#fieldFormat_container').hide();
        }



        this.fieldPropertiesDialog.show();
    }

    applyFieldProperties() {

        var sectionID = $('#fieldSectionID').val();
        var fieldName = $('#fieldName').val();

        var sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        var oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        var field = oReportSection.getColumn(fieldName);

        field.label = $('#fieldLabel').val();
        if ($('#fieldWidth').val() != '') {
            field.width = parseInt($('#fieldWidth').val());
        } else {
            field.width = '';
        }
        field.visible = $('#fieldVisible').prop('checked');

        if (field.type == 'number') {
            if ($('#fieldFormula').val() != '') {
                field.formula = $('#fieldFormula').val();
            } else {
                field.formula = '';
            }

            if ($('#fieldFormat').val() != '') {
                field.format = $('#fieldFormat').val();
            } else {
                field.format = '';
            }
        }

        field.align = $('#fieldAlign').val();

        oReportSection.setColumn(fieldName, field);
        this.refreshReportSettings();
        this.refreshReport();

        this.fieldPropertiesDialog.hide();
    }

    /**
     * Returns object of all criteria values
     * @returns 
     */
    getCriteriaValues() {

        var values = {};
        if (this.criterias) {
            for (var x in this.criterias) {
                values[this.criterias[x].id] = {
                    id: this.criterias[x].id,
                    enabled: this.criterias[x].getIsEnabled(),
                    value: this.criterias[x].getValue(),
                }
            }
        }

        return values;
    }

    /**
     * Returns a specific criteria value
     * @param {*} criteria 
     * @returns 
     */
    getCriteriaValue(criteriaName) {
        return this.getCriteriaValues()[criteriaName];
    }

    /**
     * Returns criteria 
     * @param {*} id 
     * @returns 
     */
    getCriteria(id) {
        if (this.criterias) {
            for (var x in this.criterias) {
                if (this.criterias[x].id == id) {
                    return this.criterias[x];
                }
            }
        }
    }

    /**
     * Returns is a specific criteria is enabled or not
     * @param {*} id 
     * @returns 
     */
    isCriteriaEnabled(id) {
        return this.getCriteria(id).getIsEnabled();
    }

    /**
     * Display report options in a modal dialog
     */
    showReportOptions() {

        if (this.optionsDialog === null) {
            this.optionsDialog = new bootstrap.Modal('#' + this.options.id + '_optionsDialog', {})
        }

        if (this.options.page.orientation == 'portrait') {
            $('#orientationPortrait').prop('checked', true);
            $('#orientationLandscape').prop('checked', false);
        } else {
            $('#orientationPortrait').prop('checked', false);
            $('#orientationLandscape').prop('checked', true);
        }

        $('#paperSize').val(this.options.page.paperSize);

        $('#topMargin').val(this.options.page.margins.top);
        $('#bottomMargin').val(this.options.page.margins.bottom);
        $('#leftMargin').val(this.options.page.margins.left);
        $('#rightMargin').val(this.options.page.margins.right);

        this.optionsDialog.show();
    }

    /**
     * Apply report options selected by user
     */
    applyOptions() {

        this._bDisableApplyReportViewerOptions = true;
        this.options.page.margins.top = $('#topMargin').val();
        this.options.page.margins.bottom = $('#bottomMargin').val();
        this.options.page.margins.left = $('#leftMargin').val();
        this.options.page.margins.right = $('#rightMargin').val();

        this.options.page.paperSize = $('#paperSize').val();

        if ($('#orientationPortrait').prop('checked')) {
            this.options.page.orientation = 'portrait';
        } else {
            this.options.page.orientation = 'landscape';
        }

        this.optionsDialog.hide();

        this._bDisableApplyReportViewerOptions = false;
        this.applyReportViewerOptions();
        this.refreshReport();

    }


    /**
     * Refresh report view (reload the report)
     */
    refreshReport() {

        this.report.renderReportCriterias();
        this.report.renderReportSettings();
        $('#' + this.options.id + '_canvas').html((new ReportCanvas(this.app, this.report, this)).render());
        this.updateCSS();
        this.scaleReportSections();
        if (!this.report.isLoaded) {
            this.report.isLoaded = true;
            this.report.copyOriginalSettings();
            if (this.report.onReportLoaded) {
                this.report.onReportLoaded();
            }
        }

    }

    /**
     * Update reportPage style tag with print media css
     */
    updateCSS() {

        var paperSize = this.app.modules.Printing.getPaperSize(this.app.viewer.options.page.paperSize);
        var pageOrientation = this.app.viewer.options.page.orientation;

        var width = 0;
        var height = 0;

        if (pageOrientation == this.app.modules.Printing.PageOrientation.Landscape) {
            width = paperSize.height;
            height = paperSize.width;
        } else {
            width = paperSize.width;
            height = paperSize.height;
        }

        var s = `
               
        @media print {

            html, body {
                width: ${width}mm;
                margin: 0;
                padding: 0;
            }

            @page {
                size: ${width}mm ${height}mm;
                margin-top: ${this.options.page.margins.top}in !important;
                margin-bottom: ${this.options.page.margins.bottom}in !important;
                margin-left: ${this.options.page.margins.left}in !important;
                margin-right: ${this.options.page.margins.right}in !important;
                bleed: auto;
                @bottom-center {
                    content: counter(page) ' of ' counter(pages);
                }
            }

            .report-page {
                padding-top: 0px !important;
                padding-bottom: 0px !important;
                padding-left: 0px !important;
                padding-right: 0px !important; 
                box-shadow: none;
                border: none;
                margin-left: inherit;
                margin-right: inherit;    
                width : ${width}mm;
                height: ${height}mm;          
            }
 
            .no-print {
                display: none;
            }
          
            .report-viewer-canvas {
                overflow:visible;
                height: auto;
                padding:0px;
            }
                                            
            table { page-break-after:auto }
            tr    { page-break-inside:avoid; page-break-after:auto }
            td    { page-break-inside:avoid; page-break-after:auto }
            thead { display:table-header-group }
            tfoot { display:table-footer-group }
        }`;

        $('#' + this.options.id + '_style').text(s);
        this.app.modules.Printing.applyPageStyles();
    }

    /**
     * Scales report section to fit in page width
     */
    scaleReportSections() {

        $('.table-report-section').each(function () {

            if ($(this).width() > 0) {
                var ratio = $('#reportPage').width() / $(this).width();
                if (ratio != 1) {
                    $(this).css('transform', 'scaleX(' + parseFloat(ratio).toFixed(2) + ')');
                    $(this).css('transform-origin', 'top left')
                }
            }

        });

    }

    /**
     * Displays report settings right off canvas
     */
    showReportSettings() {

        if (this.settingsOffCanvas === null) {
            this.settingsOffCanvas = new bootstrap.Offcanvas($('#' + this.options.id + '_settingsOffCanvas')[0], {})
        }
        this.settingsOffCanvas.show();

    }

    refreshReportSettings() {

        for (var kSection in this.report.getReportDefinition().sections) {
            var oSection = this.report.getReportDefinition().sections[kSection];

            for (var y in oSection.model) {
                var field = oSection.model[y];
                var bIsVisible = true;
                if (field.visible != undefined) {
                    bIsVisible = this.app.modules.DataType.toBool(field.visible);
                }
                $('#' + oSection.id + '_field_' + oSection.model[y].name).prop('checked', bIsVisible);
                if (field.formula) {
                    $('#' + oSection.id + '_formula_' + oSection.model[y].name).val(field.formula);
                } else {
                    $('#' + oSection.id + '_formula_' + oSection.model[y].name).val('');
                }
                $('#' + oSection.id + '_label_' + oSection.model[y].name).html(field.label);

            }

        }

    }

    /**
     * Cancels report settings 
     */
    cancelSettings() {
        if (this.settingsOffCanvas !== null) {
            this.settingsOffCanvas.hide();
        }
    }

    /**
     * Apply report settings
     */
    applySettings() {
        if (this.settingsOffCanvas === null) {
            this.settingsOffCanvas = new bootstrap.Offcanvas($('#' + this.app.viewer.options.id + '_settingsOffCanvas')[0], {})
        }
        this.settingsOffCanvas.hide();

        // Update report properties name and description
        this.report.getReportDefinition().properties.name = $('#reportSettingsName').val();
        this.report.getReportDefinition().properties.description = $('#reportSettingsDescription').val();

        // Update report sections 
        for (var x in this.report.getReportDefinition().sections) {
            var oSection = this.report.getReportDefinition().sections[x];

            /**
             * Apply field settings
             */
            for (var f in oSection.model) {
                var oCol = oSection.model[f];
                oCol.visible = $('#' + oSection.id + '_field_' + oCol.name).prop('checked');
                oCol['formula'] = $('#' + oSection.id + '_formula_' + oCol.name).val();
            }

            /**
             * Reorder model columns
             */
            $('#' + oSection.id + '_fields tbody tr').each(function () {
                var columnName = $(this).attr('data-column');
                oSection.model.forEach(function (item, i) {
                    if (item.name == columnName) {
                        oSection.model.splice(i, 1);
                        oSection.model.unshift(item);
                    }
                });
            });

            oSection.model.reverse();

            /**
             * Apply order by settings
             */

            oSection.orderBy = [];
            $('#' + oSection.id + '_orderBy tbody tr').each(function () {
                var columnName = $(this).attr('data-column');

                if ($('#' + oSection.id + '_orderBy_' + columnName).prop('checked')) {
                    oSection.orderBy.push({
                        "name": columnName,
                        "order": $('#' + oSection.id + '_orderByOrder_' + columnName).val()
                    });
                }

            });

            oSection.groupBy = [];
            $('#' + oSection.id + '_groupBy tbody tr').each(function () {
                var columnName = $(this).attr('data-column');

                if ($('#' + oSection.id + '_groupBy_' + columnName).prop('checked')) {
                    oSection.groupBy.push({
                        "name": columnName,
                        "order": $('#' + oSection.id + '_groupByOrder_' + columnName).val()
                    });
                }

            });


        }

        /**
         * Apply settings changes
         */
        $('#' + this.options.id + '_headerName').html(this.report.getReportDefinition().properties.name);
        $('#' + this.options.id + '_headerDescription').html(this.report.getReportDefinition().properties.description);

        this.refreshReport();

    }

    /**
     * Hide main toolbar in report viewer
     */
    hideToolbar() {
        $('#' + this.report.id + '_toolbar').hide();
    }

    /**
     * Show main toolbar in report viewer
     */
    showToolbar() {
        $('#' + this.report.id + '_toolbar').show();
    }


    /**
     * Returns container element selector
     * @returns 
     */
    getContainerSelector() {
        return '#' + this.options.id;
    }

}
window.__Metadocx.ReportViewer = ReportViewer;
/** 
 * BooleanCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class BooleanCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {

    }

    render() {

        return `<div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${this.id}_yes">
                    <label class="form-check-label" for="${this.id}_yes">
                        Yes
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${this.id}_no">
                    <label class="form-check-label" for="${this.id}_no">
                        No
                    </label>
                </div>`;

    }

    getValue() {
        var bYes = $('#' + this.id + '_yes').prop('checked');
        var bNo = $('#' + this.id + '_no').prop('checked');

        if (bYes && bNo) {
            return 'ALL';
        } else {
            return bYes;
        }

    }

    setValue(v) {

        if (v === 'ALL') {
            $('#' + this.id + '_yes').prop('checked', true);
            $('#' + this.id + '_no').prop('checked', true);

        } else {
            $('#' + this.id + '_yes').prop('checked', v);
            $('#' + this.id + '_no').prop('checked', !v);
        }

    }



}
window.__Metadocx.BooleanCriteria = BooleanCriteria;
/** 
 * CheckboxCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class CheckboxCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    render() {



        return `<div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${this.id}">
                    <label class="form-check-label" for="${this.id}">
                        Form Checkbox
                    </label>
                </div>`;
    }

}
window.__Metadocx.CheckboxCriteria = CheckboxCriteria;
/** 
 * DatePeriodCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DatePeriodCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {

        this.reportCriteria.parameters.ranges = {
            "Today": [moment(), moment()],
            "Yesterday": [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            "Last 7 Days": [moment().subtract(6, 'days'), moment()],
            "Last 30 Days": [moment().subtract(29, 'days'), moment()],
            "This Month": [moment().startOf('month'), moment().endOf('month')],
            "Last Month": [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        };

        this._instance = $('#' + this.id).daterangepicker(this.reportCriteria.parameters);
    }

    render() {

        return `<div class="mb-3">
                    <label class="form-label" for="${this.id}">
                        ${this.reportCriteria.name}
                    </label>            
                    <input id="${this.id}" class="form-control"/>                        
                </div>`;

    }

    getValue() {
        return {
            startDate: this._instance.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            endDate: this._instance.data('daterangepicker').endDate.format('YYYY-MM-DD'),
        };
    }

    setValue(v) {
        this._instance.data('daterangepicker').setStartDate(v.startDate);
        this._instance.data('daterangepicker').setEndDate(v.endDate);
    }

    setStartDate(dt) {
        this._instance.data('daterangepicker').setStartDate(dt);
    }

    setEndDate(dt) {
        this._instance.data('daterangepicker').setEndDate(dt);
    }

}
window.__Metadocx.DatePeriodCriteria = DatePeriodCriteria;
/** 
 * NumericCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class NumericCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {
        this._instance = $('#' + this.id).daterangepicker(this.reportCriteria.parameters);
    }

    render() {

        return `<div class="mb-3">
                    <label class="form-label" for="${this.id}">
                        ${this.reportCriteria.name}
                    </label>            
                    <input id="${this.id}" class="form-control"/>                        
                </div>`;

    }

    getValue() {
        return {
            startDate: this._instance.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            endDate: this._instance.data('daterangepicker').endDate.format('YYYY-MM-DD'),
        };
    }

    setValue(v) {
        this._instance.data('daterangepicker').setStartDate(v.startDate);
        this._instance.data('daterangepicker').setEndDate(v.endDate);
    }



}
window.__Metadocx.NumericCriteria = NumericCriteria;
/** 
 * SelectCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class SelectCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = {};
    }

    initializeJS() {

        if (!Array.isArray(this.reportCriteria.options)) {
            if (this.reportCriteria.options.source = 'ajax' && this.reportCriteria.options.url) {
                this.reportCriteria.parameters.ajax = {
                    url: this.reportCriteria.options.url,
                    dataType: 'json'
                };
            }
        }

        this._instance = $('#' + this.id).select2(this.reportCriteria.parameters);
        $('#' + this.id).val(null).trigger("change");
    }

    render() {

        var sOptionTags = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (var x in this.reportCriteria.options) {
                sOptionTags += `<option value="${this.reportCriteria.options[x].id}">${this.reportCriteria.options[x].text}</option>`;
            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sOptionTags = this.buildOptionTagsFromReportData(this.reportCriteria.options.field);
            } else if (this.reportCriteria.options.source == 'ajax') {

            }

        }



        return `<div class="mb-3">
                    <label class="form-label" for="${this.id}">
                        ${this.reportCriteria.name}
                    </label>            
                    <select id="${this.id}" class="form-control">
                        ${sOptionTags}
                    </select>                    
                </div>`;
    }

    getValue() {
        return this._instance.select2('data');
    }

    buildOptionTagsFromReportData(field) {
        var sOptionTags = '';
        var aOptions = [];
        var aReportSections = this.app.viewer.report.getReportSections();
        for (var s in aReportSections) {
            for (var x in aReportSections[s].data) {
                var row = aReportSections[s].data[x];
                if (aOptions.indexOf(row[field]) === -1) {
                    aOptions.push(row[field]);
                }
            }
        }

        aOptions.sort();

        for (var x in aOptions) {
            sOptionTags += `<option value="${aOptions[x]}">${aOptions[x]}</option>`;
        }

        return sOptionTags;

    }



}
window.__Metadocx.SelectCriteria = SelectCriteria;
/**
 * Browser module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class BrowserModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
    }

    initialize() {
        super.initialize();
    }

    /**
     * Returns browser type
     * @returns 
     */
    getBrowser() {
        if (this.isChrome()) {
            return 'chrome';
        } else if (this.isIE()) {
            return 'ie';
        } else if (this.isEdge()) {
            return 'edge';
        } else if (this.isFirefox()) {
            return 'firefox';
        } else if (this.isSafari()) {
            return 'safari';
        } else if (this.isIOSChrome()) {
            return 'chrome';
        }
    }

    /**
     * Check if browser is chrome
     * @returns 
     */
    isChrome() {
        return !!window.chrome;
    }

    /**
     * Check if browser is internet explorer
     * @returns 
     */
    isIE() {
        return navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode
    }

    /**
     * Check if browser is Edge
     * @returns 
     */
    isEdge() {
        return !this.isIE() && !!window.StyleMedia
    }

    /**
     * Check if browser is firefox
     * @returns 
     */
    isFirefox() {
        return typeof InstallTrigger !== 'undefined'
    }

    /**
     * Check if browser is safari
     * @returns 
     */
    isSafari() {
        return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
            navigator.userAgent.toLowerCase().indexOf('safari') !== -1
    }

    /**
     * Check if browser is chrome on iOs
     * @returns 
     */
    isIOSChrome() {
        return navigator.userAgent.toLowerCase().indexOf('crios') !== -1
    }



}
window.__Metadocx.BrowserModule = BrowserModule;
/**
 * Console module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ConsoleModule extends Module {

    constructor(app) {
        super(app);
        this.app = app;
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
        this.tag = null;
        this.color = '#fff';
        this.backColor = 'blue';
    }

    initialize() {
        super.initialize();
    }

    /**
     * Sets tag (text) to prepend to message
     */
    setTag(sTag) {
        this.tag = sTag;
        return this;
    }

    /**
     * Sets tag color
     * @param {*} sColor 
     * @param {*} sBackColor 
     * @returns object
     */
    setColor(sColor, sBackColor) {
        this.color = sColor;
        this.backColor = sBackColor;
        return this;
    }

    /**
    * The console.assert() method writes an error message to the console if the assertion is false. 
    * If the assertion is true, nothing happens.
    */
    assert() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.assert.apply(null, arguments);
    }

    /**
     * The console.clear() method clears the console if the environment allows it.
     */
    clear() {
        console.clear();
    }

    /**
     * The console.count() method logs the number of times that this particular call to count() has been called.
     */
    count() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.count.apply(null, arguments);
    }

    /**
     * The console.countReset() method resets counter used with console.count().
     */
    countReset() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.countReset.apply(null, arguments);
    }

    /**
     * The console.debug() method outputs a message to the web console at the "debug" log level. 
     * The message is only displayed to the user if the console is configured to display debug output. 
     * In most cases, the log level is configured within the console UI. 
     * This log level might correspond to the `Debug` or `Verbose` log level.
     * @param {*} sMessage      
     */
    debug(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.debug.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The method console.dir() displays an interactive list of the properties of the specified JavaScript object. 
     * The output is presented as a hierarchical listing with disclosure triangles that let you see the contents of child objects.
     * In other words, console.dir() is the way to see all the properties of a specified JavaScript object 
     * in console by which the developer can easily get the properties of the object.
     * @param {*}      
     */
    dir() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.dir.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');

    }

    /**
     * The console.error() method outputs an error message to the Web console.
     * @param {*} sMessage      
     */
    error(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.error.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.group() method creates a new inline group in the Web console log,
     * causing any subsequent console messages to be indented by an additional level, 
     * until console.groupEnd() is called.     
     */
    group() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.group.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.groupCollapsed() method creates a new inline group in the Web Console. 
     * Unlike console.group(), however, the new group is created collapsed. 
     * The user will need to use the disclosure button next to it to expand it, revealing the entries created in the group.
     * Call console.groupEnd() to back out to the parent group.     
     */
    groupCollapsed() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.groupCollapsed.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.groupEnd() method exits the current inline group in the Web console. 
     * See Using groups in the console in the console documentation for details and examples.     
     */
    groupEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.groupEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.info() method outputs an informational message to the Web console. 
     * In Firefox, a small "i" icon is displayed next to these items in the Web console's log.
     * @param {*} sMessage      
     */
    info() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.info.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.log() method outputs a message to the web console. 
     * The message may be a single string (with optional substitution values), or it may be any one or more JavaScript objects.     
     */
    log() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.log.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.profile() starts recording a performance profile (for example, the Firefox performance tool).
     * You can optionally supply an argument to name the profile and this then enables you to stop only that profile
     *  if multiple profiles being recorded. See console.profileEnd() to see how this argument is interpreted.
     * @param {*} sName      
     */
    profile() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.profile.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.profileEnd() method stops recording a profile previously started with console.profile().
     * @param {*} sName      
     */
    profileEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.profileEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * This function takes one mandatory argument data, which must be an array or an object, 
     * and one additional optional parameter columns.
     * 
     * It logs data as a table. Each element in the array (or enumerable property if data is an object) 
     * will be a row in the table.
     * 
     * The first column in the table will be labeled (index). If data is an array, 
     * then its values will be the array indices. If data is an object, then its values will be the property names. 
     * 
     * Note that (in Firefox) console.table is limited to displaying 1000 rows (first row is the labeled index).
     * 
     * @param {*} e 
     */
    table() {
        if (this.isConsoleDisabled) {
            return false;
        }
        console.table.apply(console, arguments);
    }

    /**
     * The console.time() method starts a timer you can use to track how long an operation takes. 
     * You give each timer a unique name, and may have up to 10,000 timers running on a given page. 
     * When you call console.timeEnd() with the same name, the browser will output the time, in milliseconds, 
     * that elapsed since the timer was started.     
     */
    time() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.time.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.timeEnd() stops a timer that was previously started by calling console.time().     
     */
    timeEnd() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.timeEnd.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.timeLog() method logs the current value of a timer that was previously started 
     * by calling console.time() to the console.     
     */
    timeLog() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.timeLog.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.trace() method outputs a stack trace to the Web console.     
     */
    trace() {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.trace.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * The console.warn() method outputs a warning message to the Web console.
     * @param {*} sMessage      
     */
    warn(sMessage) {
        if (this.isConsoleDisabled) {
            return false;
        }

        console.warn.apply(console, this.buildArguments(arguments));

        /**
         * Reset color and module
         */
        this.setTag(null);
        this.setColor('#fff', 'blue');
    }

    /**
     * Build arguments for log methods with format options
     * @param {*} args 
     * @returns array
     */
    buildArguments(args) {
        var aArguments = [];
        var sMessage = null;
        var nFirstArg = 0;
        if (args.length > 0) {
            if (typeof args[0] == 'string') {
                sMessage = args[0];
                nFirstArg = 1;
            }
        }

        if (this.tag && sMessage) {
            sMessage = '%c' + this.tag.padEnd(10, ' ') + '%c ' + sMessage;
            aArguments.push(sMessage);
            aArguments.push('color:' + this.color + ';background-color:' + this.backColor + ';border-radius:3px;padding:2px;font-size:8pt;');
            aArguments.push('color:#000;background-color:#fff');
        } else if (sMessage) {
            aArguments.push(sMessage);
        }

        for (var i = nFirstArg; i < args.length; i++) {
            aArguments.push(args[i]);
        }

        return aArguments;
    }

    /**
     * Disable console output
     */
    disable() {
        this.isConsoleDisabled = true;
        return this;
    }

    /**
     * Enable console output
     */
    enable() {
        this.isConsoleDisabled = false;
        return this;
    }

    /**
     * Display help for module
     */
    help() {
        window.open('https://developer.mozilla.org/en-US/docs/Web/API/console');
    }

}
window.__Metadocx.ConsoleModule = ConsoleModule;
/**
 * DataType module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DataTypeModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
    }

    initialize() {
        super.initialize();
    }

    /**
     * Convert value to boolean value
     * @param {*} v 
     * @returns 
     */
    toBool(v) {
        if (typeof v === 'string' || v instanceof String) {
            v = v.toLowerCase();
        }

        switch (v) {
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
            case "oui":
            case "vrai":
                return true;
            default:
                return false;
        }

    }

    /**
     * Parses float value
     * @param {*} v 
     * @returns 
     */
    parseFloat(v) {
        return Number(v.toPrecision(15));
    }

    /**
     * Deep copy of object 
     * @param {*} from 
     * @param {*} to 
     */
    copyObjectProperties(from, to) {

        for (var x in from) {
            if (typeof from[x] === 'object') {
                this.copyObjectProperties(from[x], to[x]);
            } else {
                to[x] = from[x];
            }
        }

    }

}
window.__Metadocx.DataTypeModule = DataTypeModule;
/**
 * Excel module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ExcelModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 500;
        this.isConsoleDisabled = false;
        this.exportDialog = null;
    }

    initialize() {
        super.initialize();
    }

    showExportDialog() {

        if (this.exportDialog === null) {
            $(this.app.viewer.getContainerSelector()).append(this.renderExportDialog());
            this.hookExportDialogComponents();
            this.exportDialog = new bootstrap.Modal('#' + this.app.viewer.options.id + '_excelExportDialog', {})
        }

        $('#excelPaperSize').val(this.app.viewer.options.page.paperSize);

        var paperSize = this.app.modules.Printing.getPaperSize($('#excelPaperSize').val());
        $('#excelPaperSizeWidth').val(paperSize.width);
        $('#excelPaperSizeHeight').val(paperSize.height);

        if (this.app.viewer.options.page.orientation == Metadocx.modules.Printing.PageOrientation.Portrait) {
            $('#excelOrientationPortrait').prop('checked', true);
            $('#excelOrientationLandscape').prop('checked', false);
        } else {
            $('#excelOrientationPortrait').prop('checked', false);
            $('#excelOrientationLandscape').prop('checked', true);
        }

        $('#excelTopMargin').val(this.app.viewer.options.page.margins.top);
        $('#excelBottomMargin').val(this.app.viewer.options.page.margins.bottom);
        $('#excelLeftMargin').val(this.app.viewer.options.page.margins.left);
        $('#excelRightMargin').val(this.app.viewer.options.page.margins.right);

        this.exportDialog.show();

    }


    renderExportDialog() {

        return `<div id="${this.app.viewer.options.id}_excelExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Excel Export</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between">
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label for="excelPaperSize" class="form-label font-weight-bold">Orientation</label>
                    
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="excelOrientation" id="excelOrientationPortrait">
                            <label class="form-check-label" for="excelOrientationPortrait">
                                Portrait
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="excelOrientation" id="excelOrientationLandscape">
                            <label class="form-check-label" for="excelOrientationLandscape">
                                Landscape
                            </label>
                        </div>
                    </div>
                    <div class="mb-3">                                
                        <label for="excelPaperSize" class="form-label font-weight-bold">Paper size</label>
                        <select id="excelPaperSize" class="form-select">
                        ${this.app.modules.Printing.getPaperSizeOptions()}
                        </select>
                    </div>
                    <div class="mb-3 excelPaperSizeWidths" style="display:none;">                                
                        <label for="excelPaperSizeWidth" class="form-label font-weight-bold">Paper width (mm)</label>
                        <input id="excelPaperSizeWidth" class="form-control" type="number" />
                    </div>
                    <div class="mb-3 excelPaperSizeWidths" style="display:none;">                                
                        <label for="excelPaperSizeHeight" class="form-label font-weight-bold">Paper height (mm)</label>
                        <input id="excelPaperSizeHeight" class="form-control" type="number" />
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="excelGrayscale">
                        <label class="form-check-label" for="excelGrayscale">
                            Grayscale
                        </label>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="excelUseCompression" checked>
                        <label class="form-check-label" for="excelUseCompression">
                            excel Compression
                        </label>
                    </div>  
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="excelIncludeOutline" checked>
                        <label class="form-check-label" for="excelIncludeOutline">
                            Include document outline
                        </label>
                    </div> 
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="excelPrintBackgrounds" checked>
                        <label class="form-check-label" for="excelPrintBackgrounds">
                            Background graphics
                        </label>
                    </div>      
                </div>
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label class="form-label font-weight-bold">Margins</label>
              
                        <div class="mb-3 row">
                            <label for="excelTopMargin" class="col-sm-4 col-form-label">Top</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="excelTopMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="excelBottomMargin" class="col-sm-4 col-form-label">Bottom</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="excelBottomMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="excelLeftMargin" class="col-sm-4 col-form-label">Left</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="excelLeftMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="excelRightMargin" class="col-sm-4 col-form-label">Right</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="excelRightMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>                                                    
                    </div>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="excelDisplayHeader">
                        <label class="form-check-label" for="excelDisplayHeader">
                            Display header
                        </label>
                    </div>    
                </div>                
            </div>
            <div class="row excel-header-row p-2" style="display:none;">
                <div class="col-4"><input id="excelHeaderLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="excelHeaderCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="excelHeaderRight" type="text" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 excel-header-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="excelHeaderLine">
                        <label class="form-check-label" for="excelHeaderLine">
                            Display header line
                        </label>
                    </div>                    
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="excelDisplayFooter">
                        <label class="form-check-label" for="excelDisplayFooter">
                            Display footer
                        </label>
                    </div> 
                </div>                
            </div>
            <div class="row excel-footer-row p-2" style="display:none;">
                <div class="col-4"><input id="excelFooterLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="excelFooterCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="excelFooterRight" type="text" class="form-control" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 excel-footer-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="excelFooterLine">
                        <label class="form-check-label" for="excelFooterLine">
                            Display footer line
                        </label>
                    </div>                    
                </div>
            </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onClick="Metadocx.modules.excel.exportexcel();"><i class="fa-solid fa-check"></i>&nbsp;Export excel</button>
          </div>
          </div>
      </div>
      </div>`;

    }

    hookExportDialogComponents() {

        $('#excelDisplayHeader').off('click').on('click', () => {
            if ($('#excelDisplayHeader').prop('checked')) {
                $('.excel-header-row').show();
            } else {
                $('.excel-header-row').hide();
            }
        });

        $('#excelDisplayFooter').off('click').on('click', () => {
            if ($('#excelDisplayFooter').prop('checked')) {
                $('.excel-footer-row').show();
            } else {
                $('.excel-footer-row').hide();
            }
        });

        $('#excelPaperSize').off('change').on('change', () => {
            if ($('#excelPaperSize').val() == 'Custom') {
                $('.excelPaperSizeWidths').css('display', '');
                $('.excelPaperSizeWidths').show();
            } else {
                $('.excelPaperSizeWidths').hide();
            }

            var paperSize = this.app.modules.Printing.getPaperSize($('#excelPaperSize').val());
            $('#excelPaperSizeWidth').val(paperSize.width);
            $('#excelPaperSizeHeight').val(paperSize.height);
        });

    }


    getExcelExportOptions() {

        var orientation = Metadocx.modules.Printing.PageOrientation.Portrait;
        if ($('#excelOrientationLandscape').prop('checked')) {
            orientation = Metadocx.modules.Printing.PageOrientation.Landscape;
        }

        return {
            "page": {
                "orientation": orientation,
                "paperSize": $('#excelPaperSize').val(),
                "width": $('#excelPaperSizeWidth').val(),
                "height": $('#excelPaperSizeHeight').val(),
                "margins": {
                    "top": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#excelTopMargin').val())),
                    "bottom": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#excelBottomMargin').val())),
                    "left": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#excelLeftMargin').val())),
                    "right": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#excelRightMargin').val()))
                }
            },
            "grayscale": $('#excelGrayscale').prop('checked'),
            "excelCompression": $('#excelUseCompression').prop('checked'),
            "outline": $('#excelIncludeOutline').prop('checked'),
            "backgroundGraphics": $('#excelPrintBackgrounds').prop('checked'),
            "header": {
                "left": $('#excelHeaderLeft').val(),
                "center": $('#excelHeaderCenter').val(),
                "right": $('#excelHeaderRight').val(),
                "displayHeaderLine": $('#excelHeaderLine').prop('checked')
            },
            "footer": {
                "left": $('#excelFooterLeft').val(),
                "center": $('#excelFooterCenter').val(),
                "right": $('#excelFooterRight').val(),
                "displayFooterLine": $('#excelFooterLine').prop('checked')
            }
        };

    }

    exportexcel() {
        $.ajax({
            type: 'post',
            url: '/Convert/excel',
            data: {
                ExportOptions: this.getExcelExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#reportPage').html()))),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //console.log(data);
                //console.log(status);

                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "Report.xls";
                link.click();

            }
        });
    }


}
window.__Metadocx.ExcelModule = ExcelModule;
/**
 * Format module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class FormatModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
    }

    initialize() {
        super.initialize();
    }

    format(value, dataType, format) {

        var displayValue = '';

        switch (dataType) {
            case 'number':
                if (format === undefined) {
                    format = this.app.viewer.options.formats.number.format;
                }
                displayValue = numeral(value).format(format);
                break;
            case 'boolean':
                if (value === 'ALL') {
                    if (this.app.viewer.options.formats.boolean.format.ALL !== undefined) {
                        displayValue = this.app.viewer.options.formats.boolean.format.ALL;
                    } else {
                        // default value if not options is available
                        displayValue = 'All';
                    }

                } else if (value) {

                    if (this.app.viewer.options.formats.boolean.format.trueValue !== undefined) {
                        displayValue = this.app.viewer.options.formats.boolean.format.trueValue;
                    } else {
                        // default value if not options is available
                        displayValue = 'Yes';
                    }


                } else {

                    if (this.app.viewer.options.formats.boolean.format.falseValue !== undefined) {
                        displayValue = this.app.viewer.options.formats.boolean.format.falseValue;
                    } else {
                        // default value if not options is available
                        displayValue = 'No';
                    }

                }
                break;
            case 'date':
                if (format === undefined) {
                    format = this.app.viewer.options.formats.date.format;
                }
                displayValue = moment(value).format(format);
                break;
            default:
                displayValue = value;
                break;
        }

        return displayValue;

    }



}
window.__Metadocx.FormatModule = FormatModule;
/**
 * Import module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ImportModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 200;
        this.isConsoleDisabled = false;
        this.loaded = false;
        this.onLibrairiesLoaded = null;
        this._bInjectionWasMade = false;

        this.loadStatus = {};

        this.stacks = {
            default: {
                requires: [
                    'Metadocx', 'jQuery', 'IconScout', 'Numeral', 'Bootstrap', 'Select2', 'Moment', 'DateRangePicker'
                ],
            },
        };

        this.libraries = {
            Metadocx: {
                head: {
                    links: [
                        {
                            id: 'metadocxcss',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: '/css/metadocx.css',
                            crossorigin: 'anonymous',
                            code: '<link id="metadocxcss" rel="stylesheet" href="/css/metadocx.css" />',
                        }
                    ],
                }
            },
            jQuery: {
                bottom: {
                    scripts: [
                        {
                            id: 'jquery',
                            type: 'script',
                            priority: 100,
                            src: 'https://code.jquery.com/jquery-3.6.1.min.js',
                            crossorigin: 'anonymous',
                            integrity: 'sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=',
                            code: '<script id="jquery" src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>',
                        }
                    ],
                }
            },
            FontAwesome: {
                head: {
                    links: [
                        {
                            id: 'fontawesome',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css',
                            integrity: 'sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link id="fontawesome" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        },
                    ],
                }
            },
            IconScout: {
                head: {
                    links: [
                        {
                            id: 'iconscoutcss',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://unicons.iconscout.com/release/v4.0.0/css/line.css',
                            crossorigin: 'anonymous',
                            code: '<link id="iconscoutcss" rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">        ',
                        },
                    ],
                }
            },
            Moment: {
                bottom: {
                    scripts: [
                        {
                            id: 'momentjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/momentjs/latest/moment.min.js',
                            code: '<script id="momentjs" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>',
                        },
                    ],
                },
            },
            DateRangePicker: {
                head: {
                    links: [
                        {
                            id: 'daterangepickercss',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css',
                            rel: 'stylesheet',
                            crossorigin: 'anonymous',
                            code: '<link id="daterangepickercss" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" crossorigin="anonymous">',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'daterangepickerjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js',
                            code: '<script id="daterangepickerjs" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>',
                        },
                    ],
                },
            },
            Numeral: {
                bottom: {
                    scripts: [
                        {
                            id: 'numeral',
                            type: 'script',
                            priority: 100,
                            src: '//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js',
                            code: '<script id="numeral" src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>',
                        },
                    ],
                },
            },
            Bootstrap: {
                head: {
                    links: [
                        {
                            id: 'bootstrapcss',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
                            rel: 'stylesheet',
                            integrity: 'sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65',
                            crossorigin: 'anonymous',
                            code: '<link id="bootstrapcss" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'popperjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js',
                            integrity: 'sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3',
                            crossorigin: 'anonymous',
                            code: '<script id="popperjs" src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>',
                        },
                        {
                            id: 'bootstrapjs',
                            type: 'script',
                            priority: 110,
                            src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
                            integrity: 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4',
                            crossorigin: 'anonymous',
                            code: '<script id="bootstrapjs" src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
                        },
                    ],
                }
            },
            Select2: {
                head: {
                    links: [
                        {
                            id: 'select2css',
                            type: 'link',
                            priority: 100,
                            href: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css',
                            rel: 'stylesheet',
                            crossorigin: 'anonymous',
                            code: '<link id="select2css" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />',
                        }
                    ],
                },
                bottom: {
                    scripts: [
                        {
                            id: 'select2js',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js',
                            crossorigin: 'anonymous',
                            code: '<script id="select2js" src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>',
                        },
                    ],
                }
            },
        };
    }

    initialize() {
        super.initialize();
    }

    isLoaded() {

        for (var x in this.loadStatus) {
            if (!this.loadStatus[x].loaded) {
                return false;
            }
        }

        return true;

    }



    injectLibrary(libName) {
        var sections = this.libraries[libName];
        if (sections.head && sections.head.links) {
            for (var x in sections.head.links) {
                if ($('#' + sections.head.links[x].id).length == 0) {
                    this.log('   Injecting head link ' + sections.head.links[x].id);
                    this.createElement(sections.head.links[x]);
                } else {
                    this.log('   Script ' + sections.head.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.head && sections.head.scripts) {
            for (var x in sections.head.scripts) {
                if ($('#' + sections.head.scripts[x].id).length == 0) {
                    this.log('   Injecting head script ' + sections.head.scripts[x].id);
                    this.createElement(sections.head.scripts[x]);
                } else {
                    this.log('   Script ' + sections.head.scripts[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.links) {
            for (var x in sections.bottom.links) {
                if ($('#' + sections.bottom.links[x].id).length == 0) {
                    this.log('   Injecting bootom link ' + sections.bottom.links[x].id);
                    this.createElement(sections.bottom.links[x]);
                } else {
                    this.log('   Script ' + sections.bottom.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.scripts) {
            for (var x in sections.bottom.scripts) {
                if ($('#' + sections.bottom.scripts[x].id).length == 0) {
                    this.log('   Injecting bottom script ' + sections.bottom.scripts[x].id);
                    this.createElement(sections.bottom.scripts[x]);
                } else {
                    this.log('   Script ' + sections.bottom.scripts[x].id + ' already loaded');
                }
            }
        }
    }

    triggerLibrariesLoaded(libName) {

        if (this.loadStatus[libName]) {
            this.loadStatus[libName].loaded = true;
        }

        if (this.isLoaded()) {
            if (this.onLibrairiesLoaded) {
                this.onLibrairiesLoaded();
            }
        }
    }

    createElement(options) {

        var module = this;

        if (document.getElementById(id)) {
            console.log('Package is already loaded, skipping');
            return;
        }

        this._bInjectionWasMade = true;

        this.loadStatus[options.id] = {
            loaded: false,
        };

        (function (d, s, id) {
            var js, lsjs = d.getElementsByTagName(s)[0];

            if (d.getElementById(id)) {
                console.log('Package is already loaded, skipping');
                return;
            }
            js = d.createElement(s); js.id = id;
            if (options.onload) {
                js.onload = options.onload;
            } else {
                js.onload = () => {
                    module.triggerLibrariesLoaded(id);
                };
            }
            if (options.src) {
                js.src = options.src;
            }
            if (options.crossorigin) {
                js.crossOrigin = options.crossorigin;
            }
            if (options.integrity) {
                js.integrity = options.integrity;
            }
            if (options.href) {
                js.href = options.href;
            }
            if (options.rel) {
                js.rel = options.rel;
            }
            if (!lsjs) {
                // Inject in head
                lsjs = document.getElementsByTagName('head')[0];
                lsjs.appendChild(js);
            } else {
                lsjs.parentNode.insertBefore(js, lsjs);
            }

        }(document, options.type, options.id));
    }

    injectRequiredLibraries() {
        console.groupCollapsed('[Metadocx] Import injectRequiredLibraries');

        if (this.app.viewer.options.ui == undefined) {
            this.app.viewer.options.ui = 'default';
        }

        this.log('Injecting required librairies for stack ' + this.app.viewer.options.ui);
        for (var x in this.stacks[this.app.viewer.options.ui].requires) {
            var libName = this.stacks[this.app.viewer.options.ui].requires[x];
            this.injectLibrary(libName);
        }

        if (!this._bInjectionWasMade) {
            // No injection made call 
            if (this.onLibrairiesLoaded) {
                this.onLibrairiesLoaded();
            }
        }

    }


}
window.__Metadocx.ImportModule = ImportModule;
/**
 * PDF module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class PDFModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 500;
        this.isConsoleDisabled = false;
        this.color = '#fff';
        this.backColor = 'red';

        this.exportDialog = null;
    }

    initialize() {
        super.initialize();
    }

    showExportDialog() {

        if (this.exportDialog === null) {

            $('#' + this.app.viewer.options.container).append(this.renderExportDialog());
            this.hookExportDialogComponents();
            this.exportDialog = new bootstrap.Modal('#' + this.app.viewer.options.id + '_pdfExportDialog', {})
        }

        $('#pdfPaperSize').val(this.app.viewer.options.page.paperSize);

        var paperSize = this.app.modules.Printing.getPaperSize($('#pdfPaperSize').val());
        $('#pdfPaperSizeWidth').val(paperSize.width);
        $('#pdfPaperSizeHeight').val(paperSize.height);

        if (this.app.viewer.options.page.orientation == Metadocx.modules.Printing.PageOrientation.Portrait) {
            $('#pdfOrientationPortrait').prop('checked', true);
            $('#pdfOrientationLandscape').prop('checked', false);
        } else {
            $('#pdfOrientationPortrait').prop('checked', false);
            $('#pdfOrientationLandscape').prop('checked', true);
        }

        $('#pdfTopMargin').val(this.app.viewer.options.page.margins.top);
        $('#pdfBottomMargin').val(this.app.viewer.options.page.margins.bottom);
        $('#pdfLeftMargin').val(this.app.viewer.options.page.margins.left);
        $('#pdfRightMargin').val(this.app.viewer.options.page.margins.right);

        this.exportDialog.show();

    }

    hideExportDialog() {
        if (this.exportDialog !== null) {
            this.exportDialog.hide();
        }
    }


    renderExportDialog() {

        return `<div id="${this.app.viewer.options.id}_pdfExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">PDF Export</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between">
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label for="pdfPaperSize" class="form-label font-weight-bold">Orientation</label>
                    
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="pdfOrientation" id="pdfOrientationPortrait">
                            <label class="form-check-label" for="pdfOrientationPortrait">
                                Portrait
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="pdfOrientation" id="pdfOrientationLandscape">
                            <label class="form-check-label" for="pdfOrientationLandscape">
                                Landscape
                            </label>
                        </div>
                    </div>
                    <div class="mb-3">                                
                        <label for="pdfPaperSize" class="form-label font-weight-bold">Paper size</label>
                        <select id="pdfPaperSize" class="form-select">
                        ${this.app.modules.Printing.getPaperSizeOptions()}
                        </select>
                    </div>
                    <div class="mb-3 pdfPaperSizeWidths" style="display:none;">                                
                        <label for="pdfPaperSizeWidth" class="form-label font-weight-bold">Paper width (mm)</label>
                        <input id="pdfPaperSizeWidth" class="form-control" type="number" />
                    </div>
                    <div class="mb-3 pdfPaperSizeWidths" style="display:none;">                                
                        <label for="pdfPaperSizeHeight" class="form-label font-weight-bold">Paper height (mm)</label>
                        <input id="pdfPaperSizeHeight" class="form-control" type="number" />
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="pdfGrayscale">
                        <label class="form-check-label" for="pdfGrayscale">
                            Grayscale
                        </label>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="pdfUseCompression" checked>
                        <label class="form-check-label" for="pdfUseCompression">
                            PDF Compression
                        </label>
                    </div>  
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="pdfIncludeOutline" checked>
                        <label class="form-check-label" for="pdfIncludeOutline">
                            Include document outline
                        </label>
                    </div> 
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="pdfPrintBackgrounds" checked>
                        <label class="form-check-label" for="pdfPrintBackgrounds">
                            Background graphics
                        </label>
                    </div>      
                </div>
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label class="form-label font-weight-bold">Margins</label>
              
                        <div class="mb-3 row">
                            <label for="pdfTopMargin" class="col-sm-4 col-form-label">Top</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="pdfTopMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="pdfBottomMargin" class="col-sm-4 col-form-label">Bottom</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="pdfBottomMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="pdfLeftMargin" class="col-sm-4 col-form-label">Left</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="pdfLeftMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="pdfRightMargin" class="col-sm-4 col-form-label">Right</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="pdfRightMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>                                                    
                    </div>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="pdfDisplayHeader">
                        <label class="form-check-label" for="pdfDisplayHeader">
                            Display header
                        </label>
                    </div>    
                </div>                
            </div>
            <div class="row pdf-header-row p-2" style="display:none;">
                <div class="col-4"><input id="pdfHeaderLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="pdfHeaderCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="pdfHeaderRight" type="text" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 pdf-header-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="pdfHeaderLine">
                        <label class="form-check-label" for="pdfHeaderLine">
                            Display header line
                        </label>
                    </div>                    
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="pdfDisplayFooter">
                        <label class="form-check-label" for="pdfDisplayFooter">
                            Display footer
                        </label>
                    </div> 
                </div>                
            </div>
            <div class="row pdf-footer-row p-2" style="display:none;">
                <div class="col-4"><input id="pdfFooterLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="pdfFooterCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="pdfFooterRight" type="text" class="form-control" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 pdf-footer-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="pdfFooterLine">
                        <label class="form-check-label" for="pdfFooterLine">
                            Display footer line
                        </label>
                    </div>                    
                </div>
            </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onClick="Metadocx.modules.PDF.exportPDF();"><i class="fa-solid fa-check"></i>&nbsp;Export PDF</button>
          </div>
          </div>
      </div>
      </div>`;

    }

    hookExportDialogComponents() {

        $('#pdfDisplayHeader').off('click').on('click', () => {
            if ($('#pdfDisplayHeader').prop('checked')) {
                $('.pdf-header-row').show();
            } else {
                $('.pdf-header-row').hide();
            }
        });

        $('#pdfDisplayFooter').off('click').on('click', () => {
            if ($('#pdfDisplayFooter').prop('checked')) {
                $('.pdf-footer-row').show();
            } else {
                $('.pdf-footer-row').hide();
            }
        });

        $('#pdfPaperSize').off('change').on('change', () => {
            if ($('#pdfPaperSize').val() == 'Custom') {
                $('.pdfPaperSizeWidths').css('display', '');
                $('.pdfPaperSizeWidths').show();
            } else {
                $('.pdfPaperSizeWidths').hide();
            }

            var paperSize = this.app.modules.Printing.getPaperSize($('#pdfPaperSize').val());
            $('#pdfPaperSizeWidth').val(paperSize.width);
            $('#pdfPaperSizeHeight').val(paperSize.height);
        });

    }


    getPDFExportOptions() {

        var orientation = Metadocx.modules.Printing.PageOrientation.Portrait;
        if ($('#pdfOrientationLandscape').prop('checked')) {
            orientation = Metadocx.modules.Printing.PageOrientation.Landscape;
        }

        var paperSize = this.app.viewer.options.page.paperSize;
        if ($('#pdfPaperSize').length > 0) {
            paperSize = $('#pdfPaperSize').val();
        }

        var paperSizeInfo = this.app.modules.Printing.getPaperSize(paperSize);
        var width = paperSizeInfo.width;
        var height = paperSizeInfo.height;
        if ($('#pdfPaperSizeWidth').length > 0) {
            width = $('#pdfPaperSizeWidth').val();
        }
        if ($('#pdfPaperSizeHeight').length > 0) {
            height = $('#pdfPaperSizeHeight').val();
        }
        var grayscale = true;
        if ($('#pdfGrayscale').length > 0) {
            grayscale = $('#pdfGrayscale').prop('checked');
        }
        var marginTop = $('#pdfTopMargin').val();
        if (marginTop == undefined) {
            marginTop = this.app.viewer.options.page.margins.top;
        }
        var marginBottom = $('#pdfBottomMargin').val();
        if (marginBottom == undefined) {
            marginBottom = this.app.viewer.options.page.margins.bottom;
        }
        var marginLeft = $('#pdfLeftMargin').val();
        if (marginLeft == undefined) {
            marginLeft = this.app.viewer.options.page.margins.left;
        }
        var marginRight = $('#pdfRightMargin').val();
        if (marginRight == undefined) {
            marginRight = this.app.viewer.options.page.margins.right;
        }
        var pdfCompression = $('#pdfUseCompression').prop('checked');
        if (pdfCompression == undefined) {
            pdfCompression = true;
        }
        var outline = $('#pdfIncludeOutline').prop('checked');
        if (outline == undefined) {
            outline = true;
        }
        var backgroundGraphics = $('#pdfPrintBackgrounds').prop('checked');
        if (backgroundGraphics == undefined) {
            backgroundGraphics = true;
        }

        var headerLeft = $('#pdfHeaderLeft').val();
        if (headerLeft == undefined) {
            headerLeft = '';
        }
        var headerCenter = $('#pdfHeaderCenter').val();
        if (headerCenter == undefined) {
            headerCenter = '';
        }
        var headerRight = $('#pdfHeaderRight').val();
        if (headerRight == undefined) {
            headerRight = '';
        }

        var footerLeft = $('#pdfFooterLeft').val();
        if (footerLeft == undefined) {
            footerLeft = '';
        }
        var footerCenter = $('#pdfFooterCenter').val();
        if (footerCenter == undefined) {
            footerCenter = '';
        }
        var footerRight = $('#pdfFooterRight').val();
        if (footerRight == undefined) {
            footerRight = '';
        }


        return {
            "page": {
                "orientation": orientation,
                "paperSize": paperSize,
                "width": width,
                "height": height,
                "margins": {
                    "top": Metadocx.modules.UI.convertInchesToMM(parseFloat(marginTop)),
                    "bottom": Metadocx.modules.UI.convertInchesToMM(parseFloat(marginBottom)),
                    "left": Metadocx.modules.UI.convertInchesToMM(parseFloat(marginLeft)),
                    "right": Metadocx.modules.UI.convertInchesToMM(parseFloat(marginRight))
                }
            },
            "grayscale": grayscale,
            "pdfCompression": pdfCompression,
            "outline": outline,
            "backgroundGraphics": backgroundGraphics,
            "header": {
                "left": headerLeft,
                "center": headerCenter,
                "right": headerRight,
                "displayHeaderLine": $('#pdfHeaderLine').prop('checked')
            },
            "footer": {
                "left": footerLeft,
                "center": footerCenter,
                "right": footerRight,
                "displayFooterLine": $('#pdfFooterLine').prop('checked')
            }
        };

    }

    exportPDF() {

        var thisObject = this;

        /**
         * Get export options and hide dialog
         */
        var pdfOptions = this.getPDFExportOptions();
        this.hideExportDialog();

        /**
         * Show exporting dialog
         */
        var exportDialog = bootbox.dialog({
            title: 'Export to PDF',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to PDF...</p>'
        });

        /**
         * Call export service
         */
        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/PDF',
            data: {
                PDFOptions: pdfOptions,
                HTML: btoa(unescape(encodeURIComponent($('#' + this.app.viewer.report.id + '_canvas').html()))),

            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {


                var blob = new Blob([data]);
                //var link = document.createElement('a');
                //link.href = window.URL.createObjectURL(blob);
                //link.download = "Report.pdf";

                var sContent = `Report has been converted to PDF, click on button to download file<br><br>
                <a class="btn btn-primary" href="${window.URL.createObjectURL(blob)}" download="Report.pdf" onClick="$('.bootbox.modal').modal('hide');">Download report</a>`;

                exportDialog.find('.bootbox-body').html(sContent);

                thisObject.hideExportDialog();
                thisObject.app.modules.Printing.applyPageStyles();

            }
        });
    }

    print() {

        var thisObject = this;

        var loadingDialog = bootbox.dialog({
            message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Generating and printing report...</p>',
            closeButton: false
        });

        //$('#reportPage').css('max-width', '');
        //$('#reportPage').css('width', '');
        //$('#reportPage').css('min-height', '');

        //$('#reportPage').css('padding-top', '');
        //$('#reportPage').css('padding-bottom', '');
        //$('#reportPage').css('padding-left', '');
        //$('#reportPage').css('padding-right', '');
        //$('#reportPage').css('margin-right', '1px');

        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/PDF',
            data: {
                PDFOptions: this.getPDFExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#' + this.app.viewer.report.id + '_canvas').html()))),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //console.log(data);
                //console.log(status);

                var pdfBlob = new Blob([data], { type: 'application/pdf' });
                pdfBlob = window.URL.createObjectURL(pdfBlob)

                $('#__metadocxPDFPrint').remove();

                var printFrame = document.createElement('iframe');
                printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0');
                printFrame.setAttribute('id', '__metadocxPDFPrint');
                printFrame.setAttribute('src', pdfBlob);

                document.getElementsByTagName('body')[0].appendChild(printFrame);
                var iframeElement = document.getElementById('__metadocxPDFPrint');

                iframeElement.onload = () => {
                    iframeElement.focus();
                    iframeElement.contentWindow.print();
                }

                thisObject.app.modules.Printing.applyPageStyles();
                //$('#reportPage').css('margin-right', 'auto');

                loadingDialog.modal('hide');

            }
        });


    }


}
window.__Metadocx.PDFModule = PDFModule;
/**
 * Printing module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class PrintingModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;

        /**
         * Types of paper sizes
         */
        this.PaperSize = {
            A0: 'A0',
            A1: 'A1',
            A2: 'A2',
            A3: 'A3',
            A4: 'A4',
            A5: 'A5',
            A6: 'A6',
            A7: 'A7',
            A8: 'A8',
            A9: 'A9',
            B0: 'B0',
            B1: 'B1',
            B2: 'B2',
            B3: 'B3',
            B4: 'B4',
            B5: 'B5',
            B6: 'B6',
            B7: 'B7',
            B8: 'B8',
            B9: 'B9',
            B10: 'B10',
            C5E: 'C5E',
            Comm10E: 'Comm10E',
            DLE: 'DLE',
            Executive: 'Executive',
            Folio: 'Folio',
            Ledger: 'Ledger',
            Legal: 'Legal',
            Letter: 'Letter',
            Tabloid: 'Tabloid',
            Custom: 'Custom',
        };

        /**
         * Paper size width and height in mm
         */
        this.PaperSizeProperties = {

            A0: { width: 841, height: 1189 },
            A1: { width: 594, height: 841 },
            A2: { width: 420, height: 594 },
            A3: { width: 297, height: 420 },
            A4: { width: 210, height: 297 },
            A5: { width: 148, height: 210 },
            A6: { width: 105, height: 148 },
            A7: { width: 74, height: 105 },
            A8: { width: 52, height: 74 },
            A9: { width: 37, height: 52 },
            B0: { width: 1000, height: 1414 },
            B1: { width: 707, height: 1000 },
            B2: { width: 500, height: 707 },
            B3: { width: 353, height: 500 },
            B4: { width: 250, height: 353 },
            B5: { width: 176, height: 250 },
            B6: { width: 125, height: 176 },
            B7: { width: 88, height: 125 },
            B8: { width: 62, height: 88 },
            B9: { width: 33, height: 62 },
            B10: { width: 31, height: 44 },
            C5E: { width: 163, height: 229 },
            Comm10E: { width: 105, height: 241 },
            DLE: { width: 110, height: 220 },
            Executive: { width: 190.5, height: 254 },
            Folio: { width: 210, height: 330 },
            Ledger: { width: 431.8, height: 279.4 },
            Legal: { width: 215.9, height: 355.6 },
            Letter: { width: 215.9, height: 279.4 },
            Tabloid: { width: 279.4, height: 431.8 },
            Custom: { width: 0, height: 0 }
        };

        /**
         * Page orientations
         */
        this.PageOrientation = {
            Portrait: 'portrait',
            Landscape: 'landscape'
        };


    }

    initialize() {
        super.initialize();
    }

    getPaperSizeOptions() {
        var s = '';
        for (var x in this.PaperSize) {
            s += '<option value="' + this.PaperSize[x] + '">' + this.PaperSize[x] + '</option>';
        }
        return s;
    }

    getPaperSize(name) {
        if (this.PaperSizeProperties[name] != undefined) {
            return this.PaperSizeProperties[name];
        } else {
            return { width: 0, height: 0 };
        }
    }

    applyPageStyles() {

        var paperSize = this.getPaperSize(this.app.viewer.options.page.paperSize);
        var pageOrientation = this.app.viewer.options.page.orientation;

        var width = 0;
        var height = 0;

        if (pageOrientation == this.PageOrientation.Landscape) {
            width = paperSize.height;
            height = paperSize.width;
        } else {
            width = paperSize.width;
            height = paperSize.height;
        }

        $('#reportPage').css('max-width', width + 'mm');
        $('#reportPage').css('width', width + 'mm');
        $('#reportPage').css('min-height', height + 'mm');

        $('#reportPage').css('padding-top', this.app.viewer.options.page.margins.top + 'in');
        $('#reportPage').css('padding-bottom', this.app.viewer.options.page.margins.bottom + 'in');
        $('#reportPage').css('padding-left', this.app.viewer.options.page.margins.left + 'in');
        $('#reportPage').css('padding-right', this.app.viewer.options.page.margins.right + 'in');

    }



}
window.__Metadocx.PrintingModule = PrintingModule;
/**
 * UI module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class UIModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 200;
        this.isConsoleDisabled = false;

        /**
        * Conversion ratio centimeters to pixels
        */
        this._cmToPx = 37.7952;

        /**
         * Conversion ratio points to pixels
         */
        this._ptToPx = 1.32835;

        /**
         * Conversion ratio inches to pixels
         */
        this._inchToPx = 96;

        /**
        * Conversion ratio mm to inches
        */
        this._mmToInches = 0.0393701;

    }

    initialize() {
        super.initialize();
    }

    renderReportViewer(app) {
        console.groupEnd();
        console.groupCollapsed('[Metadocx] Render report viewer');
        app.viewer.render();
        console.groupEnd();
    }

    convertInchesToPixels(inches) {
        return inches * this._inchToPx;
    }

    convertPixelsToInches(pixels) {
        return pixels / this._inchToPx;
    }

    convertInchesToMM(inches) {
        return parseFloat((inches / this._mmToInches).toFixed(2));
    }

    convertMMtoInches(mm) {
        return parseFloat(mm * this._mmToInches);
    }


}
window.__Metadocx.UIModule = UIModule;
/**
 * Word module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class WordModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 500;
        this.isConsoleDisabled = false;
        this.exportDialog = null;
    }

    initialize() {
        super.initialize();
    }

    showExportDialog() {

        if (this.exportDialog === null) {
            $(this.app.viewer.getContainerSelector()).append(this.renderExportDialog());
            this.hookExportDialogComponents();
            this.exportDialog = new bootstrap.Modal('#' + this.app.viewer.options.id + '_wordExportDialog', {})
        }

        $('#wordPaperSize').val(this.app.viewer.options.page.paperSize);

        var paperSize = this.app.modules.Printing.getPaperSize($('#wordPaperSize').val());
        $('#wordPaperSizeWidth').val(paperSize.width);
        $('#wordPaperSizeHeight').val(paperSize.height);

        if (this.app.viewer.options.page.orientation == Metadocx.modules.Printing.PageOrientation.Portrait) {
            $('#wordOrientationPortrait').prop('checked', true);
            $('#wordOrientationLandscape').prop('checked', false);
        } else {
            $('#wordOrientationPortrait').prop('checked', false);
            $('#wordOrientationLandscape').prop('checked', true);
        }

        $('#wordTopMargin').val(this.app.viewer.options.page.margins.top);
        $('#wordBottomMargin').val(this.app.viewer.options.page.margins.bottom);
        $('#wordLeftMargin').val(this.app.viewer.options.page.margins.left);
        $('#wordRightMargin').val(this.app.viewer.options.page.margins.right);

        this.exportDialog.show();

    }


    renderExportDialog() {

        return `<div id="${this.app.viewer.options.id}_wordExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Word Export</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between">
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label for="wordPaperSize" class="form-label font-weight-bold">Orientation</label>
                    
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wordOrientation" id="wordOrientationPortrait">
                            <label class="form-check-label" for="wordOrientationPortrait">
                                Portrait
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="wordOrientation" id="wordOrientationLandscape">
                            <label class="form-check-label" for="wordOrientationLandscape">
                                Landscape
                            </label>
                        </div>
                    </div>
                    <div class="mb-3">                                
                        <label for="wordPaperSize" class="form-label font-weight-bold">Paper size</label>
                        <select id="wordPaperSize" class="form-select">
                        ${this.app.modules.Printing.getPaperSizeOptions()}
                        </select>
                    </div>
                    <div class="mb-3 wordPaperSizeWidths" style="display:none;">                                
                        <label for="wordPaperSizeWidth" class="form-label font-weight-bold">Paper width (mm)</label>
                        <input id="wordPaperSizeWidth" class="form-control" type="number" />
                    </div>
                    <div class="mb-3 wordPaperSizeWidths" style="display:none;">                                
                        <label for="wordPaperSizeHeight" class="form-label font-weight-bold">Paper height (mm)</label>
                        <input id="wordPaperSizeHeight" class="form-control" type="number" />
                    </div>

                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="wordGrayscale">
                        <label class="form-check-label" for="wordGrayscale">
                            Grayscale
                        </label>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="wordUseCompression" checked>
                        <label class="form-check-label" for="wordUseCompression">
                            word Compression
                        </label>
                    </div>  
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="wordIncludeOutline" checked>
                        <label class="form-check-label" for="wordIncludeOutline">
                            Include document outline
                        </label>
                    </div> 
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="wordPrintBackgrounds" checked>
                        <label class="form-check-label" for="wordPrintBackgrounds">
                            Background graphics
                        </label>
                    </div>      
                </div>
                <div class="d-flex flex-column p-2">
                    <div class="mb-3">                                
                        <label class="form-label font-weight-bold">Margins</label>
              
                        <div class="mb-3 row">
                            <label for="wordTopMargin" class="col-sm-4 col-form-label">Top</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="wordTopMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="wordBottomMargin" class="col-sm-4 col-form-label">Bottom</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="wordBottomMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="wordLeftMargin" class="col-sm-4 col-form-label">Left</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="wordLeftMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>
                        <div class="mb-3 row">
                            <label for="wordRightMargin" class="col-sm-4 col-form-label">Right</label>
                            <div class="col-sm-6">
                                <input type="number" class="form-control" id="wordRightMargin" value="0" style="width:80px;margin-left:30px;">
                            </div>
                            <label class="col-sm-2 col-form-label">in.</label>
                        </div>                                                    
                    </div>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="wordDisplayHeader">
                        <label class="form-check-label" for="wordDisplayHeader">
                            Display header
                        </label>
                    </div>    
                </div>                
            </div>
            <div class="row word-header-row p-2" style="display:none;">
                <div class="col-4"><input id="wordHeaderLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="wordHeaderCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="wordHeaderRight" type="text" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 word-header-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="wordHeaderLine">
                        <label class="form-check-label" for="wordHeaderLine">
                            Display header line
                        </label>
                    </div>                    
                </div>
            </div>
            <div class="row p-2">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="wordDisplayFooter">
                        <label class="form-check-label" for="wordDisplayFooter">
                            Display footer
                        </label>
                    </div> 
                </div>                
            </div>
            <div class="row word-footer-row p-2" style="display:none;">
                <div class="col-4"><input id="wordFooterLeft" type="text" class="form-control" placeholder="Left Content"/></div>
                <div class="col-4"><input id="wordFooterCenter" type="text" class="form-control" style="text-align:center;" placeholder="Center Content"/></div>
                <div class="col-4"><input id="wordFooterRight" type="text" class="form-control" style="text-align:right;" class="form-control" placeholder="Right Content"/></div>
            </div>
            <div class="row mb-3 word-footer-row p-2" style="display:none;">
                <div class="col-12">
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="wordFooterLine">
                        <label class="form-check-label" for="wordFooterLine">
                            Display footer line
                        </label>
                    </div>                    
                </div>
            </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onClick="Metadocx.modules.Word.exportWord();"><i class="fa-solid fa-check"></i>&nbsp;Export Word</button>
          </div>
          </div>
      </div>
      </div>`;

    }

    hookExportDialogComponents() {

        $('#wordDisplayHeader').off('click').on('click', () => {
            if ($('#wordDisplayHeader').prop('checked')) {
                $('.word-header-row').show();
            } else {
                $('.word-header-row').hide();
            }
        });

        $('#wordDisplayFooter').off('click').on('click', () => {
            if ($('#wordDisplayFooter').prop('checked')) {
                $('.word-footer-row').show();
            } else {
                $('.word-footer-row').hide();
            }
        });

        $('#wordPaperSize').off('change').on('change', () => {
            if ($('#wordPaperSize').val() == 'Custom') {
                $('.wordPaperSizeWidths').css('display', '');
                $('.wordPaperSizeWidths').show();
            } else {
                $('.wordPaperSizeWidths').hide();
            }

            var paperSize = this.app.modules.Printing.getPaperSize($('#wordPaperSize').val());
            $('#wordPaperSizeWidth').val(paperSize.width);
            $('#wordPaperSizeHeight').val(paperSize.height);
        });

    }


    getWordExportOptions() {

        var orientation = Metadocx.modules.Printing.PageOrientation.Portrait;
        if ($('#wordOrientationLandscape').prop('checked')) {
            orientation = Metadocx.modules.Printing.PageOrientation.Landscape;
        }

        return {
            "page": {
                "orientation": orientation,
                "paperSize": $('#wordPaperSize').val(),
                "width": $('#wordPaperSizeWidth').val(),
                "height": $('#wordPaperSizeHeight').val(),
                "margins": {
                    "top": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#wordTopMargin').val())),
                    "bottom": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#wordBottomMargin').val())),
                    "left": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#wordLeftMargin').val())),
                    "right": Metadocx.modules.UI.convertInchesToMM(parseFloat($('#wordRightMargin').val()))
                }
            },
            "grayscale": $('#wordGrayscale').prop('checked'),
            "wordCompression": $('#wordUseCompression').prop('checked'),
            "outline": $('#wordIncludeOutline').prop('checked'),
            "backgroundGraphics": $('#wordPrintBackgrounds').prop('checked'),
            "header": {
                "left": $('#wordHeaderLeft').val(),
                "center": $('#wordHeaderCenter').val(),
                "right": $('#wordHeaderRight').val(),
                "displayHeaderLine": $('#wordHeaderLine').prop('checked')
            },
            "footer": {
                "left": $('#wordFooterLeft').val(),
                "center": $('#wordFooterCenter').val(),
                "right": $('#wordFooterRight').val(),
                "displayFooterLine": $('#wordFooterLine').prop('checked')
            }
        };

    }

    exportWprd() {
        $.ajax({
            type: 'post',
            url: '/Convert/word',
            data: {
                ExportOptions: this.getWordExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#reportPage').html()))),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //console.log(data);
                //console.log(status);

                var blob = new Blob([data]);
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "Report.docx";
                link.click();

            }
        });
    }


}
window.__Metadocx.WordModule = WordModule;
/**
 * Metadocx reporting application bootstrap
 * This will create the global Metadocx object and check for jQuery
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
if (!window.Metadocx) {
    window.Metadocx = new MetadocxApplication();
}

/**
 * Check for jQuery library if not available inject script tag
 */
if (!window.jQuery) {
    /**
     * jQuery object does not exist, inject script tag
     */
    console.log('jQuery is not loaded, adding script tag');

    (function (d, s, id) {
        var js, lsjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            console.log('Package is already loaded, skipping');
            return;
        }
        js = d.createElement(s); js.id = id;
        js.onload = function () {
            // jQuery is loaded, call initialize on document load
            $(function () {
                Metadocx.initialize();
            });
        };
        js.src = 'https://code.jquery.com/jquery-3.6.1.min.js';
        js.crossOrigin = 'anonymous';
        lsjs.parentNode.insertBefore(js, lsjs);
    }(document, 'script', 'jquery'));

} else {

    // jQuery is loaded, call initialize on document load
    $(function () {
        Metadocx.initialize();
    });
}