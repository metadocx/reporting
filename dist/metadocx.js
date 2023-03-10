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
    let whitespace = /\s/;
    let pair = /\(\)|\[\]|\{\}/;

    let args = new Array();
    let string = this.toString();

    let fat = (new RegExp(
        '^s*(' +
        ((this.name) ? this.name + '|' : '') +
        'function' +
        ')[^)]*\\('
    )).test(string);

    let state = 'start';
    let depth = new Array();
    let tmp;

    for (let index = 0; index < string.length; ++index) {
        let ch = string[index];

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
                let escaped = depth.length > 0 && depth[depth.length - 1] == '\\';
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
                            throw new Error('JSONFunction singleArg');
                        args.push(string.substring(tmp, index).trim());
                        state = (fat) ? 'body' : 'arrow';
                        break;

                    case ',':
                        if (depth.length > 0)
                            continue;
                        if (state == 'singleArg')
                            throw new Error('JSONFunction singleArg');
                        args.push(string.substring(tmp, index).trim());
                        tmp = index + 1;
                        break;

                    case '>':
                        if (depth.length > 0)
                            continue;
                        if (string[index - 1] != '=')
                            continue;
                        if (state == 'arg')
                            throw new Error('JSONFunction arg');
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
                    throw new Error('JSONFunction Error in arrow');
                if (string[++index] != '>')
                    throw new Error('JSONFunction Error in arrow');
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
                throw new Error('JSONFunction');
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
        Metadocx.reporting.viewer.applyReportViewerOptions();
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
        this.parentCriteria = null;
        this.childCriterias = [];
        this.resetChildCriteriaOnChange = true;
    }

    /**
     * Initializes any javascript code for this criteria
     * Sets JS object (if any) to this._instance
     */
    initializeJS() {
        return null;
    }

    /**
     * Renders the criterias HTML code
     */
    render() {
        throw new Error('Must redefine function render');
    }

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
     * Sets is criterias is enabled or not
     * @param {*} bEnabled 
     */
    setIsEnabled(bEnabled) {
        $('#criteriaEnabled_' + this.id).prop('checked', bEnabled);
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

    /**
     * Sets parent criteria control
     * @param {*} ctl 
     */
    setParentCriteria(ctl) {
        this.parentCriteria = ctl;
    }

    /**
     * Returns parent criteria control
     * @returns 
     */
    getParentCriteria() {
        return this.parentCriteria;
    }

    /**
     * Adds a child criteria control
     * @param {*} ctl 
     */
    addChildCriteria(ctl) {
        ctl.setParentCriteria(this);
        this.childCriterias.push(ctl);
    }

    /**
     * Returns child criteria controls
     * @returns 
     */
    getChildCriterias() {
        return this.childCriterias;
    }

}

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
            let criteriaValue = this.app.reporting.viewer.getCriteriaValue(aCriterias[x].id);
            if (criteriaValue && criteriaValue.enabled === false) {
                continue;
            }

            for (let r in this.data) {
                for (let a in aCriterias[x].applyTo) {

                    if (this.hasColumn(aCriterias[x].applyTo[a].field)) {

                        switch (aCriterias[x].type) {
                            case 'TextCriteria':
                                if (this.data[r][aCriterias[x].applyTo[a].field] != criteriaValue.value) {
                                    this.data[r]['__visible'] = false;
                                }
                                break;
                            case 'DatePeriodCriteria':
                                if (!moment(this.data[r][aCriterias[x].applyTo[a].field]).isBetween(criteriaValue.value.startDate, criteriaValue.value.endDate, undefined, '[]')) {
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
                                        if (!(this.data[r][aCriterias[x].applyTo[a].field] >= criteriaValue.value.startValue &&
                                            this.data[r][aCriterias[x].applyTo[a].field] <= criteriaValue.value.endValue)) {
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
        return null;
    }

    /**
     * Called after the table HTML is rendered
     */
    postRender() {
        return null;
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
            if (this.app.modules.DataType.toBool(column.visible, true)) {
                // visible by default
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

                if (cellModel['align']) {
                    cellStyle += 'text-align:' + cellModel['align'] + ';';
                }

                /**
                 * Format numeric values
                 */
                let cellDisplayValue = this.app.modules.Format.format(cellValue, cellModel['type'], cellModel['format']);

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
/**
 * Metadocx application
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
window.__Metadocx = { Locales: {}, Themes: {} };

class MetadocxApplication {

    constructor() {

        /**
         * Metadocx version
         */
        this.version = '0.3.1';

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

        this.reporting = {
            viewer: new ReportViewer(this),
        };

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
        let aModules = [];
        for (let x in window.__Metadocx) {
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
        for (let x in aModules) {
            this.registerModule(aModules[x]);
        }
        console.groupEnd();

        /**
         * Call other initialize callback scripts
         */
        for (let x in this.onInitializeCallbacks) {
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

            if (this.reporting.viewer.options.report) {
                this.reporting.viewer.load(this.reporting.viewer.options.report);
            } else {
                this.reporting.viewer.showNoReportAlert();
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

        for (let x in this.scriptTag.dataset) {
            this.reporting.viewer.options[x] = this.scriptTag.dataset[x];
        }

        /**
         * Check if we have a name if not set default value
         */
        if (!this.reporting.viewer.options.id) {
            this.reporting.viewer.options.id = "metadocxReport";
        }

        if (!this.reporting.viewer.options.container) {
            this.reporting.viewer.options.container = "metadocx-report";
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
        return null;
    }

    render() {
        return null;
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

    criteriaAppliesToReportSection(criteria) {
        for (let x in criteria.applyTo) {
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

            for (let x in this.reportSection.groupBy) {

                let column = this.getColumn(this.reportSection.groupBy[x].name)
                let aValue = a[this.reportSection.groupBy[x].name];
                let bValue = b[this.reportSection.groupBy[x].name];

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

            for (let x in this.reportSection.orderBy) {

                let column = this.getColumn(this.reportSection.orderBy[x].name)
                let aValue = a[this.reportSection.orderBy[x].name];
                let bValue = b[this.reportSection.orderBy[x].name];

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
            for (let x in this.reportSection.orderBy) {
                if (this.reportSection.orderBy[x].name == name) {
                    return this.reportSection.orderBy[x];
                }
            }
        }

        return null;
    }

    getGroupBy(name) {
        if (this.reportSection.groupBy) {
            for (let x in this.reportSection.groupBy) {
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
        let s = '';

        s += `<div class="report-cover-page">
            <div class="report-cover-header"></div>
            <div class="report-cover-name">${this.app.reporting.viewer.report.getReportDefinition().properties.name}</div>
            <div class="report-cover-description">${this.app.reporting.viewer.report.getReportDefinition().properties.description}</div>
            <div class="report-cover-footer"></div>
            <div class="report-cover-date"><span data-locale="CreatedAt">Created at</span> ${moment().format('YYYY-MM-DD HH:mm')}</div>
            <div class="report-cover-powered-by"><span data-locale="PoweredBy">powered by</span> <a href="https://www.metadocx.com" target="_blank">Metadocx</a></div>
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

            .report-cover-date {                
                position:absolute;
                left:50px;
                bottom:50px;
                font-size: 9pt;
            }

            .report-cover-powered-by {                
                position:absolute;
                right:50px;
                bottom:50px;
                text-align:right;
                font-size: 9pt;
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
        oTable.criteriaValues = this.app.reporting.viewer.getCriteriaValues();

        let s = '';

        this.preRender();

        s += '<div class="report-section-title">';
        if (this.app.reporting.viewer.report.getReportDefinition().properties.name) {
            s += '<h1 class="report-title">' + this.app.reporting.viewer.report.getReportDefinition().properties.name + '</h1>';
        }
        if (this.app.reporting.viewer.report.getReportDefinition().properties.description) {
            s += '<h4 class="report-description">' + this.app.reporting.viewer.report.getReportDefinition().properties.description + '</h4>';
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

/** 
 * DataTable Report section
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class GraphReportSection extends ReportSection {

    constructor(app, reportSection) {
        super(app, reportSection);
        this._graphInstance = null;
        this._labels = [];
        this._graphRendered = false;
        this.onGraphRendered = null;
    }

    render() {
        return `<div id="${this.reportSection.id}_reportSection" class="report-section-graph">                    
                    <canvas id="${this.reportSection.id}_graphCanvas" class="no-print report-graph-canvas"></canvas>
                    <img id="${this.reportSection.id}_graphImage" class="print-only report-graph-image" style="width:100%;"/>                    
                </div>`;
    }



    buildGraphDataSets() {

        let dataSets = [];
        this._labels = [];

        for (let x in this.reportSection.datasets) {

            let ds = this.reportSection.datasets[x];

            if (ds.source = 'section') {

                let data = {};

                let oSection = this.app.reporting.viewer.report.getReportSection(ds.section);
                for (let d in oSection.data) {
                    let row = oSection.data[d];
                    if (!row['__visible']) {
                        continue;
                    }
                    if (data[row[ds.label]] == undefined) {

                        data[row[ds.label]] = {
                            label: row[ds.label],
                            min: parseFloat(row[ds.field]),
                            max: parseFloat(row[ds.field]),
                            data: parseFloat(row[ds.field]),
                            count: 1
                        }
                    } else {
                        if (data[row[ds.label]].min > parseFloat(row[ds.field])) {
                            data[row[ds.label]].min = parseFloat(row[ds.field]);
                        }
                        if (data[row[ds.label]].max < parseFloat(row[ds.field])) {
                            data[row[ds.label]].max = parseFloat(row[ds.field]);
                        }
                        data[row[ds.label]].data += parseFloat(row[ds.field]);
                        data[row[ds.label]].count++;
                    }

                    if (this._labels.indexOf(row[ds.label]) === -1) {
                        this._labels.push(row[ds.label]);
                    }

                }

                let dataArray = [];
                for (let x in data) {

                    /**
                     * Apply formula on data value
                     */
                    switch (ds.formula) {
                        case 'SUM':
                            // Nothing to do sum by default
                            break;
                        case 'AVG':
                            if (parseFloat(data[x].count) != 0) {
                                data[x].data = parseFloat(data[x].data) / parseFloat(data[x].count);
                            } else {
                                data[x].data = 0;
                            }
                            break;
                        case 'MIN':
                            data[x].data = data[x].min;
                            break;
                        case 'MAX':
                            data[x].data = data[x].max;
                            break;
                        case 'COUNT':
                            data[x].data = data[x].count;
                            break;
                    }

                    dataArray.push(data[x]);
                }

                let oDS = {
                    label: this.getModelLabel(ds.field, oSection.model) + this.getDataSetFormula(ds.formula),
                    data: dataArray.map(row => row.data)
                };

                /**
                 * Copy additional dataset options (see Chart.js doc)
                 */
                if (ds.options) {
                    for (let kOption in ds.options) {
                        oDS[kOption] = ds.options[kOption];
                    }
                }

                dataSets.push(oDS);

            }



        }

        return dataSets;

    }

    getDataSetFormula(formula) {
        if (formula == undefined || formula == '') {
            return '';
        }
        switch (formula) {
            case 'SUM':
                return '';
            case 'AVG':
                return ' (avg)';
            case 'MIN':
                return ' (min)';
            case 'MAX':
                return ' (max)';
            case 'COUNT':
                return ' (count)';
        }

        return '';
    }

    getModelLabel(field, model) {
        for (let x in model) {
            if (model[x].name == field) {
                return model[x].label;
            }
        }
        return field;
    }

    buildGraphLabels(datasets) {

        return this._labels;

    }

    initialiseJS() {

        this.app.reporting.viewer.report.addLoadEvent(this.reportSection.id + '_initializeJS');

        if (this.reportSection.css) {
            for (let x in this.reportSection.css) {
                $('#' + this.reportSection.id + '_reportSection').css(x, this.reportSection.css[x]);
            }
        }


        /**
         * Render Chart
         */
        const datasets = this.buildGraphDataSets();
        const labels = this.buildGraphLabels(datasets);

        let options = {};
        if (this.reportSection.options != undefined) {
            options = this.reportSection.options;
        }

        let plugins = [];

        plugins.push({
            afterRender: () => {
                let graphCanvas = document.getElementById(this.reportSection.id + '_graphCanvas');
                let graphImage = document.getElementById(this.reportSection.id + '_graphImage');
                graphImage.src = graphCanvas.toDataURL();
                this._graphRendered = true;
                if (this.onGraphRendered !== null) {
                    this.onGraphRendered();
                }
                this.app.reporting.viewer.report.setLoadEventCompleted(this.reportSection.id + '_initializeJS');
            },
            beforeUpdate: (chart, args, options) => {

                let helpers = Chart.helpers;
                let scheme = this.app.reporting.viewer.getTheme().getColorScheme();
                let length, colorIndex, color;

                let fillAlpha = 0.4;
                let override = true;

                if (scheme) {

                    length = scheme.length;

                    // Set scheme colors
                    chart.config.data.datasets.forEach(function (dataset, datasetIndex) {
                        colorIndex = datasetIndex % length;
                        color = scheme[colorIndex];

                        switch (dataset.type || chart.config.type) {
                            // For line, radar and scatter chart, borderColor and backgroundColor (50% transparent) are set
                            case 'line':
                            case 'radar':
                            case 'scatter':
                                if (typeof dataset.backgroundColor === 'undefined' || override) {
                                    dataset.backgroundColor = helpers.color(color).alpha(fillAlpha).rgbString();
                                }
                                if (typeof dataset.borderColor === 'undefined' || override) {
                                    dataset.borderColor = color;
                                }
                                if (typeof dataset.pointBackgroundColor === 'undefined' || override) {
                                    dataset.pointBackgroundColor = helpers.color(color).alpha(fillAlpha).rgbString();
                                }
                                if (typeof dataset.pointBorderColor === 'undefined' || override) {
                                    dataset.pointBorderColor = color;
                                }
                                break;
                            // For doughnut and pie chart, backgroundColor is set to an array of colors
                            case 'doughnut':
                            case 'pie':
                            case 'polarArea':
                                if (typeof dataset.backgroundColor === 'undefined' || override) {
                                    dataset.backgroundColor = dataset.data.map(function (data, dataIndex) {
                                        colorIndex = dataIndex % length;
                                        return scheme[colorIndex];
                                    });
                                }
                                break;
                            // For bar chart backgroundColor (including fillAlpha) and borderColor are set
                            case 'bar':
                                if (typeof dataset.backgroundColor === 'undefined' || override) {
                                    dataset.backgroundColor = helpers.color(color).alpha(fillAlpha).rgbString();
                                }
                                if (typeof dataset.borderColor === 'undefined' || override) {
                                    dataset.borderColor = color;
                                }
                                break;
                            // For the other chart, only backgroundColor is set
                            default:
                                if (typeof dataset.backgroundColor === 'undefined' || override) {
                                    dataset.backgroundColor = color;
                                }
                                break;
                        }
                    });
                }


            }
        });

        this._graphInstance = new Chart(
            document.getElementById(this.reportSection.id + '_graphCanvas'),
            {
                type: this.reportSection.chartType,
                options: options,
                plugins: plugins,
                data: {
                    labels: labels,
                    datasets: datasets
                }
            }
        );

        this._graphInstance.resize();
    }

}
window.__Metadocx.GraphReportSection = GraphReportSection;
/** 
 * DataTable Report section
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class HTMLReportSection extends ReportSection {

    constructor(app, reportSection) {
        super(app, reportSection);
    }


    render() {

        let content = '';

        if (Array.isArray(this.reportSection.content)) {
            // Array of strings
            content = this.reportSection.content.join('');
        } else if (typeof this.reportSection.content === 'object') {
            if (this.reportSection.content.url !== undefined) {
                // Url ajax content
                $.ajax(this.reportSection.content.url, {
                    async: false,
                    dataType: 'json',
                    success: (data, status, xhr) => {
                        content = data.content;
                    }
                });

            }
        } else {
            // Default string content
            content = this.reportSection.content;
        }


        return `<div class="report-section-html">
                    ${content}
                </div>`;
    }

}
window.__Metadocx.HTMLReportSection = HTMLReportSection;
/** 
 * Report
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class Report extends Consolable {

    constructor(app) {

        super(app);

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

        /**
         * Instance of the report definition file validator
         */
        this._reportValidator = null;

        /**
         * List of loads events that must be completed before report is considered loaded
         */
        this._loadEvents = {};

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

    addLoadEvent(name) {
        this.log('Load event :: ' + name);
        this._loadEvents[name] = false;
    }

    setLoadEventCompleted(name) {
        this.log('Load event :: ' + name + ' completed');
        this._loadEvents[name] = true;
        if (this.checkIfReportIsLoaded()) {
            this.app.modules.Console.log('Report is loaded, calling onReportLoaded');
            if (this.onReportLoaded !== null) {
                this.onReportLoaded();
            }
        }
    }

    checkIfReportIsLoaded() {
        for (let x in this._loadEvents) {
            if (this._loadEvents[x] == false) {
                return false;
            }
        }
        return true;
    }

    /**
    * Loads report definition file
    */
    loadReportDefinition(reportDefinitionUrl) {

        this.addLoadEvent('loadReportDefinition');

        if (reportDefinitionUrl != undefined) {
            this._reportDefinitionUrl = reportDefinitionUrl;
        }

        if (typeof reportDefinitionUrl === 'object') {
            this._reportDefinition = reportDefinitionUrl;


            this._reportCriteriasRendered = false;
            this._reportSettingsRendered = false;

            /**
             * Copy Report definition options to viewer options, replaces default values
             */
            this.validateReportDefinitionFile();
            this.app.modules.DataType.copyObjectProperties(this.getReportDefinition().options, this.app.reporting.viewer.options);


            if (this.onReportDefinitionFileLoaded) {
                this.onReportDefinitionFileLoaded();
            }
            this.setLoadEventCompleted('loadReportDefinition');
        } else if (this._reportDefinition === null) {
            $.get(this._reportDefinitionUrl, (data, status) => {
                this._reportDefinition = data;
                /**
                 * Copy Report definition options to viewer options, replaces default values
                 */
                this.validateReportDefinitionFile();
                this.app.modules.DataType.copyObjectProperties(this.getReportDefinition().options, this.app.reporting.viewer.options);


                if (this.onReportDefinitionFileLoaded) {
                    this.onReportDefinitionFileLoaded();
                }
                this.setLoadEventCompleted('loadReportDefinition');

            });
        } else {

            if (this.onReportDefinitionFileLoaded) {
                this.onReportDefinitionFileLoaded();
            }
            this.setLoadEventCompleted('loadReportDefinition');
        }

    }

    validateReportDefinitionFile() {
        console.group('[Metadocx] Validating report definition file');
        if (this._reportValidator === null) {
            this._reportValidator = new ReportValidator(this.app);
        }
        this._reportValidator.validate(this._reportDefinition);
        console.groupEnd();
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
        if (this.app.reporting.viewer.options.printing.method == 'browser') {
            // Use default browser print 
            window.print();
        } else if (this.app.reporting.viewer.options.printing.method == 'pdf') {
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

        let s = '';

        s += `<div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0" data-locale="ReportProperties">Report properties</h4>
                </div>
                <div class="card-body">     
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsName" data-locale="Name">Name</label>
                        <input class="form-control" type="text" id="reportSettingsName" placeholder="Report name" value="${this.getReportDefinition().properties.name}" data-locale="ReportName">
                    </div> 
                    <div class="mb-4">
                        <label class="form-label" for="reportSettingsDescription" data-locale="Description">Description</label>
                        <input class="form-control" type="text" id="reportSettingsDescription" placeholder="Report description" value="${this.getReportDefinition().properties.description}" data-locale="ReportDescription">                        
                    </div> 
                </div>
            </div>`;

        for (let kSection in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[kSection];
            let sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            switch (oSection.type) {
                case 'HTML':
                    s += this.renderReportSettingsHTML(oSection, oReportSection);
                    break;
                case 'Chart':
                    s += this.renderReportSettingsChart(oSection, oReportSection);
                    break;
                case 'DataTable':
                    s += this.renderReportSettingsDataTable(oSection, oReportSection);
                    break;
            }

        }

        s += `
        <div class="float-end">
            <button class="btn btn-secondary mr5" onClick="Metadocx.reporting.viewer.cancelSettings();" data-locale="Cancel">Cancel</button>
            <button class="btn btn-primary" onClick="Metadocx.reporting.viewer.applySettings();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;<span data-locale="ApplySettings">Apply Settings</span></button>
        </div>
        `;

        $('#' + this.id + '_reportSettingsZone').html(s);

        /**
         * Once html is inserted in report viewer call post render
         */
        for (let kSection in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[kSection];
            let sReportSectionType = this.getReportDefinition().sections[kSection].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.getReportDefinition().sections[kSection]);

            switch (oSection.type) {
                case 'HTML':
                    this.postRenderReportSettingsHTML(oSection, oReportSection);
                    break;
                case 'Chart':
                    this.postRenderReportSettingsChart(oSection, oReportSection);
                    break;
                case 'DataTable':
                    this.postRenderSettingsDataTable(oSection, oReportSection);
                    break;
            }

        }


        this._reportSettingsRendered = true;

    }



    renderReportSettingsHTML(oSection, oReportSection) { return ''; }

    postRenderReportSettingsHTML(oSection, oReportSection) { }

    renderReportSettingsChart(oSection, oReportSection) { return ''; }

    postRenderReportSettingsChart(oSection, oReportSection) { }

    renderReportSettingsDataTable(oSection, oReportSection) {

        let s = '';
        let sFields = '<table id="' + oSection.id + '_fields" class="table table-condensed report-sortable">';
        sFields += '<tbody>';
        for (let x in oSection.model) {

            let sFieldSelected = ' checked';
            if (!oReportSection.isColumnVisible(oSection.model[x].name)) {
                sFieldSelected = '';
            }

            sFields += `<tr data-section="${oSection.id}" data-column="${oSection.model[x].name}">
                <td style="width:30px;text-align:center;"><i class="uil uil-sort fs16"></i></td>
                <td style="width:30px;text-align:center;"><input id="${oSection.id}_field_${oSection.model[x].name}" type="checkbox"${sFieldSelected}/></td>
                <td id="${oSection.id}_label_${oSection.model[x].name}">${oSection.model[x].label}</td>
                <td style="width:150px;">
                    <select id="${oSection.id}_formula_${oSection.model[x].name}" class="form-control form-control-sm" style="width:100%;">
                        <option value=""${(oSection.model[x].formula == '' ? ' selected' : '')} data-locale="None">(None)</option>
                        <option value="SUM"${(oSection.model[x].formula == 'SUM' ? ' selected' : '')} data-locale="Sum">Sum</option>
                        <option value="AVG"${(oSection.model[x].formula == 'AVG' ? ' selected' : '')} data-locale="Average">Average</option>
                        <option value="MIN"${(oSection.model[x].formula == 'MIN' ? ' selected' : '')} data-locale="MinValue">Min Value</option>
                        <option value="MAX"${(oSection.model[x].formula == 'MAX' ? ' selected' : '')} data-locale="MaxValue">Max Value</option>
                        <option value="COUNT"${(oSection.model[x].formula == 'COUNT' ? ' selected' : '')} data-locale="Count">Count</option>
                    </select>
                </td>
                <td style="width:30px;">
                    <button class="btn btn-sm" onClick="Metadocx.reporting.viewer.showFieldPropertiesDialog('${oSection.id}', '${oSection.model[x].name}');"><i class="uil uil-ellipsis-h fs20"></i></button>
                </td>
            </tr>`;
        }
        sFields += '</tbody>';
        sFields += '</table>';

        /**
         * ORDER BY 
         */
        let sOrderBy = '<table id="' + oSection.id + '_orderBy" class="table table-condensed report-sortable">';
        sOrderBy += '<tbody>';
        for (let x in oSection.model) {


            let oOrderBy = oReportSection.getOrderBy(oSection.model[x].name);

            let sAscSelected = '';
            let sDescSelected = '';
            let sOrderBySelected = '';
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
                                    <option value="asc"${sAscSelected} data-locale="Ascending">Ascending</option>
                                    <option value="desc"${sDescSelected} data-locale="Descending">Descending</option>                                    
                                </select>
                            </td>
                        </tr>`;
        }
        sOrderBy += '</tbody>';
        sOrderBy += '</table>';

        /**
         * GROUP BY 
         */
        let sGroupBy = '<table id="' + oSection.id + '_groupBy" class="table table-condensed report-sortable">';
        sGroupBy += '<tbody>';
        for (let x in oSection.model) {

            let oGroupBy = oReportSection.getGroupBy(oSection.model[x].name);

            let sAscSelected = '';
            let sDescSelected = '';
            let sGroupBySelected = '';
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
                                <option value="asc"${sAscSelected} data-locale="Ascending">Ascending</option>
                                <option value="desc"${sDescSelected} data-locale="Descending">Descending</option>                                    
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
                                            <i class="uil uil-columns fs20"></i>&nbsp;<span data-locale="Fields">Fields</span>
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
                                            <i class="uil uil-sort-amount-down fs20"></i>&nbsp;<span data-locale="Order">Order</span>
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
                                            <i class="uil uil-layer-group fs20"></i>&nbsp;<span data-locale="Groups">Groups</span>
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


        return s;

    }

    postRenderSettingsDataTable(oSection, oReportSection) {
        $('.report-sortable tbody').sortable({
            placeholder: 'ui-state-highlight',
            helper: 'clone',
            update: function (e, ui) {
                console.log(e);
                console.log(ui);
            },
        });

        /**
         * Reorder table rows based on orderby and groupby config
         */
        let reversedKeys = Object.keys(oSection.orderBy).reverse();
        reversedKeys.forEach(key => {
            $('#' + oSection.id + '_orderByRow_' + oSection.orderBy[key].name).prependTo('#' + oSection.id + '_orderBy');
        });


        /**
         * Reorder table rows based on orderby and groupby config
         */
        reversedKeys = Object.keys(oSection.groupBy).reverse();
        reversedKeys.forEach(key => {
            $('#' + oSection.id + '_groupByRow_' + oSection.groupBy[key].name).prependTo('#' + oSection.id + '_groupBy');
        });
    }


    /**
     * Renders report criteria controls HTML
     * @returns string
     */
    renderReportCriterias() {


        if (this._reportCriteriasRendered) {
            return;
        }

        if (this.app.reporting.viewer.options.criterias.automatic) {
            this.createAutomaticCriterias();
        }

        let sCriterias = '';
        let aCriterias = [];
        for (let x in this.getReportDefinition().criterias) {

            let oCriteria = new window.__Metadocx[this.getReportDefinition().criterias[x].type](this.app);
            oCriteria.id = this.getReportDefinition().criterias[x].id;
            oCriteria.reportCriteria = this.getReportDefinition().criterias[x];
            aCriterias.push(oCriteria);

            sCriterias += `<div class="accordion-item">
                            <h2 id="criteriaTitle${this.getReportDefinition().criterias[x].id}" class="accordion-header">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#criteriaDetails_${this.getReportDefinition().criterias[x].id}" aria-expanded="false" aria-controls="flush-collapseOne">
                                    <div class="form-check form-switch form-switch-lg">
                                        <input class="form-check-input criteria-toggle" type="checkbox" role="switch" data-bs-toggle="collapse" data-bs-target id="criteriaEnabled_${this.getReportDefinition().criterias[x].id}">
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

        let s = `<div class="accordion accordion-flush" id="reportCriteriaAccordion">
                  ${sCriterias}  
                </div>`;

        $('#' + this.id + '_criteriasBody').html(s);

        /**
         * Load JS code for components
         */
        for (let x in aCriterias) {
            aCriterias[x].initializeJS();
        }
        this.app.reporting.viewer.criterias = aCriterias;

        // Set parent and child components
        for (let x in aCriterias) {
            if (aCriterias[x].reportCriteria.parent) {
                this.app.reporting.viewer.getCriteria(aCriterias[x].reportCriteria.parent).addChildCriteria(aCriterias[x]);
            }
        }


        this._reportCriteriasRendered = true;

    }

    /**
     * Analyze model and add criterias for fields based on field data type
     */
    createAutomaticCriterias() {

        let criteriaType

        for (let sectionID in this.getReportDefinition().sections) {

            let oSection = this.getReportDefinition().sections[sectionID];

            if (oSection.type != 'DataTable') {
                continue;
            }

            for (let x in oSection.model) {
                let col = oSection.model[x];

                if (col.automaticCriteria !== undefined && col.automaticCriteria === false) {
                    // Skip automatic criteria for this column
                    continue;
                }

                switch (col.type) {
                    case 'date':

                        criteriaType = 'DatePeriodCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push(
                            {
                                "id": col.name,
                                "name": oSection.properties.name + ' - ' + col.label,
                                "description": "",
                                "type": criteriaType,
                                "defaultValue": null,
                                "isRequired": false,
                                "parameters": {
                                    "locale": {
                                        "format": "YYYY-MM-DD",
                                        "separator": " / "
                                    },
                                    "alwaysShowCalendars": true
                                },
                                "applyTo": [
                                    { "section": oSection.id, "field": col.name }
                                ]
                            }
                        );

                        break;
                    case 'number':

                        criteriaType = 'NumericCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });

                        break;
                    case 'boolean':

                        criteriaType = 'BooleanCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }

                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });
                        break;
                    case 'string':

                        criteriaType = 'SelectCriteria';
                        if (col.criteriaType !== undefined) {
                            criteriaType = col.criteriaType;
                        }


                        this.getReportDefinition().criterias.push({
                            "id": col.name,
                            "name": oSection.properties.name + ' - ' + col.label,
                            "description": "",
                            "type": criteriaType,
                            "defaultValue": null,
                            "isRequired": false,
                            "parameters": {
                                "multiple": true,
                                "allowClear": true,
                                "placeholder": "",
                                "closeOnSelect": true
                            },
                            "options": {
                                "source": "data",
                                "field": col.name
                            },
                            "applyTo": [
                                { "section": oSection.id, "field": col.name }
                            ]
                        });

                        break;
                }

            }
        }

    }


    /**
     * Applies criteria values to report
     */
    applyCriterias() {

        this.hideReportCriterias();
        this.app.reporting.viewer.refreshReport();
    }

    /**
     * Displays report criteria section
     */
    showReportCriterias() {

        this._initialCriteriaValues = this.app.reporting.viewer.getCriteriaValues();

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
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.reporting.viewer.getCriteriaValues())) {
            // Criteria values have changed, confirm?
            // @todo reset criterias
        }

        this.hideReportCriterias();
    }

    /**
     * Reset criteria values to original values
     */
    resetCriterias() {
        if (JSON.stringify(this._initialCriteriaValues) != JSON.stringify(this.app.reporting.viewer.getCriteriaValues())) {
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
        this._initialCriteriaValues = this.app.reporting.viewer.getCriteriaValues();
        this._initialReportSettings = {
            sections: [],
        }
        for (let x in this.getReportDefinition().sections) {
            let oSection = this.getReportDefinition().sections[x];
            switch (oSection.type) {
                case 'HTML':
                    break;
                case 'Chart':
                    break;
                case 'DataTable':
                    this._initialReportSettings['sections'].push({
                        id: oSection.id,
                        properties: JSON.parse(JSON.stringify(oSection.properties)),
                        orderBy: JSON.parse(JSON.stringify(oSection.orderBy)),
                        groupBy: JSON.parse(JSON.stringify(oSection.groupBy)),
                        model: JSON.parse(JSON.stringify(oSection.model)),
                    })
                    break;
            }


        }
    }

    getReportSections() {

        return this.getReportDefinition().sections;

    }

    getReportSection(id) {

        for (let x in this.getReportDefinition().sections) {
            if (this.getReportDefinition().sections[x].id == id) {
                return this.getReportDefinition().sections[x];
            }
        }

        return null;

    }

    /**
     * Filter all report section data 
     */
    filter() {

        for (let x in this.getReportDefinition().sections) {
            let oFilter = new DataFilter(this.app);
            oFilter.setReportSection(this.getReportDefinition().sections[x]);
            oFilter.process();
        }

    }

    sort() {
        for (let x in this.getReportDefinition().sections) {
            let oSorter = new DataSorter(this.app);
            oSorter.setReportSection(this.getReportDefinition().sections[x]);
            oSorter.process();
        }
    }


    save() {

        if ($('#newOption').prop('checked')) {
            // Create new report

            if ($('#saveReportName').val().trim() == '') {
                return;
            }

            let reportUID = this.app.modules.DataType.uid();
            this.app.modules.DB.saveReport({
                reportId: this.getReportDefinition().id,
                reportUID: reportUID,
                metadocxVersion: this.app.version,
                creationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                name: $('#saveReportName').val(),
                criteriaValues: Metadocx.reporting.viewer.getCriteriaValues()
            }, () => {
                this.app.reporting.viewer.showToastMessage('Report saved');
            });
            this.app.reporting.viewer.currentSavedReport = reportUID;
            this.app.reporting.viewer.updateUI();
            this.app.reporting.viewer.saveDialog.hide();


        } else {
            // Save as or replace existing report
            let reportUID = $('#savedReports').val();
            this.app.modules.DB.updateReport({
                reportId: this.getReportDefinition().id,
                reportUID: reportUID,
                metadocxVersion: this.app.version,
                creationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                name: $("#savedReports option:selected").text(),
                criteriaValues: Metadocx.reporting.viewer.getCriteriaValues()
            }, (report) => {
                this.app.reporting.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportSaved') + ' - ' + report.name);
            });
            this.app.reporting.viewer.currentSavedReport = reportUID;
            this.app.reporting.viewer.updateUI();
            this.app.reporting.viewer.saveDialog.hide();

        }


    }

    /**
     * Open a saved report
     */
    open() {
        this.app.modules.DB.getReport($('#savedReports').val(), (report) => {

            if (report == null) {
                return;
            }
            this.app.reporting.viewer.setCriteriaValues(report.criteriaValues);
            this.app.reporting.viewer.currentSavedReport = report.reportUID;
            this.app.reporting.viewer.saveDialog.hide();
            this.app.reporting.viewer.updateUI();
            this.app.reporting.viewer.refreshReport();
            this.app.reporting.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportOpened') + ' - ' + report.name);

        });
    }

    delete() {

        if (this.app.reporting.viewer.currentSavedReport === null) {
            return;
        }

        bootbox.confirm({
            message: this.app.modules.Locale.getKey('DeleteReport'),
            title: this.app.modules.Locale.getKey('Delete'),
            callback: (result) => {
                if (result) {
                    // Delete the report
                    this.app.modules.DB.deleteReport(this.app.reporting.viewer.currentSavedReport,
                        (reportUID) => {
                            this.app.reporting.viewer.currentSavedReport = null;
                            this.app.reporting.viewer.updateUI();
                            this.app.reporting.viewer.showToastMessage(this.app.modules.Locale.getKey('ReportDeleted'));
                        });
                }
            }
        });
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

    constructor(app, report) {
        this.app = app;
        this.report = report;
        this.reportSections = [];
    }

    /**
     * Renders page (canvas) where report will be rendered
     * @returns 
     */
    render() {

        let s = '';
        let sReportSection = '';

        let oReportTemplate = new Theme(this.app);

        if (window.__Metadocx.Themes[this.app.reporting.viewer.options.template] != undefined) {
            oReportTemplate = new window.__Metadocx.Themes[this.app.reporting.viewer.options.template](this.app);
        }

        if (this.app.reporting.viewer.options.coverPage.enabled) {
            // Add cover page to report
            s += `<div id="reportCoverPage" class="report-page orientation-${this.app.reporting.viewer.options.page.orientation} size-${this.app.reporting.viewer.options.page.paperSize.toString().toLowerCase()}">
                    <style id="${this.app.reporting.viewer.options.id}_coverPage">
                        ${oReportTemplate.renderCoverPageCSS()}    
                    </style>
                    ${oReportTemplate.renderCoverPage()}
                  </div>`;
        }

        for (let x in this.report.getReportDefinition().sections) {

            let sReportSectionType = this.report.getReportDefinition().sections[x].type + 'ReportSection';
            let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportDefinition().sections[x]);
            this.reportSections.push(oReportSection);

            if (this.app.modules.DataType.toBool(this.report.getReportDefinition().sections[x].breakBefore)) {
                sReportSection += this.renderPageBreak();
            }

            sReportSection += oReportSection.render();

            if (this.app.modules.DataType.toBool(this.report.getReportDefinition().sections[x].breakAfter)) {
                sReportSection += this.renderPageBreak();
            }

        }

        s += `<div id="reportPage" class="report-page orientation-${this.app.reporting.viewer.options.page.orientation} size-${this.app.reporting.viewer.options.page.paperSize.toString().toLowerCase()}">                
                <div id="reportContent">
                    <style id="${this.app.reporting.viewer.options.id}_style">
                    </style>
                    <style id="${this.app.reporting.viewer.options.id}_theme">
                        ${oReportTemplate.renderThemeCSS()}
                    </style>
                    ${sReportSection}
                </div>
            </div>`;

        return s;

    }

    renderPageBreak() {
        return `<div class="page-break"></div>`;
    }

    initialiseJS() {
        for (let x in this.reportSections) {
            if (this.reportSections[x].initialiseJS != undefined) {
                this.reportSections[x].initialiseJS();
            }
        }
    }

}
window.__Metadocx.ReportCanvas = ReportCanvas;
/** 
 * ReportValidator
 * 
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class ReportValidator {

    constructor(app) {
        this.app = app;
        this.reportDefinition = null;
        this.validationWarnings = [];
        this.validationErrors = [];
        this.hasWarnings = false;
        this.hasErrors = false;

        this.reportDefinitionAllowedKeys = ['id', 'properties', 'options', 'criterias', 'sections'];
        this.reportDefinitionRequiredKeys = ['id', 'properties', 'sections'];

        this.reportPropertiesAllowedKeys = ['name', 'description', 'author'];
        this.reportPropertiesRequiredKeys = ['name', 'description'];

        this.jsonXls = {
            id: {
                __type: 'string',
                __required: true
            },
            properties: {
                __type: 'object',
                __required: true,
                name: {
                    __type: 'string',
                    __required: true
                },
                description: {
                    __type: 'string',
                    __required: true
                },
                author: {
                    __type: 'string',
                    __required: false
                }
            },
            options: {
                __type: 'object',
                __required: true,
                locale: {
                    __type: 'string',
                    __required: false,
                    __defaultValue: 'en',
                    __allowedValues: this.app.modules.Locale.getLocales()
                },
                coverPage: {
                    __type: 'object',
                    __required: false,
                    enabled: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: false,
                    }
                },
                template: {
                    __type: 'string',
                    __required: false,
                    __defaultValue: 'Theme2',
                    __allowedValues: this.app.reporting.viewer.getThemes()
                },
                toolbar: {
                    __type: 'object',
                    __required: false,
                    showOptionsButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showSettingsButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showCriteriasButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showPrintButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showExportButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    showCloseButton: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },
                exportFormats: {
                    __type: 'object',
                    __required: false,
                    pdf: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    word: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    excel: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },

                page: {
                    __type: 'object',
                    __required: false,
                    orientation: {
                        __type: 'string',
                        __required: false,
                        __defaultValue: 'portrait',
                        __allowedValues: ['portrait', 'landscape'],
                    },
                    paperSize: {
                        __type: 'string',
                        __required: false,
                        __defaultValue: 'Letter',
                        __allowedValues: this.app.modules.Printing.getPaperSizes()
                    },
                    margins: {
                        __type: 'object',
                        __required: false,
                        top: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        bottom: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        left: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        },
                        right: {
                            __type: 'number',
                            __required: false,
                            __defaultValue: 0.5,
                            __minValue: 0,
                            __maxValue: 5,
                        }
                    }
                },
                settings: {
                    __type: 'object',
                    __required: false,
                    fields: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsSelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    fieldsFormula: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },

                    orderBy: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderByReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderBySelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    orderByOrder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },

                    groupBy: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupByReorder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupBySelection: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    },
                    groupByOrder: {
                        __type: 'boolean',
                        __required: false,
                        __defaultValue: true,
                    }
                },
                formats: {
                    __type: 'object',
                    __required: false,
                    date: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'string',
                            __required: false,
                            __defaultValue: 'YYYY-MM-DD',
                        }
                    },
                    boolean: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'object',
                            __required: false,
                            trueValue: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'Yes',
                            },
                            falseValue: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'No',
                            },
                            ALL: {
                                __type: 'string',
                                __required: false,
                                __defaultValue: 'All',
                            }
                        }
                    },
                    number: {
                        __type: 'object',
                        __required: false,
                        format: {
                            __type: 'string',
                            __required: false,
                            __defaultValue: '0.00',
                        }
                    },
                },
            },
            criterias: {
                __type: 'array',
                __required: false,
                __model: {

                    id: {
                        __type: 'string',
                        __required: true
                    },
                    name: {
                        __type: 'string',
                        __required: true
                    },
                    description: {
                        __type: 'string',
                        __required: true
                    },
                    type: {
                        __type: 'string',
                        __required: true,
                        __allowedValues: this.app.reporting.viewer.getCriteriaTypes()
                    },
                    parent: {
                        __type: 'string',
                        __required: false,
                    },
                    defaultValue: {
                        __type: 'mixed',
                        __required: false
                    },
                    isRequired: {
                        __type: 'boolean',
                        __required: true,
                        __defaultValue: false
                    },
                    options: {
                        __type: 'mixed',
                        __required: false,
                        source: {
                            __type: 'string',
                            __required: false,
                        },
                        field: {
                            __type: 'string',
                            __required: false,
                        },
                        url: {
                            __type: 'string',
                            __required: false,
                        }
                    },
                    parameters: {
                        __type: 'object',
                        __required: false,
                        locale: {
                            __type: 'object',
                            __required: false,
                            format: {
                                __type: 'string',
                                __required: false
                            },
                            separator: {
                                __type: 'string',
                                __required: false
                            }
                        },
                        alwaysShowCalendars: {
                            __type: 'boolean',
                            __required: false,
                            __defaultValue: true
                        },
                        multiple: {
                            __type: 'boolean',
                            __required: false,
                        },
                        allowClear: {
                            __type: 'boolean',
                            __required: false,
                            __defaultValue: true
                        },
                        placeholder: {
                            __type: 'string',
                            __required: false,
                        },
                        closeOnSelect: {
                            __type: 'boolean',
                            __required: false,
                        }
                    },
                    applyTo:
                    {
                        __type: 'array',
                        __required: true,
                        __model: {
                            section: {
                                __type: 'string',
                                __required: true
                            },
                            field: {
                                __type: 'string',
                                __required: true
                            }
                        }
                    }


                }
            },
            sections: {
                __type: 'array',
                __required: true,
            }
        };

    }

    /**
     * Validate report definition file
     * @param {*} reportDefinition 
     * @returns 
     */
    validate(reportDefinition) {
        this.reportDefinition = reportDefinition;

        this.validateJsonFormat(this.jsonXls);
        this.checkForAdditionalKeys(this.reportDefinition);

        return this.hasErrors;

    }

    /**
     * Validates json structure and required fields
     * @param {*} jsonXls 
     * @param {*} path 
     */
    validateJsonFormat(jsonXls, path) {

        if (path == undefined) {
            path = '';
        }

        for (let x in jsonXls) {
            if (x.startsWith('__')) {
                // Meta property
                continue;
            }
            //console.log(x);

            /**
             * Is required
             */
            if (jsonXls[x].__required) {
                if (!this.keyExists(this.buildPath(path, x))) {
                    this.logError('Required key is missing ' + this.buildPath(path, x));
                }
            }
            /**
             * Check key type
             */
            if (jsonXls[x].__type) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (jsonXls[x].__type != 'mixed') {
                        if (this.getType(this.getValue(this.buildPath(path, x))) !== jsonXls[x].__type) {
                            this.logError('Key type is invalid ' + this.buildPath(path, x) + ' expecting ' + jsonXls[x].__type + ' got ' + this.getType(this.getValue(this.buildPath(path, x))));
                        }
                    }
                }
            }

            if (jsonXls[x].__minValue != undefined) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (parseFloat(this.getValue(this.buildPath(path, x))) < parseFloat(jsonXls[x].__minValue)) {
                        this.logError('Key value is invalid ' + this.buildPath(path, x) + ' minimum value is  ' + parseFloat(jsonXls[x].__minValue) + ' got ' + parseFloat(this.getValue(this.buildPath(path, x))));
                    }
                }
            }

            if (jsonXls[x].__maxValue != undefined) {
                if (this.keyExists(this.buildPath(path, x))) {
                    if (parseFloat(this.getValue(this.buildPath(path, x))) > parseFloat(jsonXls[x].__maxValue)) {
                        this.logError('Key value is invalid ' + this.buildPath(path, x) + ' maximum value is  ' + parseFloat(jsonXls[x].__maxValue) + ' got ' + parseFloat(this.getValue(this.buildPath(path, x))));
                    }
                }
            }

            /**
             * Check allowed values
             */
            if (jsonXls[x].__allowedValues) {
                // Compare value with allowed values
                if (this.keyExists(this.buildPath(path, x))) {
                    if (this.getValueIndex(this.getValue(this.buildPath(path, x)), jsonXls[x].__allowedValues) === -1) {

                        if (jsonXls[x].__defaultValue != undefined) {
                            // Try to fix with default value                            
                            this.logWarning('Invalid value for key ' + this.buildPath(path, x) + ' ' + this.getValue(this.buildPath(path, x)) + ', using default value ' + jsonXls[x].__defaultValue);
                            this.setValue(this.buildPath(path, x), jsonXls[x].__defaultValue);
                        } else {
                            this.logError('Invalid value for key ' + this.buildPath(path, x) + ' ' + this.getValue(this.buildPath(path, x)));
                        }

                    }
                }
            }

            if (jsonXls[x].__type === 'array') {
                if (jsonXls[x].__model) {
                    // Check model for each item of array
                    let aItems = this.getValue(this.buildPath(path, x));
                    for (let i in aItems) {
                        this.validateJsonFormat(jsonXls[x].__model, this.buildPath(this.buildPath(path, x), i));
                    }
                }
            }


            if (this.getType(jsonXls[x]) === 'object') {
                this.validateJsonFormat(jsonXls[x], this.buildPath(path, x));
            }
        }

    }

    /**
     * Returns value index case insensitve
     * @param {*} v 
     * @param {*} a 
     * @returns 
     */
    getValueIndex(v, a) {
        return a.findIndex(item => v.toLowerCase() === item.toLowerCase());
    }

    /**
     * Checks report definition file and lists undocumented properties
     * @param {*} section 
     * @param {*} path 
     * @param {*} definition 
     * @param {*} parentPath 
     */
    checkForAdditionalKeys(section, path, definition, parentPath) {

        if (path == undefined) {
            path = '';
        }

        if (parentPath == undefined) {
            parentPath = '';
        }

        if (definition == undefined || definition == null) {
            definition = this.jsonXls;
        }

        //console.log('p=' + path + ', pp=' + parentPath);

        for (let x in section) {

            if (!this.keyExists(this.buildPath(path, x), definition)) {
                this.logWarning('Found Key ' + this.buildPath(parentPath, this.buildPath(path, x)) + ' that is not defined in report definition specification');
            }

            if (this.getType(section[x]) === 'array') {

                if (this.getValue(this.buildPath(path, x), definition) !== null && this.getValue(this.buildPath(path, x), definition).__model !== undefined) {
                    // Check model for each item of array
                    let aItems = this.getValue(this.buildPath(path, x));
                    let model = this.getValue(this.buildPath(path, x), definition).__model;
                    for (let i in aItems) {
                        this.checkForAdditionalKeys(aItems[i], '', model, this.buildPath(parentPath, this.buildPath(this.buildPath(path, x), i)));
                    }
                }
            }


            if (this.getType(section[x]) === 'object') {
                this.checkForAdditionalKeys(section[x], this.buildPath(path, x), definition, parentPath);
            }
        }
    }

    /**
     * Return type of object
     * @param {*} v 
     * @returns 
     */
    getType(v) {
        if (Array.isArray(v)) {
            return 'array';
        }
        return typeof v;
    }

    /**
     * Build dot path for array access
     * @param {*} path 
     * @param {*} key 
     * @returns 
     */
    buildPath(path, key) {
        if (path != '') {
            return path + '.' + key;
        }
        return key;
    }

    /**
     * Gets value using dot notation
     * @param {*} key 
     * @returns 
     */
    getValue(key, object) {

        if (object === undefined) {
            object = this.reportDefinition;
        }

        let root = object;
        let path = key.split('.');
        for (let x in path) {
            if (root[path[x]] !== undefined) {
                root = root[path[x]];
            } else {
                return null;
            }
        }
        return root;
    }

    /**
     * Sets value using dot notation
     * @param {*} key 
     * @param {*} value 
     */
    setValue(key, value, object) {

        if (object === undefined) {
            object = this.reportDefinition;
        }

        let way = key.split('.');
        let last = way.pop();

        way.reduce(function (o, k, i, kk) {
            return o[k] = o[k] || (isFinite(i + 1 in kk ? kk[i + 1] : last) ? [] : {});
        }, object)[last] = value;

    }



    /**
     * Checks if a key exists in object
     * @param {*} key 
     * @param {*} object 
     * @returns 
     */
    keyExists(key, object) {
        if (object === undefined) {
            object = this.reportDefinition;
        }

        let root = object;
        let path = key.split('.');
        for (let x in path) {
            if (root[path[x]] !== undefined) {
                root = root[path[x]];
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if value is empty
     * @param {*} value 
     * @returns 
     */
    isEmpty(value) {
        if (value === undefined) {
            return true;
        }
        if (value === null) {
            return true;
        }
        if (value == '') {
            return true;
        }

        return false;
    }

    /**
     * Checks f value is in options
     * @param {*} value 
     * @param {*} options 
     * @returns 
     */
    mustBeOneOf(value, options) {
        if (options.indexOf(value) === -1) {
            return false;
        }
        return true;
    }

    /**
     * Log warnings
     * @param {*} message 
     */
    logWarning(message) {
        this.hasWarning = true;
        console.warn(message);
        this.validationWarnings.push({
            message: message
        });
    }

    /**
     * Log errors
     * @param {*} message 
     */
    logError(message) {
        this.hasError = true;
        console.error(message);
        this.validationErrors.push({
            message: message
        });
    }

}
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
         * Save dialog instance
         */
        this.saveDialog = null;
        /**
         * Saved report UID
         */
        this.currentSavedReport = null;
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
         * 
         */
        this.toastInstance = null;
        /**
         * 
         */
        this.theme = null;

        this.loadingDialog = null;

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
            "locale": "en",
            "additionalCSS": "",
            "template": "Theme2",
            "toolbar": {
                "showSaveButton": true,
                "showLocaleButton": false,
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
                "excel": true
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
            "criterias": {
                "automatic": false
            },
            "coverPage": {
                "enabled": false
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
            "viewer": {
                "method": "html"
            },
            "printing": {
                "method": "pdf"
            },
            "modules": {
                "Google": {
                    "enabled": false,
                    "options": {
                        "ClientID": "",
                        "APIKey": "",
                        "AppID": ""
                    }
                }
            },
            "fonts": []
        };

        this.options = new Proxy(this.options, ProxyHandler);

    }

    getTheme() {

        if (this.theme === null) {

            if (window.__Metadocx.Themes[this.options.template] != undefined) {
                this.theme = new window.__Metadocx.Themes[this.options.template](this.app);
            } else {
                // Default theme
                this.theme = new Theme(this.app);
            }
        }

        return this.theme;

    }

    /**
     * Returns list of installed theme names
     * @returns array
     */
    getThemes() {
        return Object.keys(window.__Metadocx.Themes);
    }

    /**
     * Returns list of availble criteria type names
     * @returns array
     */
    getCriteriaTypes() {
        let aCriteriaType = [];
        for (let x in window.__Metadocx) {
            if (x.endsWith('Criteria')) {
                aCriteriaType.push(x);
            }
        }
        return aCriteriaType;
    }

    /**
     * Loads a report definition file
     */
    load(reportDefinitionUrl) {

        if (this.loadingDialog === null) {
            this.loadingDialog = bootbox.dialog({
                message: '<p class="text-center mb-0"><i class="uil uil-cog"></i> Generating report...</p>',
                closeButton: false
            });
        }

        /**
         * If we have a report definition file passed as parameter, load it and render
         */
        if (reportDefinitionUrl) {
            if (typeof reportDefinitionUrl === 'object') {
                this.log('Loading report definition object');
            } else {
                this.log('Loading report ' + reportDefinitionUrl);
            }
            /**
             * Create report object
             */
            if (this.report === null) {
                this.report = new Report(this.app);
            }
            this.report.app = this.app;

            window[this.options.id] = this.report;
            this.report.setId(this.options.id);

            this.report.onReportLoaded = () => {
                this.applyReportViewerOptions();
                if (this.options.viewer.method == 'PDF') {
                    this.app.modules.PDF.exportToImages(() => {
                        if (this.loadingDialog !== null) {
                            this.loadingDialog.modal('hide');
                        }
                    });
                } else {
                    if (this.loadingDialog !== null) {
                        /**
                         * @todo bug modal too quick
                         * https://github.com/twbs/bootstrap/issues/25008
                         */
                        setTimeout(() => { this.loadingDialog.modal('hide'); }, 500);
                    }
                }

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

        this.app.modules.Locale.setLocale(this.options.locale);


        $('#' + this.options.id + '_headerName').html(this.report.getReportDefinition().properties.name);
        $('#' + this.options.id + '_headerDescription').html(this.report.getReportDefinition().properties.description);

        $('.report-toolbar-button').show();

        if (this.options.toolbar.showSaveButton) {
            $('#' + this.options.id + '_file').show();
        } else {
            $('#' + this.options.id + '_file').hide();
        }

        if (this.options.toolbar.showLocaleButton) {
            $('#' + this.options.id + '_localeGroup').show();
        } else {
            $('#' + this.options.id + '_localeGroup').hide();
        }

        if (this.options.toolbar.showExportButton) {
            $('#' + this.options.id + '_export').show();
        } else {
            $('#' + this.options.id + '_export').hide();
        }

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

        if (this.options.toolbar.showCriteriasButton && this.criterias.length > 0) {
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

        if (this.options.modules.Google.enabled) {
            this.app.modules.Google.loadGoogleAPI();
        }

    }

    /**
     * Renders the report viewer
     */
    render() {
        this.log('Report viewer render');
        let s = '';

        s += this.renderMainLayout();
        s += this.renderReportCriterias();
        s += this.renderOptionsDialog();
        s += this.renderSaveDialog();
        s += this.renderReportSettings();
        s += this.renderFieldPropertiesDialog();

        if ($('#' + this.options.container).length == 0) {
            // Append container to body if not found
            $('body').prepend('<div id="' + this.options.container + '"></div>');
        }

        $('#' + this.options.container).html(s);
        $('.report-viewer-criterias').hide();

        this.updateUI();

        this.app.modules.Locale.translate();

    }

    /**
     * Displays info section when no report definition file is supplied
     */
    showNoReportAlert() {

        this.log('No report data, displaying no report warning');
        let s = `<div class="alert alert-warning mb-0 report-no-definition" role="alert">
                    <h4 class="alert-heading" data-locale="MissingReportDefinition">Missing report definition</h4>
                    <p data-locale="OupsNoReport">Oups! Something went wrong. We did not get a report to load.</p>                    
                </div>`;

        $('#' + this.app.reporting.viewer.options.id + '_canvas').html(s);
        $('.report-toolbar-button').hide();
    }

    /**
     * Renders main layout html of report viewer
     * @returns 
     */
    renderMainLayout() {

        this.log('Render main layout');
        let sCloseButtonClasses = '';
        if (window.opener == null) {
            // This window is not open by script can not use close button
            sCloseButtonClasses = ' hidden';
        }

        let sExportPDFClasses = '';
        if (!this.options.exportFormats.pdf) {
            sExportPDFClasses = ' hidden';
        }
        let sExportWordClasses = '';
        if (!this.options.exportFormats.word) {
            sExportWordClasses = ' hidden';
        }

        let sExportExcelClasses = '';
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
                         <button id="${this.options.id}_file" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-file"></i>
                         </button>
                         <div class="dropdown-menu">
                             <a id="${this.options.id}_open" class="dropdown-item" href="#" onClick="Metadocx.reporting.viewer.showSaveDialog('open');"><i class="uil uil-folder-open" style="font-size:16px;"></i> <span data-locale="Open">Open</span></a>
                             <a id="${this.options.id}_save" class="dropdown-item" href="#" onClick="Metadocx.reporting.viewer.showSaveDialog('save');"><i class="uil uil-save" style="font-size:16px;"></i> <span data-locale="Save">Save</span></a>
                             <a id="${this.options.id}_delete" class="dropdown-item" href="#" onClick="Metadocx.reporting.viewer.report.delete();"><i class="uil uil-trash" style="font-size:16px;"></i> <span data-locale="Delete">Delete</span></a>
                         </div>
                     </div>
                    <div id="${this.options.id}_localeGroup" class="btn-group me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_locale" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-english-to-chinese"></i>
                         </button>
                         <div id="${this.options.id}_localeOptions" class="dropdown-menu">
                             ${this.app.modules.Locale.getLocaleMenuOptions()}
                         </div>
                     </div>
                     <div class="btn-group me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_export" type="button" class="btn header-item dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="uil uil-file-export"></i>
                         </button>
                         <div class="dropdown-menu">
                             <a id="${this.options.id}_exportPdf" class="dropdown-item${sExportPDFClasses}" href="#" onClick="Metadocx.reporting.viewer.report.exportReport('PDF');" data-locale="PDF">PDF</a>
                             <a id="${this.options.id}_exportExcel" class="dropdown-item${sExportExcelClasses}" href="#" onClick="Metadocx.reporting.viewer.report.exportReport('Excel');" data-locale="Excel">Excel</a>
                             <a id="${this.options.id}_exportWord" class="dropdown-item${sExportWordClasses}" href="#" onClick="Metadocx.reporting.viewer.report.exportReport('Word');" data-locale="Word">Word</a>
                         </div>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_print" type="button" class="btn header-item" onClick="Metadocx.reporting.viewer.report.print();"><i class="uil uil-print"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_criterias" type="button" class="btn header-item" onClick="Metadocx.reporting.viewer.report.showReportCriterias();"><i class="uil uil-filter"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_settings" type="button" class="btn header-item" onClick="Metadocx.reporting.viewer.showReportSettings();"><i class="uil uil-file-graph"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button">
                         <button id="${this.options.id}_options" type="button" class="btn header-item" onClick="Metadocx.reporting.viewer.showReportOptions();"><i class="uil uil-cog"></i></button>
                     </div>
                     <div class="me-2 mb-2 mb-sm-0 report-toolbar-button${sCloseButtonClasses}">
                         <button id="${this.options.id}_close" type="button" class="btn header-item" onClick="Metadocx.reporting.viewer.report.close();"><i class="uil uil-times"></i></button>
                     </div>
                 </div>
             </div>
         </header>
         <div id="${this.options.id}_canvas" class="report-viewer-canvas">
         </div>
         <div id="${this.options.id}_pageViewer" class="report-viewer-canvas" style="display:none;">
         </div>
         <div id="${this.options.id}_reportDefinitionViewer" class="report-definition-code-viewer" style="display:none;">
            <pre id="${this.options.id}_reportDefinitionPre"></pre>
         </div>
         <div class="powered-by no-print"><span data-locale="PoweredBy">powered by</span> <a href="https://www.metadocx.com" target="_blank">Metadocx</a></div>
         <div class="toast-container position-fixed bottom-0 end-0 p-3">     
         <div id="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">                
                <strong class="me-auto">Metadocx</strong>
                <small></small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div id="toastBody" class="toast-body">
                Hello, world! This is a toast message.
            </div>
         </div>
        </div>`;

    }

    showReportDefinition() {

        $('#' + this.options.id + '_reportDefinitionPre').text(JSON.stringify(this.report.getReportDefinition(), null, 2));
        $('#' + this.options.id + '_reportDefinitionViewer').show();
        $('#' + this.options.id + '_canvas').hide();

    }


    hideReportDefinition() {
        $('#' + this.options.id + '_reportDefinitionViewer').hide();
        $('#' + this.options.id + '_canvas').show();
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
                                        <h4 class="mb-0" data-locale="Criterias">Criterias</h4>
                                        <div class="d-flex">
                                            <button class="btn btn-primary mr5" onClick="Metadocx.reporting.viewer.report.applyCriterias();"><i class="uil uil-check fs16" style="color:#fff;"></i>&nbsp;<span data-locale="ApplyCriterias">Apply criterias</span></button>
                                            <button class="btn btn-danger mr5" onClick="Metadocx.reporting.viewer.report.resetCriterias();" data-locale="Reset">Reset</button>
                                            <button class="btn btn-secondary" onClick="Metadocx.reporting.viewer.report.cancelCriterias();" data-locale="Cancel">Cancel</button>
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
                     <h5 class="modal-title" data-locale="Options">Options</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="d-flex justify-content-between">
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="Orientation">Orientation</label>
                             
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationPortrait">
                                     <label class="form-check-label" for="orientationPortrait" data-locale="Portrait">
                                         Portrait
                                     </label>
                                 </div>
                                 <div class="form-check">
                                     <input class="form-check-input" type="radio" name="orientation" id="orientationLandscape">
                                     <label class="form-check-label" for="orientationLandscape" data-locale="Landscape">
                                         Landscape
                                     </label>
                                 </div>
                             </div>
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="PaperSize">Paper size</label>
                                 <select id="paperSize" class="form-select">
                                 ${this.app.modules.Printing.getPaperSizeOptions()}
                                 </select>
                             </div>
                             <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="coverPage">
                                <label class="form-check-label" for="coverPage" data-locale="CoverPage">
                                    Cover Page
                                </label>
                             </div>
                             <div class="mb-3">                                
                                 <label for="reportTheme" class="form-label font-weight-bold" data-locale="ReportTheme">Report Theme</label>
                                 <select id="reportTheme" class="form-select">
                                 ${this.app.modules.Printing.getThemeOptions()}
                                 </select>
                             </div>
                         </div>
                         <div class="d-flex flex-column p-2">
                             <div class="mb-3">                                
                                 <label for="paperSize" class="form-label font-weight-bold" data-locale="Margins">Margins</label>
                             
                                 <div class="mb-3 row">
                                     <label for="topMargin" class="col-sm-4 col-form-label" data-locale="Top">Top</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="topMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="bottomMargin" class="col-sm-4 col-form-label" data-locale="Bottom">Bottom</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="bottomMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="leftMargin" class="col-sm-4 col-form-label" data-locale="Left">Left</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="leftMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>
                                 <div class="mb-3 row">
                                     <label for="rightMargin" class="col-sm-4 col-form-label" data-locale="Right">Right</label>
                                     <div class="col-sm-6">
                                         <input type="number" class="form-control" id="rightMargin" value="0" style="width:80px;margin-left:30px;">
                                     </div>
                                     <label class="col-sm-2 col-form-label" data-locale="Inches">in.</label>
                                 </div>                                                    
                             </div>
                         </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal" data-locale="Cancel">Cancel</button>
                     <button type="button" class="btn btn-primary" onClick="Metadocx.reporting.viewer.applyOptions();"><i class="fa-solid fa-check"></i>&nbsp;<span data-locale="ApplyOptions">Apply Options</span></button>
                 </div>
                 </div>
             </div>
             </div>`;

    }


    /**
     * Render report save dialoag html
     * @returns 
     */
    renderSaveDialog() {

        /**
         * Options dialog
         */
        this.log('Render report options dialog');

        let showGoogleDriveButton = 'display:none;';
        if (this.options.modules.Google.enabled) {
            showGoogleDriveButton = '';
        }

        return `<div id="${this.options.id}_saveDialog" class="modal" tabindex="-1">
               <div class="modal-dialog">
                 <div class="modal-content">
                 <div class="modal-header">
                     <h5 id="saveDialogTitle" class="modal-title" data-locale="SavedReport">Saved report</h5>
                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                 </div>
                 <div class="modal-body">
                     <div class="row">
                        <div class="col-6 colSaveType mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="saveOption" id="newOption">
                                <label class="form-check-label" for="newOption" data-locale="New">
                                    New
                                </label>
                            </div>
                        </div>
                        <div class="col-6 colSaveType mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="saveOption" id="saveAsOption">
                                <label class="form-check-label" for="saveAsOption" data-locale="SaveAs">
                                    Save As...
                                </label>
                            </div>
                        </div>
                        <div class="col-12 saveOptionRow newOption">
                            <div class="mb-3">
                                <label for="saveReportName" class="col-form-label" data-locale="Name">Name</label>                                
                                <input type="text" class="form-control" id="saveReportName" value=""/>                                
                            </div>
                        </div>

                        <div class="col-12 saveOptionRow saveAsOption">
                            <div class="mb-3">
                                <label for="savedReports" class="col-form-label" data-locale="SelectReport">Select Report</label>
                                <select id="savedReports" class="form-select">                            
                                </select>
                            </div>
                        </div>
                     </div>
                 </div>
                 <div class="modal-footer">
                     <button id="openGoogleDrive" type="button" class="btn btn-light me-auto" data-bs-dismiss="modal" style="${showGoogleDriveButton}" onclick="Metadocx.modules.Google.showGoogleDocPicker()"><i class="fa-solid fa-folder"></i>&nbsp;<span data-locale="GoogleDrive">Google Drive</span></button>
                     <button type="button" class="btn btn-secondary mr5" data-bs-dismiss="modal" data-locale="Cancel">Cancel</button>
                     <button id="saveDialogSaveButton" type="button" class="btn btn-primary"><i class="fa-solid fa-check"></i>&nbsp;<span data-locale="Save">Save</span></button>
                 </div>
                 </div>
             </div>
             </div>`;

    }

    showSaveDialog(mode) {

        if (mode == undefined) {
            mode = 'save';
        }

        if (this.saveDialog === null) {
            this.saveDialog = new bootstrap.Modal('#' + this.options.id + '_saveDialog', {})
        }

        /**
         * Display new and save as depending on open report
         */
        $('.saveOptionRow').hide();
        $('input[name="saveOption"]').prop('checked', false);
        if (this.currentSavedReport === null) {
            $('#newOption').prop('checked', true);
            $('.newOption').show();
        } else {
            $('#saveAsOption').prop('checked', true);
            $('.saveAsOption').show();
        }

        /**
         * Toggle new and save as fields
         */
        $('input[name="saveOption"]').off('click').on('click', () => {
            $('.saveOptionRow').hide();
            if ($('#newOption').prop('checked')) {
                $('.newOption').show();
            } else if ($('#saveAsOption').prop('checked')) {
                $('.saveAsOption').show();
            }
        });

        if (mode == 'open') {
            /**
             * Open report mode
             */
            $('.newOption').hide();
            $('.saveAsOption').show();
            $('.colSaveType').hide();
            $('#saveDialogTitle').html(this.app.modules.Locale.getKey('OpenReport'));
            $('#saveDialogSaveButton').attr('data-locale', 'Open');
            $('#saveDialogSaveButton').html(this.app.modules.Locale.getKey('Open'));
            $('#saveDialogSaveButton').off('click').on('click', () => { Metadocx.reporting.viewer.report.open(); });
        } else {
            /**
             * Save report mode
             */
            $('#saveDialogTitle').html(this.app.modules.Locale.getKey('SavedReports'));
            $('#saveDialogSaveButton').attr('data-locale', 'Save');
            $('#saveDialogSaveButton').html(this.app.modules.Locale.getKey('Save'));
            $('#saveDialogSaveButton').off('click').on('click', () => { Metadocx.reporting.viewer.report.save(); });
        }

        /**
         * Load saved reports in select
         */
        this.app.modules.DB.querySavedReports(this.report.getReportDefinition().id, (data) => {

            let s = '';
            for (let x in data) {
                s += '<option value="' + data[x].reportUID + '">' + data[x].name + '</option>';
            }
            $('#savedReports').find('option').remove();
            $('#savedReports').append(s);

            if (mode == 'save') {
                /**
                 * In save mode if no data, hide save as
                 */
                if (data.length == 0) {
                    $('.colSaveType').hide();
                } else {
                    $('.colSaveType').show();
                }
            }

        })

        this.saveDialog.show();
        if (this.currentSavedReport === null) {
            $('#saveReportName').focus();
        }

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
                                <label for="fieldSectionID" class="col-form-label" data-locale="SectionID">Section ID</label>                            
                                <input type="text" class="form-control" id="fieldSectionID" readonly value=""/>
                            </div>
                            <div class="mb-3" style="display:none;">
                                <label for="fieldName" class="col-form-label" data-locale="Name">Name</label>                            
                                <input type="text" class="form-control" id="fieldName" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldLabel" class="col-form-label" data-locale="Label">Label</label>                            
                                <input type="text" class="form-control" id="fieldLabel" value=""/>                            
                            </div>
                            <div class="mb-3">
                                <label for="fieldWidth" class="col-form-label" data-locale="Width">Width (px)</label>                            
                                <input type="number" class="form-control" id="fieldWidth" value=""/>                            
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="fieldVisible">
                                <label class="form-check-label" for="fieldVisible" data-locale="IsVisible">
                                    Is Visible
                                </label>
                            </div>
                        
                        </div>
                        <div class="col-6">
                            
                            <div class="mb-3" style="display:none;">
                                <label for="fieldType" class="col-form-label" data-locale="Type">Type</label>                            
                                <input type="text" class="form-control" id="fieldType" readonly value=""/>
                            </div>
                            <div class="mb-3">
                                <label for="fieldAlign" class="col-form-label" data-locale="Alignment">Alignment</label>                            
                                <select id="fieldAlign" class="form-control">
                                    <option value="left" data-locale="Left">Left</option>
                                    <option value="right" data-locale="Right">Right</option>
                                    <option value="center" data-locale="Center">Center</option>
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
                     <button type="button" class="btn btn-primary" onClick="Metadocx.reporting.viewer.applyFieldProperties();"><i class="fa-solid fa-check"></i>&nbsp;Apply Properties</button>
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
                        <h5 id="${this.options.id}_settingsOffCanvasLabel" class="offcanvas-title" data-locale="ReportSettings">Report Settings</h5>
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

        let sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        let field = oReportSection.getColumn(fieldName);

        $('#fieldSectionID').val(sectionID);
        $('#fieldName').val(field.name);
        $('#fieldType').val(field.type);
        $('#fieldLabel').val(field.label);

        let bIsVisible = true;
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

    /**
     * Applies fields properties to report
     */
    applyFieldProperties() {

        let sectionID = $('#fieldSectionID').val();
        let fieldName = $('#fieldName').val();

        let sReportSectionType = this.report.getReportSection(sectionID).type + 'ReportSection';
        let oReportSection = new window.__Metadocx[sReportSectionType](this.app, this.report.getReportSection(sectionID));

        let field = oReportSection.getColumn(fieldName);

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

        let values = {};
        if (this.criterias) {
            for (let x in this.criterias) {
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
     * Sets criterias values and enabled
     * @param {*} criteriaValues 
     */
    setCriteriaValues(criteriaValues) {
        for (let x in criteriaValues) {
            this.getCriteria(x).setIsEnabled(criteriaValues[x].enabled);
            this.getCriteria(x).setValue(criteriaValues[x].value);
        }
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
            for (let x in this.criterias) {
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

        $('#coverPage').prop('checked', this.app.modules.DataType.toBool(this.options.coverPage.enabled));
        if (this.options.template) {
            $('#reportTheme').val(this.options.template);
        } else {
            $('#reportTheme').val('');
        }


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


        this.options.coverPage.enabled = $('#coverPage').prop('checked');
        this.options.template = $('#reportTheme').val();

        this.optionsDialog.hide();

        this._bDisableApplyReportViewerOptions = false;
        this.applyReportViewerOptions();
        this.refreshReport();

    }


    /**
     * Refresh report view (reload the report)
     */
    refreshReport() {

        this.report.addLoadEvent('ReportViewer_refreshReport');
        this.theme = null;
        this.report.renderReportCriterias();
        this.report.renderReportSettings();
        this.report.filter();
        this.report.sort();

        let oReportCanvas = new ReportCanvas(this.app, this.report);
        $('#' + this.options.id + '_canvas').html(oReportCanvas.render());

        oReportCanvas.initialiseJS();

        this.updateCSS();
        this.scaleReportSections();

        if (!this.report.isLoaded) {
            this.report.isLoaded = true;
            this.report.copyOriginalSettings();
        }
        this.report.setLoadEventCompleted('ReportViewer_refreshReport');

    }

    /**
     * Refresh report viewer UI state
     */
    updateUI() {
        if (this.currentSavedReport === null) {
            $('#' + this.options.id + '_delete').hide();
        } else {
            $('#' + this.options.id + '_delete').show();
        }
    }

    /**
     * Update reportPage style tag with print media css
     */
    updateCSS() {

        let paperSize = this.app.modules.Printing.getPaperSize(this.app.reporting.viewer.options.page.paperSize);
        let pageOrientation = this.app.reporting.viewer.options.page.orientation;

        let width = 0;
        let height = 0;

        if (pageOrientation == this.app.modules.Printing.PageOrientation.Landscape) {
            width = paperSize.height;
            height = paperSize.width;
        } else {
            width = paperSize.width;
            height = paperSize.height;
        }

        let s = `
               
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

            .page-break {
                page-break-before: always;
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
                let ratio = $('#reportPage').width() / $(this).width();
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

    /**
     * Refresh report settings ui
     */
    refreshReportSettings() {

        for (let kSection in this.report.getReportDefinition().sections) {
            let oSection = this.report.getReportDefinition().sections[kSection];

            for (let y in oSection.model) {
                let field = oSection.model[y];
                let bIsVisible = true;
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
            this.settingsOffCanvas = new bootstrap.Offcanvas($('#' + this.app.reporting.viewer.options.id + '_settingsOffCanvas')[0], {})
        }
        this.settingsOffCanvas.hide();

        // Update report properties name and description
        this.report.getReportDefinition().properties.name = $('#reportSettingsName').val();
        this.report.getReportDefinition().properties.description = $('#reportSettingsDescription').val();

        // Update report sections 
        for (let x in this.report.getReportDefinition().sections) {
            let oSection = this.report.getReportDefinition().sections[x];

            /**
             * Apply field settings
             */
            for (let f in oSection.model) {
                let oCol = oSection.model[f];
                oCol.visible = $('#' + oSection.id + '_field_' + oCol.name).prop('checked');
                oCol['formula'] = $('#' + oSection.id + '_formula_' + oCol.name).val();
            }

            /**
             * Reorder model columns
             */
            $('#' + oSection.id + '_fields tbody tr').each(function () {
                let columnName = $(this).attr('data-column');
                oSection.model.forEach(function (item, i) {
                    if (item.name == columnName) {
                        oSection.model.splice(i, 1);
                        oSection.model.unshift(item);
                    }
                });
            });

            if (Array.isArray(oSection.model)) {
                oSection.model.reverse();
            }

            /**
             * Apply order by settings
             */

            oSection.orderBy = [];
            $('#' + oSection.id + '_orderBy tbody tr').each(function () {
                let columnName = $(this).attr('data-column');

                if ($('#' + oSection.id + '_orderBy_' + columnName).prop('checked')) {
                    oSection.orderBy.push({
                        "name": columnName,
                        "order": $('#' + oSection.id + '_orderByOrder_' + columnName).val()
                    });
                }

            });

            oSection.groupBy = [];
            $('#' + oSection.id + '_groupBy tbody tr').each(function () {
                let columnName = $(this).attr('data-column');

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
        $('#' + this.report.id + '_header').hide();
        $('#' + this.report.id + '_canvas').css('margin-top', '0px');
        $('#' + this.report.id + '_canvas').css('height', '100vh');
    }

    /**
     * Show main toolbar in report viewer
     */
    showToolbar() {
        $('#' + this.report.id + '_header').show();
        $('#' + this.report.id + '_canvas').css('margin-top', '70px');
        $('#' + this.report.id + '_canvas').css('height', 'calc(100vh - 70px)');
    }


    /**
     * Returns container element selector
     * @returns 
     */
    getContainerSelector() {
        return '#' + this.options.id;
    }

    /**
     * Displays a toast message in bottom right corner
     * @param {*} message 
     */
    showToastMessage(message) {
        if (this.toastInstance === null) {
            this.toastInstance = new bootstrap.Toast(document.getElementById('toast'), {});
        }
        $('#toastBody').html(message);

        this.toastInstance.show();
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
        super.initializeJS();

        $('#' + this.id + '_yes,#' + this.id + '_no').on('click', function () {

            let criteriaId = $(this).attr('criteria');
            if ($('#' + criteriaId + '_yes').prop('checked') || $('#' + criteriaId + '_no').prop('checked')) {
                $('#criteriaEnabled_' + criteriaId).prop('checked', true);
            } else {
                $('#criteriaEnabled_' + criteriaId).prop('checked', false);
            }

        });

    }

    render() {

        return `<div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${this.id}_yes" criteria="${this.id}">
                    <label class="form-check-label" for="${this.id}_yes" data-locale="Yes">
                        Yes
                    </label>
                </div>
                <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${this.id}_no" criteria="${this.id}">
                    <label class="form-check-label" for="${this.id}_no" data-locale="No">
                        No
                    </label>
                </div>`;

    }

    getValue() {
        let bYes = $('#' + this.id + '_yes').prop('checked');
        let bNo = $('#' + this.id + '_no').prop('checked');

        if ((bYes && bNo) || (!bYes && !bNo)) {
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

    initializeJS() {
        return null;
    }

    /**
     * Render criteria HTML
     * @returns 
     */
    render() {

        let sCheckboxes = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (let x in this.reportCriteria.options) {
                sCheckboxes += `<div class="col-3 form-check mb-2">
                                    <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${this.reportCriteria.options[x].id}" value="${this.reportCriteria.options[x].id}">
                                    <label class="form-check-label" for="chk${this.id}_${this.reportCriteria.options[x].id}">
                                        ${this.reportCriteria.options[x].text}
                                    </label>
                                </div>`;

            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sCheckboxes = this.buildCheckboxesFromReportData(this.reportCriteria.options.field);
            } else if (this.reportCriteria.options.source == 'ajax') {
                sCheckboxes = '<div id="__tempHolder' + this.id + '"></div>';
                this.getCheckboxOptionsFromAjax(this.reportCriteria.options.url);
            }

        }

        return `<div class="row">${sCheckboxes}</div>`;

    }

    /**
     * Calls page for list of options
     * @param {*} url 
     */
    getCheckboxOptionsFromAjax(url) {

        $.get(url, (data, status) => {

            this.buildCheckboxesFromAjaxData(data);

        });

    }

    /**
     * Builds checkboxes from ajax response
     * @param {*} response 
     */
    buildCheckboxesFromAjaxData(response) {

        let sCheckboxes = '';
        let data = response.results;
        for (let x in data) {
            sCheckboxes += `<div class="col-3 form-check mb-2">
                                <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${data[x].id}" value="${data[x].id}">
                                <label class="form-check-label" for="chk${this.id}_${data[x].id}">
                                    ${data[x].text}
                                </label>
                            </div>`;

        }
        $('#__tempHolder' + this.id).replaceWith(sCheckboxes);

    }

    /**
     * Loads checkboxes from report data
     * @param {*} field 
     * @returns 
     */
    buildCheckboxesFromReportData(field) {
        let sCheckboxes = '';
        let aOptions = [];
        let aReportSections = this.app.reporting.viewer.report.getReportSections();
        for (let s in aReportSections) {
            for (let x in aReportSections[s].data) {
                let row = aReportSections[s].data[x];
                if (aOptions.indexOf(row[field]) === -1) {
                    aOptions.push(row[field]);
                }
            }
        }

        aOptions.sort();

        let nIndex = 0;
        for (let x in aOptions) {
            sCheckboxes += `<div class="col-3 form-check mb-2">
                                    <input class="form-check-input report-checkbox-criteria" data-criteria-id="${this.id}"  type="checkbox" id="chk${this.id}_${nIndex}" value="${aOptions[x]}">
                                    <label class="form-check-label" for="chk${this.id}_${nIndex}">
                                        ${aOptions[x]}
                                    </label>
                                </div>`;
            nIndex++;
        }

        return sCheckboxes;

    }

    /**
     * Returns criteria select value(s)
     * @returns array
     */
    getValue() {

        let values = [];
        $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"]').each(function () {
            if ($(this).prop('checked')) {
                values.push($(this).val());
            }
        });

        return values;
    }

    /**
     * Sets value for criteria
     * @param {*} v 
     */
    setValue(v) {
        $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"]').prop('checked', false);
        if (Array.isArray(v)) {
            for (let x in v) {
                $('.report-checkbox-criteria[data-criteria-id="' + this.id + '"][value="' + v[x] + '"]').prop('checked', true);
            }
        }
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

    /**
     * Gets value for criteria
     * @returns 
     */
    getValue() {
        return {
            startDate: this._instance.data('daterangepicker').startDate.format('YYYY-MM-DD'),
            endDate: this._instance.data('daterangepicker').endDate.format('YYYY-MM-DD'),
            selectedRange: this._instance.data('daterangepicker').chosenLabel,
        };
    }

    /**
     * Sets value for criteria
     * @param {*} v 
     */
    setValue(v) {
        this._instance.data('daterangepicker').setStartDate(v.startDate);
        this._instance.data('daterangepicker').setEndDate(v.endDate);
        if (v.chosenLabel) {
            // Apply label after start and end date
            this._instance.data('daterangepicker').clickRange({ target: $('[data-range-key="' + v.chosenLabel + '"]').get(0) });
        }
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
        this._startValueInstance = null;
        this._endValueInstance = null;
        this._operatorInstance = null;
    }

    initializeJS() {

        this._startValueInstance = $('#' + this.id + '_start');
        this._endValueInstance = $('#' + this.id + '_end');
        this._operatorInstance = $('#' + this.id + '_operator');

        this._operatorInstance.on('change', () => {
            this.updateUI();
        });

        this.updateUI();

    }

    updateUI() {
        switch (this._operatorInstance.val()) {
            case 'EQUAL':
            case 'NOT_EQUAL':
            case 'GREATER_THAN':
            case 'GREATER_OR_EQUAL':
            case 'SMALLER_THAN':
            case 'SMALLER_OR_EQUAL':
                $('#' + this.id + '_betweenLabel').hide();
                this._endValueInstance.hide();
                break;
            case 'BETWEEN':
                $('#' + this.id + '_betweenLabel').show();
                this._endValueInstance.show();
                break;

        }
    }

    render() {


        return `
            <div class="mb-3">
                <label class="form-label" for="${this.id}_start">
                    ${this.reportCriteria.name}
                </label> 
                <div class="input-group mb-3">               
                    <span class="input-group-text">
                        <select id="${this.id}_operator" class="form-control form-control-sm">
                            <option value="EQUAL" data-locale="Equal">Equal</option>
                            <option value="NOT_EQUAL" data-locale="NotEqual">Not equal</option>
                            <option value="GREATER_THAN" data-locale="GreaterThan">Greater than</option>
                            <option value="GREATER_OR_EQUAL" data-locale="GreaterOrEqual">Greater or equal</option>
                            <option value="SMALLER_THAN" data-locale="SmallerThan">Smaller than</option>
                            <option value="SMALLER_OR_EQUAL" data-locale="SmallerOrEqual">Smaller or equal</option>
                            <option value="BETWEEN" data-locale="Between">Between</option>
                        </select>
                    </span>
                    <input id="${this.id}_start" class="form-control" type="number"/>
                    <span id="${this.id}_betweenLabel" class="input-group-text" data-locale="And">and</span>
                    <input id="${this.id}_end" class="form-control" type="number"/>                    
                </div>
            </div>`;

    }

    /**
     * Get criteria value
     * @returns 
     */
    getValue() {
        return {
            operator: this._operatorInstance.val(),
            startValue: parseFloat(this._startValueInstance.val()),
            endValue: parseFloat(this._endValueInstance.val())
        };
    }

    /**
     * Set criteria value
     * @param {*} v 
     */
    setValue(v) {
        this._operatorInstance.val(v.operator);
        this._startValueInstance.val(v.startValue);
        this._endValueInstance.val(v.endValue);
        this.updateUI();
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

        super.initializeJS();

        var thisObject = this;

        if (!Array.isArray(this.reportCriteria.options)) {
            if (this.reportCriteria.options.source = 'ajax' && this.reportCriteria.options.url) {
                this.reportCriteria.parameters.ajax = {
                    url: this.reportCriteria.options.url,
                    dataType: 'json',
                    data: function (params) {
                        var data = {};
                        for (var x in params) {
                            data[x] = params[x];
                        }
                        data['locale'] = thisObject.app.modules.Locale.getCurrentLocale();
                        if (thisObject.getParentCriteria() != null) {

                            data['parent'] = thisObject.getParentCriteria().getValue().map(function (row) {
                                return {
                                    id: row.id,
                                    text: row.text
                                }
                            }
                            );
                        }

                        return data;
                    }

                };
            }
        }

        this._instance = $('#' + this.id).select2(this.reportCriteria.parameters);
        this._instance.on('change', function () {
            if (thisObject.resetChildCriteriaOnChange) {
                for (var x in thisObject.getChildCriterias()) {
                    // Reset child criterias
                    thisObject.getChildCriterias()[x].setValue(null);
                }
            }

            if (thisObject.getValue().length > 0) {
                $('#criteriaEnabled_' + thisObject.id).prop('checked', true);
            } else {
                $('#criteriaEnabled_' + thisObject.id).prop('checked', false);
            }


        });
        $('#' + this.id).val(null).trigger("change");
    }

    render() {

        let sOptionTags = '';

        if (Array.isArray(this.reportCriteria.options)) {

            for (let x in this.reportCriteria.options) {
                sOptionTags += `<option value="${this.reportCriteria.options[x].id}">${this.reportCriteria.options[x].text}</option>`;
            }

        } else {

            if (this.reportCriteria.options.source == 'data') {
                /**
                 * Use existing data to create options
                 */
                sOptionTags = this.buildOptionTagsFromReportData(this.reportCriteria.options.field);
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

    setValue(v) {
        $('#' + this.id).val(v).trigger('change');
    }

    buildOptionTagsFromReportData(field) {
        let sOptionTags = '';
        let aOptions = [];
        let aReportSections = this.app.reporting.viewer.report.getReportSections();
        for (let s in aReportSections) {
            for (let x in aReportSections[s].data) {
                let row = aReportSections[s].data[x];
                if (aOptions.indexOf(row[field]) === -1) {
                    aOptions.push(row[field]);
                }
            }
        }

        aOptions.sort();

        for (let x in aOptions) {
            sOptionTags += `<option value="${aOptions[x]}">${aOptions[x]}</option>`;
        }

        return sOptionTags;

    }



}
window.__Metadocx.SelectCriteria = SelectCriteria;
/** 
 * TextCriteria
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class TextCriteria extends CriteriaControl {

    constructor(app) {
        super(app);
        this.options = [];
    }

    initializeJS() {
        super.initializeJS();

        $('#' + this.id + '').on('change', function () {
            if ($(this).val() != '') {
                // Make sure criteria is enabled
                $('#criteriaEnabled_' + $(this).attr('id')).prop('checked', true);
            }
        });

    }

    render() {

        return `
            <div class="mb-3">
                <label class="form-label" for="${this.id}">
                    ${this.reportCriteria.name}
                </label>                
                <input id="${this.id}" class="form-control" type="text"/>                               
            </div>`;
    }

    getValue() {
        return $('#' + this.id + '').val();
    }

    setValue(v) {

        $('#' + this.id + '').val(v);

    }



}
window.__Metadocx.TextCriteria = TextCriteria;
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
        let aArguments = [];
        let sMessage = null;
        let nFirstArg = 0;
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

        for (let i = nFirstArg; i < args.length; i++) {
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
        window.open('https://developer.mozilla.org/en-US/docs/Web/API/console', 'ConsoleHelp', 'noopener');
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
    toBool(v, defaultValue) {

        if (typeof defaultValue === 'undefined') {
            defaultValue = false;
        }

        if (typeof v === 'undefined') {
            v = defaultValue;
        }

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

        for (let x in from) {
            if (typeof from[x] === 'object') {
                this.copyObjectProperties(from[x], to[x]);
            } else {
                to[x] = from[x];
            }
        }

    }

    /**
     * Return unique ID
     * @returns 
     */
    uid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

}
window.__Metadocx.DataTypeModule = DataTypeModule;
/**
 * DB module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class DBModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.connection = null;
    }

    /**
     * Initialize module
     */
    initialize() {
        super.initialize();

        this.log('Openning local database');
        const request = window.indexedDB.open('Metadocx', 1);

        request.onerror = (event) => {
            this.error('Error in opening Metadocx database');
        };

        request.onsuccess = (event) => {
            this.log('Local database open success');
            this.connection = event.target.result;
        };

        request.onupgradeneeded = (event) => {
            // Save the IDBDatabase interface
            this.log('Local database upgrade required');
            this.connection = event.target.result;

            // Create an objectStore for this database
            const savedReports = this.connection.createObjectStore('SavedReports', { keyPath: 'reportUID' });
            savedReports.createIndex('reportId', 'reportId', { unique: false });

        };

    }

    /**
     * Save report in local db
     * @param {*} savedReport 
     * @param {*} callback 
     */
    saveReport(savedReport, callback) {

        this.log('Saving report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.add(savedReport);

        request.onsuccess = (event) => {
            this.log('Transaction success, report saved');
            if (callback) {
                callback();
            }
        };

    }

    /**
     * Updates an existing report
     * @param {*} savedReport 
     * @param {*} callback 
     */
    updateReport(savedReport, callback) {

        this.log('Updating report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.put(savedReport);

        request.onsuccess = (event) => {
            this.log('Transaction success, report updated');
            if (callback) {
                callback(savedReport);
            }
        };

    }

    /**
     * Returns a specific report using report UID
     * @param {*} reportUID 
     * @param {*} callback 
     */
    getReport(reportUID, callback) {

        this.log('Loading report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.get(reportUID);

        request.onsuccess = (event) => {
            this.log('Transaction success, report loaded');
            if (callback) {
                callback(event.target.result);
            }
        };

    }

    /**
     * List saved reports filtered by reportId
     * @param {*} reportId 
     * @param {*} callback 
     */
    querySavedReports(reportId, callback) {

        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const index = savedReports.index('reportId');
        const singleKeyRange = IDBKeyRange.only(reportId);

        this.log('Loading saved reports for ' + reportId);

        let data = [];
        index.openCursor(singleKeyRange).onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                data.push(cursor.value);
                cursor.continue();
            } else {
                // Done loading data
                if (callback) {
                    callback(data);
                }
            }
        };

    }


    /**
     * Updates an existing report
     * @param {*} savedReport 
     * @param {*} callback 
     */
    deleteReport(reportUID, callback) {

        this.log('Deleting report');
        const transaction = this.connection.transaction(['SavedReports'], 'readwrite');
        const savedReports = transaction.objectStore('SavedReports');
        const request = savedReports.delete(reportUID);

        request.onsuccess = (event) => {
            this.log('Transaction success, report deleted');
            if (callback) {
                callback(reportUID);
            }
        };

    }

}
window.__Metadocx.DBModule = DBModule;
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

        return this.exportExcel();

    }


    renderExportDialog() {

        return `<div id="${this.app.reporting.viewer.options.id}_excelExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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

            let paperSize = this.app.modules.Printing.getPaperSize($('#excelPaperSize').val());
            $('#excelPaperSizeWidth').val(paperSize.width);
            $('#excelPaperSizeHeight').val(paperSize.height);
        });

    }


    getExcelExportOptions() {

        return {};

    }

    exportExcel() {

        /**
         *  Get all graphs images and encode them in base64 to insert in excel
         */
        let thisObject = this;

        /**
         * Show exporting dialog
         */
        let exportDialog = bootbox.dialog({
            title: 'Export to Excel',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to Excel...</p>'
        });


        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/Excel',
            data: {
                ExportOptions: this.getExcelExportOptions(),
                ReportDefinition: JSON.parse(JSON.stringify(this.app.reporting.viewer.report.getReportDefinition())),
                Graphs: [],
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                let blob = new Blob([data]);

                let sContent = `Report has been converted to Excel, click on button to download file<br><br>
                <a class="btn btn-primary" href="${window.URL.createObjectURL(blob)}" download="Report.xlsx" onClick="$('.bootbox.modal').modal('hide');">Download report</a>`;

                exportDialog.find('.bootbox-body').html(sContent);

                thisObject.app.modules.Printing.applyPageStyles();

                $('.report-graph-canvas').show();
                $('.report-graph-image').hide();


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

        let displayValue = '';

        switch (dataType) {
            case 'number':
                if (format === undefined) {
                    format = this.app.reporting.viewer.options.formats.number.format;
                }
                displayValue = numeral(value).format(format);
                break;
            case 'boolean':
                if (value === 'ALL') {
                    if (this.app.reporting.viewer.options.formats.boolean.format.ALL !== undefined) {
                        displayValue = this.app.reporting.viewer.options.formats.boolean.format.ALL;
                    } else {
                        // default value if not options is available
                        displayValue = 'All';
                    }

                } else if (value) {

                    if (this.app.reporting.viewer.options.formats.boolean.format.trueValue !== undefined) {
                        displayValue = this.app.reporting.viewer.options.formats.boolean.format.trueValue;
                    } else {
                        // default value if not options is available
                        displayValue = 'Yes';
                    }


                } else {

                    if (this.app.reporting.viewer.options.formats.boolean.format.falseValue !== undefined) {
                        displayValue = this.app.reporting.viewer.options.formats.boolean.format.falseValue;
                    } else {
                        // default value if not options is available
                        displayValue = 'No';
                    }

                }
                break;
            case 'date':
                if (format === undefined) {
                    format = this.app.reporting.viewer.options.formats.date.format;
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
 * Google module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class GoogleModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 500;
        this._isGoogleAPILoaded = false;

        /**
         * Google API settings
         */

        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.     
        //this.SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets.readonly';
        this.SCOPES = [
            //'https://www.googleapis.com/auth/drive',
            //'https://www.googleapis.com/auth/drive.file',
            //'https://www.googleapis.com/auth/drive.readonly',
            //'https://www.googleapis.com/auth/spreadsheets',
            //'https://www.googleapis.com/auth/spreadsheets.readonly',            
            'https://www.googleapis.com/auth/drive.metadata.readonly',
        ];
        // Set to Client ID and API key from the Developer Console
        this.CLIENT_ID = '<YOUR CLIENT ID>';
        this.API_KEY = '<YOUR API KEY>';
        this.DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
        this.APP_ID = '<YOUR APP ID>';

        this.tokenClient = null;
        this.accessToken = null;

        this._googleAPILoaded = false;
        this._googleClientLoaded = false;

    }

    initialize() {
        super.initialize();
    }

    loadGoogleAPI() {

        if (this._isGoogleAPILoaded) {
            this.log('~Google API already loaded');
            return;
        }
        this.log('Injecting google api script tags');
        this._isGoogleAPILoaded = true;

        this.app.modules.Import.injectLibrary('GoogleAPI');
    }

    /**
     * Called when google api script tag is loaded
     */
    gApiLoaded() {
        this.log('Google API script loaded');
        this._googleAPILoaded = true;
        this.checkIfGoogleAPIIsLoaded();
        this.loadPickerAPI();
    }

    /**
     * Called when google client script tag is loaded
     */
    gClientLoaded() {
        this.log('Google Client script loaded');
        this._googleClientLoaded = true;
        this.checkIfGoogleAPIIsLoaded();

    }

    checkIfGoogleAPIIsLoaded() {
        if (this._googleAPILoaded && this._googleClientLoaded) {
            this.log('Google API is loaded');
            this.onGoogleAPILoaded();
            return true;
        }
        this.log('Google API is NOT loaded');
        return false;
    }

    onGoogleAPILoaded() {
        this.log('Google onGoogleAPILoaded');
        if (this.tokenClient === null) {
            this.log('Google initTokenClient');
            this.log(this.CLIENT_ID);
            this.log(this.SCOPES);

            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES.join(' '),
                callback: '', // defined later
            });

            this.log('tokenClient value = ');
            this.log(this.tokenClient);

        } else {
            this.log('~tokenClient is NOT null');
        }
    }

    signIn(callback) {

        this.log('Google signin');
        this.tokenClient.callback = async (response) => {
            this.log('tokenClient callback');
            this.log(response);
            if (response.error !== undefined) {
                throw (response);
            }
            this.accessToken = response.access_token;
            //await this.loadPickerAPI();
            if (callback) {
                await callback();
            }
        };

        if (this.accessToken === null) {
            this.log('Prompt user for google account');
            // Prompt the user to select a Google Account and ask for consent to share their data
            // when establishing a new session.
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.log('Already loged in');
            // Skip display of account chooser and consent dialog for an existing session.
            this.tokenClient.requestAccessToken({ prompt: '' });
        }

    }

    signOut() {
        this.log('Google sign out');
        if (this.accessToken) {
            this.accessToken = null;
            google.accounts.oauth2.revoke(this.accessToken);
        }
    }

    async loadPickerAPI() {
        this.log('Loading Picker API');
        await gapi.load('client:picker', this.initializePicker);
    }

    async initializePicker(thisObject) {
        Metadocx.modules.Google.log('Initializing Google Picker API');
        await gapi.client.init({
            apiKey: Metadocx.modules.Google.API_KEY,
            discoveryDocs: [Metadocx.modules.Google.DISCOVERY_DOC],
        });
        await gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
    }

    showGoogleDocPicker() {

        if (this.accessToken === null) {
            this.log('User is not loged in, calling google signin');
            // Use is not logged in
            this.signIn(() => {
                // @todo fix this
                setTimeout(this.showGoogleDocPicker, 1000);
            });
            return;
        }

        Metadocx.modules.Google.log('Creating google picker');
        Metadocx.modules.Google.log(' accessToken = ' + Metadocx.modules.Google.accessToken);
        const picker = new google.picker.PickerBuilder()
            //.enableFeature(google.picker.Feature.NAV_HIDDEN)
            //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setDeveloperKey(Metadocx.modules.Google.API_KEY)
            .setAppId(Metadocx.modules.Google.APP_ID)
            .setOAuthToken(Metadocx.modules.Google.accessToken)
            .addView(google.picker.ViewId.SPREADSHEETS)
            .setLocale(Metadocx.reporting.viewer.options.locale ?? 'en')
            //.addView(new google.picker.DocsUploadView())
            .setCallback(Metadocx.modules.Google.pickerCallback)
            .build();
        picker.setVisible(true);
    }

    async pickerCallback(data) {
        Metadocx.modules.Google.log('Picker event ' + data.action);
        if (data.action === google.picker.Action.PICKED) {

            const document = data[google.picker.Response.DOCUMENTS][0];
            const fileId = document[google.picker.Document.ID];
            Metadocx.modules.Google.log('Selected file ' + fileId);


            let sheetMetaResponse;
            try {
                Metadocx.modules.Google.log('Getting spreadsheet meta');
                sheetMetaResponse = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: fileId,
                    includeGridData: false,
                });

                Metadocx.modules.Google.log(sheetMetaResponse);
                Metadocx.modules.Google.log(sheetMetaResponse.result.sheets[0].properties.title);

            } catch (err) {
                Metadocx.modules.Google.log('Error in gapi.client.sheets.spreadsheets.get ' + err.message);
            }



            let sheetDataResponse;
            try {
                Metadocx.modules.Google.log('Getting spreadsheet meta');
                sheetDataResponse = await gapi.client.sheets.spreadsheets.get({
                    spreadsheetId: fileId,
                    includeGridData: true,
                    ranges: [sheetMetaResponse.result.sheets[0].properties.title + '!A1:' + Metadocx.modules.Google.columnToLetter(sheetMetaResponse.result.sheets[0].properties.gridProperties.columnCount, sheetMetaResponse.result.sheets[0].properties.gridProperties.rowCount)],
                });

                Metadocx.modules.Google.log(sheetDataResponse);
                Metadocx.modules.Google.buildReportFromSheet(sheetDataResponse);

            } catch (err) {
                Metadocx.modules.Google.log('Error in gapi.client.sheets.spreadsheets.get ' + err.message);
            }




        }
    }

    columnToLetter(column, row) {
        var temp, letter = '';
        while (column > 0) {
            temp = (column - 1) % 26;
            letter = String.fromCharCode(temp + 65) + letter;
            column = (column - temp - 1) / 26;
        }
        return letter + row;
    }

    buildReportFromSheet(sheetData) {

        let title = sheetData.result.properties.title;
        let reportDefinition = {
            "id": "googleSheetReport",
            "properties": {
                "name": title,
                "description": "",
                "author": "",
                "version": ""
            },
            "options": {},
            "criterias": [],
            "sections": []
        };

        let index = 1;
        for (let x in sheetData.result.sheets) {

            let sectionID = 'sheet' + index;
            let reportSection = {
                "id": sectionID,
                "type": "DataTable",
                "properties": {
                    "name": sheetData.result.sheets[x].properties.title,
                    "description": ""
                },
                "orderBy": [],
                "groupBy": [],
                "model": [],
                "data": []
            };

            /**
             * Load data
             */
            let data = [];
            let model = [];
            let bFirstRow = true;
            for (let r in sheetData.result.sheets[x].data[0].rowData) {
                let row = sheetData.result.sheets[x].data[0].rowData[r].values;
                let rowData = {};
                for (let c in row) {
                    if (bFirstRow) {
                        let columnData = {};
                        columnData['name'] = 'column' + c;
                        columnData['type'] = 'string';
                        columnData['label'] = row[c].formattedValue ?? '';
                        if (row[c].userEnteredFormat.numberFormat) {
                            // Column has a format
                            if (row[c].userEnteredFormat.numberFormat.type) {
                                columnData['type'] = row[c].userEnteredFormat.numberFormat.type.toLowerCase();
                            }
                            if (row[c].userEnteredFormat.horizontalAlignment) {
                                columnData['align'] = row[c].userEnteredFormat.horizontalAlignment.toLowerCase();
                            }
                        }
                        model.push(columnData);
                    } else {
                        if (row[c].effectiveValue) {
                            if (row[c].effectiveValue.stringValue) {
                                rowData['column' + c] = row[c].effectiveValue.stringValue ?? '';
                            } else if (row[c].effectiveValue.numberValue) {
                                rowData['column' + c] = row[c].effectiveValue.numberValue ?? '';
                            } else {
                                rowData['column' + c] = row[c].formattedValue ?? '';
                            }
                        } else if (row[c].formattedValue) {
                            rowData['column' + c] = row[c].formattedValue ?? '';
                        } else {
                            rowData['column' + c] = '';
                        }

                    }
                }

                if (!bFirstRow) {
                    if (!this.isEmptyRow(rowData)) {
                        data.push(rowData);
                    }
                }

                bFirstRow = false;
            }

            reportSection.model = model;
            reportSection.data = data;

            reportDefinition.sections.push(reportSection);
            index++;
        }

        console.log(reportDefinition);

        this.app.reporting.viewer.load(reportDefinition);

    }

    isEmptyRow(row) {
        for (let c in row) {
            if (row[c]) {
                return false;
            }
        }
        return true;
    }


}
window.__Metadocx.GoogleModule = GoogleModule;
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
                    'Metadocx', 'jQuery', 'jQueryUI', 'IconScout', 'Numeral', 'Bootstrap', 'Select2', 'Moment', 'DateRangePicker', 'ChartJS'
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
                            tests: ['metadocx.css', 'metadocx.min.css'],
                            crossorigin: 'anonymous',
                            code: '<link rel="stylesheet" href="/css/metadocx.css" />',
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
                            code: '<script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>',
                        }
                    ],
                }
            },
            jQueryUI: {
                head: {
                    links: [
                        {
                            id: 'jqueryui',
                            type: 'link',
                            priority: 100,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css',
                            integrity: 'sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css" integrity="sha512-ELV+xyi8IhEApPS/pSj66+Jiw+sOT1Mqkzlh8ExXihe4zfqbWkxPRi8wptXIO9g73FSlhmquFlUOuMSoXz5IRw==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        },
                        {
                            id: 'jqueryuitheme',
                            type: 'link',
                            priority: 110,
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css',
                            integrity: 'sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==',
                            crossorigin: 'anonymous',
                            referrerpolicy: 'no-referrer',
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/theme.min.css" integrity="sha512-hbs/7O+vqWZS49DulqH1n2lVtu63t3c3MTAn0oYMINS5aT8eIAbJGDXgLt6IxDHcWyzVTgf9XyzZ9iWyVQ7mCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
                        }
                    ]
                },
                bottom: {
                    scripts: [
                        {
                            id: 'jqueryui',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js',
                            code: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js" integrity="sha512-57oZ/vW8ANMjR/KQ6Be9v/+/h6bq9/l3f0Oc7vn6qMqyhvPd1cvKBRWWpzu0QoneImqr2SkmO4MSqU+RpHom3Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>',
                        },
                    ]
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
                            code: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />',
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
                            href: 'https://unicons.iconscout.com/release/v3.0.0/css/line.css',
                            crossorigin: 'anonymous',
                            code: '<link rel="stylesheet" href="https://unicons.iconscout.com/release/v3.0.0/css/line.css">        ',
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
                            code: '<script src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>',
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
                            code: '<link href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" rel="stylesheet" crossorigin="anonymous">',
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
                            code: '<script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>',
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
                            code: '<script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script>',
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
                            code: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">',
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
                            code: '<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>',
                        },
                        {
                            id: 'bootstrapjs',
                            type: 'script',
                            priority: 110,
                            src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
                            integrity: 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4',
                            crossorigin: 'anonymous',
                            code: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>',
                        },
                    ],
                }
            },
            ChartJS: {
                bottom: {
                    scripts: [
                        {
                            id: 'chartjs',
                            type: 'script',
                            priority: 100,
                            src: 'https://cdn.jsdelivr.net/npm/chart.js@4.1.1/dist/chart.umd.min.js',
                            code: '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.1.1/dist/chart.umd.min.js"></script>',
                        },
                    ]
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
                            code: '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />',
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
                            code: '<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>',
                        },
                    ],
                }
            },
            GoogleAPI: {
                bottom: {
                    scripts: [
                        {
                            id: 'googleApi',
                            type: 'script',
                            priority: 100,
                            async: true,
                            defer: true,
                            src: 'https://apis.google.com/js/api.js',
                            code: '<script async defer src="https://apis.google.com/js/api.js"></script>',
                            onload: function () { Metadocx.modules.Google.gApiLoaded(); },
                        },
                        {
                            id: 'googleClient',
                            type: 'script',
                            priority: 100,
                            async: true,
                            defer: true,
                            src: 'https://accounts.google.com/gsi/client',
                            code: '<script async defer src="https://accounts.google.com/gsi/client"></script>',
                            onload: function () { Metadocx.modules.Google.gClientLoaded(); },
                        },
                    ]
                }
            },
        };
    }

    initialize() {
        super.initialize();
    }

    /**
     * Checks if all injected items are loaded
     * @returns 
     */
    isLoaded() {

        for (let x in this.loadStatus) {
            if (!this.loadStatus[x].loaded) {
                return false;
            }
        }

        return true;

    }


    /**
     * Scans all required files in a library and creates link and script tags
     * @param {*} libName 
     */
    injectLibrary(libName) {
        let sections = this.libraries[libName];
        if (sections.head && sections.head.links) {
            for (let x in sections.head.links) {
                if (!this.isStyleSheetLoaded(sections.head.links[x].href, sections.head.links[x].tests)) {
                    this.log('   Injecting head link ' + sections.head.links[x].id);
                    this.createElement(sections.head.links[x]);
                } else {
                    this.log('   Script ' + sections.head.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.head && sections.head.scripts) {
            for (let x in sections.head.scripts) {
                if (!this.isScriptLoaded(sections.head.scripts[x].src)) {
                    this.log('   Injecting head script ' + sections.head.scripts[x].id);
                    this.createElement(sections.head.scripts[x]);
                } else {
                    this.log('   Script ' + sections.head.scripts[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.links) {
            for (let x in sections.bottom.links) {
                if (!this.isStyleSheetLoaded(sections.bottom.links[x].href, sections.bottom.links[x].tests)) {
                    this.log('   Injecting bootom link ' + sections.bottom.links[x].id);
                    this.createElement(sections.bottom.links[x]);
                } else {
                    this.log('   Script ' + sections.bottom.links[x].id + ' already loaded');
                }
            }
        }

        if (sections.bottom && sections.bottom.scripts) {
            for (let x in sections.bottom.scripts) {
                if (!this.isScriptLoaded(sections.bottom.scripts[x].src)) {
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

        let module = this;

        this._bInjectionWasMade = true;

        this.loadStatus[options.id] = {
            loaded: false,
        };

        (function (d, s, id) {
            let js, lsjs = d.getElementsByTagName(s)[0];

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
            if (options.async) {
                js.async = true;
            }
            if (options.defer) {
                js.defer = true;
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
        console.groupCollapsed('[Metadocx] Checking for required link and script tags');

        if (this.app.reporting.viewer.options.ui == undefined) {
            this.app.reporting.viewer.options.ui = 'default';
        }

        this.log('Injecting required librairies for stack ' + this.app.reporting.viewer.options.ui);
        for (let x in this.stacks[this.app.reporting.viewer.options.ui].requires) {
            let libName = this.stacks[this.app.reporting.viewer.options.ui].requires[x];
            this.injectLibrary(libName);
        }

        if (!this._bInjectionWasMade) {
            // No injection made call 
            if (this.onLibrairiesLoaded) {
                this.onLibrairiesLoaded();
            }
        }

    }

    test() {
        console.log('Testing required librairies');

        if (this.app.reporting.viewer.options.ui == undefined) {
            this.app.reporting.viewer.options.ui = 'default';
        }

        let bValid = true;
        for (let x in this.stacks[this.app.reporting.viewer.options.ui].requires) {
            let libName = this.stacks[this.app.reporting.viewer.options.ui].requires[x];
            let bLibIsValid = this.testLibrary(libName);
            if (!bLibIsValid && bValid) {
                bValid = false;
            }
        }

        if (bValid) {
            console.log('All required libraries are loaded');
        } else {
            console.warn('Some required libraries are missing');
        }

        return bValid;

    }

    /**
     * Test library link and script to se if they are loaded
     * @param {*} libName 
     * @returns 
     */
    testLibrary(libName) {

        let sections = this.libraries[libName];
        if (sections.head && sections.head.links) {
            for (let x in sections.head.links) {
                if (!this.isStyleSheetLoaded(sections.head.links[x].href, sections.head.links[x].tests)) {
                    this.log('   Style sheet ' + sections.head.links[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.head && sections.head.scripts) {
            for (let x in sections.head.scripts) {
                if (!this.isScriptLoaded(sections.head.scripts[x].src)) {
                    this.log('   Script ' + sections.head.scripts[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.bottom && sections.bottom.links) {
            for (let x in sections.bottom.links) {
                if (!this.isStyleSheetLoaded(sections.bottom.links[x].href, sections.bottom.links[x].tests)) {
                    this.log('   Style sheet ' + sections.bottom.links[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        if (sections.bottom && sections.bottom.scripts) {
            for (let x in sections.bottom.scripts) {
                if (!this.isScriptLoaded(sections.bottom.scripts[x].src)) {
                    this.log('   Script ' + sections.bottom.scripts[x].id + ' is not loaded');
                    return false;
                }
            }
        }

        return true;

    }

    isStyleSheetLoaded(sUrl, tests) {

        for (let x in document.styleSheets) {
            if (document.styleSheets[x].href) {
                if (document.styleSheets[x].href.toLowerCase().endsWith(sUrl.toLowerCase())) {
                    return true;
                }

                if (tests != undefined && Array.isArray(tests)) {
                    for (let t in tests) {
                        if (document.styleSheets[x].href.toLowerCase().endsWith(tests[t].toLowerCase())) {
                            return true;
                        }

                    }
                }

            }
        }

        return false;
    }

    isScriptLoaded(sUrl) {

        for (let x in document.scripts) {
            if (document.scripts[x].src) {
                if (document.scripts[x].src.toLowerCase().endsWith(sUrl.toLowerCase())) {
                    return true;
                }
            }
        }

        return false;
    }

}
window.__Metadocx.ImportModule = ImportModule;
/**
 * Locale module class
 * 
 * @author Benoit Gauthier <bgauthier@metadocx.com>
 * @copyright Benoit Gauthier <bgauthier@metadocx.com>
 * @license https://github.com/metadocx/reporting/LICENSE.md
 */
class LocaleModule extends Module {

    constructor(app) {
        super(app);
        this.bootPriority = 100;
        this.isConsoleDisabled = false;
        this.currentLocale = 'en';
        this.locales = window.__Metadocx.Locales;
    }

    initialize() {
        super.initialize();
    }

    addLocale(locale, keys) {

        if (this.locales[locale] == undefined) {
            this.locales[locale] = {};
        }

        for (let k in keys) {
            this.locales[locale][k] = keys[k];
        }

    }

    setLocale(locale) {
        if (this.currentLocale != locale) {
            this.currentLocale = locale;
            moment.locale(this.currentLocale);
            this.translate();
        }
    }

    getKey(key) {
        let text = this.locales[this.currentLocale][key];
        if (text == undefined || text == null) {
            console.warn('Missing translation key ' + key);
            text = key;
        }
        return text;
    }

    getCurrentLocale() {
        return this.currentLocale;
    }

    getLocales() {
        let locales = [];
        for (let x in this.locales) {
            locales.push(x);
        }
        return locales;
    }

    translate() {

        let thisObject = this;
        $('[data-locale]').each(function () {
            if ($(this).is('input') || $(this).is('textarea')) {
                $(this).attr('placeholder', thisObject.getKey($(this).data('locale')));
            } else {
                $(this).html(thisObject.getKey($(this).data('locale')));
            }
        });

    }

    getLocaleMenuOptions() {
        let locales = this.getLocales();
        let s = '';
        for (let x in locales) {
            s += `<a id="${this.app.reporting.viewer.options.id}_locale_${locales[x]}" class="dropdown-item" href="#" onClick="Metadocx.modules.Locale.setLocale('${locales[x]}');" data-locale="${locales[x]}">${locales[x]}</a>`;
        }
        return s;
    }


}
window.__Metadocx.LocaleModule = LocaleModule;
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

            $('#' + this.app.reporting.viewer.options.container).append(this.renderExportDialog());
            this.hookExportDialogComponents();
            this.exportDialog = new bootstrap.Modal('#' + this.app.reporting.viewer.options.id + '_pdfExportDialog', {})
        }

        $('#pdfPaperSize').val(this.app.reporting.viewer.options.page.paperSize);

        let paperSize = this.app.modules.Printing.getPaperSize($('#pdfPaperSize').val());
        $('#pdfPaperSizeWidth').val(paperSize.width);
        $('#pdfPaperSizeHeight').val(paperSize.height);

        if (this.app.reporting.viewer.options.page.orientation == Metadocx.modules.Printing.PageOrientation.Portrait) {
            $('#pdfOrientationPortrait').prop('checked', true);
            $('#pdfOrientationLandscape').prop('checked', false);
        } else {
            $('#pdfOrientationPortrait').prop('checked', false);
            $('#pdfOrientationLandscape').prop('checked', true);
        }

        $('#pdfTopMargin').val(this.app.reporting.viewer.options.page.margins.top);
        $('#pdfBottomMargin').val(this.app.reporting.viewer.options.page.margins.bottom);
        $('#pdfLeftMargin').val(this.app.reporting.viewer.options.page.margins.left);
        $('#pdfRightMargin').val(this.app.reporting.viewer.options.page.margins.right);

        this.exportDialog.show();

    }

    hideExportDialog() {
        if (this.exportDialog !== null) {
            this.exportDialog.hide();
        }
    }


    renderExportDialog() {

        return `<div id="${this.app.reporting.viewer.options.id}_pdfExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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

            let paperSize = this.app.modules.Printing.getPaperSize($('#pdfPaperSize').val());
            $('#pdfPaperSizeWidth').val(paperSize.width);
            $('#pdfPaperSizeHeight').val(paperSize.height);
        });

    }


    getPDFExportOptions() {

        let orientation = Metadocx.modules.Printing.PageOrientation.Portrait;
        if ($('#pdfOrientationLandscape').prop('checked')) {
            orientation = Metadocx.modules.Printing.PageOrientation.Landscape;
        }

        let paperSize = this.app.reporting.viewer.options.page.paperSize;
        if ($('#pdfPaperSize').length > 0) {
            paperSize = $('#pdfPaperSize').val();
        }

        let paperSizeInfo = this.app.modules.Printing.getPaperSize(paperSize);
        let width = paperSizeInfo.width;
        let height = paperSizeInfo.height;
        if ($('#pdfPaperSizeWidth').length > 0) {
            width = $('#pdfPaperSizeWidth').val();
        }
        if ($('#pdfPaperSizeHeight').length > 0) {
            height = $('#pdfPaperSizeHeight').val();
        }
        let grayscale = false;
        if ($('#pdfGrayscale').length > 0) {
            grayscale = $('#pdfGrayscale').prop('checked');
        }
        let marginTop = $('#pdfTopMargin').val();
        if (marginTop == undefined) {
            marginTop = this.app.reporting.viewer.options.page.margins.top;
        }
        let marginBottom = $('#pdfBottomMargin').val();
        if (marginBottom == undefined) {
            marginBottom = this.app.reporting.viewer.options.page.margins.bottom;
        }
        let marginLeft = $('#pdfLeftMargin').val();
        if (marginLeft == undefined) {
            marginLeft = this.app.reporting.viewer.options.page.margins.left;
        }
        let marginRight = $('#pdfRightMargin').val();
        if (marginRight == undefined) {
            marginRight = this.app.reporting.viewer.options.page.margins.right;
        }
        let pdfCompression = $('#pdfUseCompression').prop('checked');
        if (pdfCompression == undefined) {
            pdfCompression = true;
        }
        let outline = $('#pdfIncludeOutline').prop('checked');
        if (outline == undefined) {
            outline = true;
        }
        let backgroundGraphics = $('#pdfPrintBackgrounds').prop('checked');
        if (backgroundGraphics == undefined) {
            backgroundGraphics = true;
        }

        let headerLeft = $('#pdfHeaderLeft').val();
        if (headerLeft == undefined) {
            headerLeft = '';
        }
        let headerCenter = $('#pdfHeaderCenter').val();
        if (headerCenter == undefined) {
            headerCenter = '';
        }
        let headerRight = $('#pdfHeaderRight').val();
        if (headerRight == undefined) {
            headerRight = '';
        }

        let footerLeft = $('#pdfFooterLeft').val();
        if (footerLeft == undefined) {
            footerLeft = '';
        }
        let footerCenter = $('#pdfFooterCenter').val();
        if (footerCenter == undefined) {
            footerCenter = '';
        }
        let footerRight = $('#pdfFooterRight').val();
        if (footerRight == undefined) {
            footerRight = '';
        }


        return {
            "coverpage": this.app.reporting.viewer.options.coverPage.enabled,
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

        let thisObject = this;

        /**
         * Get export options and hide dialog
         */
        let pdfOptions = this.getPDFExportOptions();
        this.hideExportDialog();

        /**
         * Show exporting dialog
         */
        let exportDialog = bootbox.dialog({
            title: 'Export to PDF',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to PDF...</p>'
        });

        $('.report-graph-canvas').hide();
        $('.report-graph-image').show();

        /**
         * Call export service
         */


        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/PDF',
            data: {
                PDFOptions: pdfOptions,
                HTML: btoa(unescape(encodeURIComponent($('#reportPage')[0].outerHTML))),
                CoverPage: ($('#reportCoverPage').length > 0 ? btoa(unescape(encodeURIComponent($('#reportCoverPage')[0].outerHTML))) : ''),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {


                let blob = new Blob([data]);

                let sContent = `Report has been converted to PDF, click on button to download file<br><br>
                <a class="btn btn-primary" href="${window.URL.createObjectURL(blob)}" download="Report.pdf" onClick="$('.bootbox.modal').modal('hide');">Download report</a>`;

                exportDialog.find('.bootbox-body').html(sContent);

                thisObject.hideExportDialog();
                thisObject.app.modules.Printing.applyPageStyles();

                $('.report-graph-canvas').show();
                $('.report-graph-image').hide();

            }
        });
    }

    print() {

        let thisObject = this;

        let loadingDialog = bootbox.dialog({
            message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Generating and printing report...</p>',
            closeButton: false
        });

        $('.report-graph-canvas').hide();
        $('.report-graph-image').show();

        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/PDF',
            data: {
                PDFOptions: this.getPDFExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#reportPage')[0].outerHTML))),
                CoverPage: ($('#reportCoverPage').length > 0 ? btoa(unescape(encodeURIComponent($('#reportCoverPage')[0].outerHTML))) : ''),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //console.log(data);
                //console.log(status);

                let pdfBlob = new Blob([data], { type: 'application/pdf' });
                pdfBlob = window.URL.createObjectURL(pdfBlob)

                $('#__metadocxPDFPrint').remove();

                let printFrame = document.createElement('iframe');
                printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0');
                printFrame.setAttribute('id', '__metadocxPDFPrint');
                printFrame.setAttribute('src', pdfBlob);

                document.getElementsByTagName('body')[0].appendChild(printFrame);
                let iframeElement = document.getElementById('__metadocxPDFPrint');

                iframeElement.onload = () => {
                    iframeElement.focus();
                    iframeElement.contentWindow.print();
                }

                thisObject.app.modules.Printing.applyPageStyles();
                $('.report-graph-canvas').show();
                $('.report-graph-image').hide();

                loadingDialog.modal('hide');

            }
        });


    }

    exportToImages(callback) {
        let thisObject = this;

        /**
         * Get export options and hide dialog
         */
        let pdfOptions = this.getPDFExportOptions();

        /*let loadingDialog = bootbox.dialog({
            message: '<p class="text-center mb-0"><i class="fas fa-spin fa-cog"></i> Generating report...</p>',
            closeButton: false
        });*/

        $('.report-graph-canvas').hide();
        $('.report-graph-image').show();

        /**
         * Call export service
         */
        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/PDF',
            data: {
                PDFOptions: pdfOptions,
                HTML: btoa(unescape(encodeURIComponent($('#reportPage')[0].outerHTML))),
                CoverPage: ($('#reportCoverPage').length > 0 ? btoa(unescape(encodeURIComponent($('#reportCoverPage')[0].outerHTML))) : ''),
                ConvertToImages: true,
            },
            success: (data, status, xhr) => {

                let s = '';
                let pageNumber = 1;
                for (let x in data) {
                    s += `<div id="reportPage${pageNumber}" class="report-page">
                        <img style="width:100%;" src="${data[x]}"/>
                    </div>`;
                }

                $('#metadocxReport_pageViewer').html(s);
                $('#metadocxReport_canvas').hide();
                $('#metadocxReport_pageViewer').show();

                thisObject.app.modules.Printing.applyPageStyles(false);

                $('.report-graph-canvas').show();
                $('.report-graph-image').hide();

                if (callback) {
                    callback();
                }

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
        let s = '';
        for (let x in this.PaperSize) {
            s += '<option value="' + this.PaperSize[x] + '">' + this.PaperSize[x] + '</option>';
        }
        return s;
    }

    getPaperSizes() {
        return Object.keys(this.PaperSize);
    }

    getPaperSize(name) {
        if (this.PaperSizeProperties[name] != undefined) {
            return this.PaperSizeProperties[name];
        } else {
            return { width: 0, height: 0 };
        }
    }

    applyPageStyles(bPadding) {

        if (bPadding === undefined) {
            bPadding = true;
        }

        let paperSize = this.getPaperSize(this.app.reporting.viewer.options.page.paperSize);
        let pageOrientation = this.app.reporting.viewer.options.page.orientation;

        let width = 0;
        let height = 0;

        if (pageOrientation == this.PageOrientation.Landscape) {
            width = paperSize.height;
            height = paperSize.width;
        } else {
            width = paperSize.width;
            height = paperSize.height;
        }

        $('.report-page').css('max-width', width + 'mm');
        $('.report-page').css('width', width + 'mm');
        $('.report-page').css('min-height', height + 'mm');

        if (bPadding) {
            $('.report-page').css('padding-top', this.app.reporting.viewer.options.page.margins.top + 'in');
            $('.report-page').css('padding-bottom', this.app.reporting.viewer.options.page.margins.bottom + 'in');
            $('.report-page').css('padding-left', this.app.reporting.viewer.options.page.margins.left + 'in');
            $('.report-page').css('padding-right', this.app.reporting.viewer.options.page.margins.right + 'in');
        }

    }

    removeCoverPagePadding() {
        $('#reportCoverPage').css('padding', '0px');
    }

    getThemeOptions() {
        let s = '';
        s += '<option value="" data-locale="Default">Default</option>';
        for (let x in window.__Metadocx.Themes) {
            s += '<option value="' + x + '">' + x + '</option>';
        }
        return s;
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
        app.reporting.viewer.render();
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

        return this.exportWord();

    }


    renderExportDialog() {

        return `<div id="${this.app.reporting.viewer.options.id}_wordExportDialog" class="modal modal-lg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
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

            let paperSize = this.app.modules.Printing.getPaperSize($('#wordPaperSize').val());
            $('#wordPaperSizeWidth').val(paperSize.width);
            $('#wordPaperSizeHeight').val(paperSize.height);
        });

    }


    getWordExportOptions() {

        return {}

    }

    exportWord() {

        let thisObject = this;

        $('.report-graph-canvas').hide();
        $('.report-graph-image').show();

        /**
         * Show exporting dialog
         */
        let exportDialog = bootbox.dialog({
            title: 'Export to Word',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to Word...</p>'
        });

        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/Word',
            data: {
                ExportOptions: this.getWordExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#' + this.app.reporting.viewer.report.id + '_canvas').html()))),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
                let blob = new Blob([data]);
                let sContent = `Report has been converted to Word, click on button to download file<br><br>
                <a class="btn btn-primary" href="${window.URL.createObjectURL(blob)}" download="Report.docx" onClick="$('.bootbox.modal').modal('hide');">Download report</a>`;

                exportDialog.find('.bootbox-body').html(sContent);

                //thisObject.hideExportDialog();
                thisObject.app.modules.Printing.applyPageStyles();

                $('.report-graph-canvas').show();
                $('.report-graph-image').hide();

            }
        });
    }


}
window.__Metadocx.WordModule = WordModule;
window.__Metadocx.Locales.en = {
    "en": "English",
    "fr": "French",
    "Options": "Options",
    "Orientation": "Orientation",
    "Margins": "Margins",
    "Top": "Top",
    "Bottom": "Bottom",
    "Left": "Left",
    "Right": "Right",
    "Inches": "in.",
    "Cancel": "Cancel",
    "ApplyOptions": "Apply Options",
    "PaperSize": "Paper Size",
    "Portrait": "Portrait",
    "Landscape": "Landscape",
    "Reset": "Reset",
    "MissingReportDefinition": "Missing report definition",
    "OupsNoReport": "Oups! Something went wrong. We did not get a report to load.",
    "Criterias": "Criterias",
    "ReportSettings": "Report Settings",
    "Letter": "Letter",
    "Legal": "Legal",
    "Custom": "Custom",
    "PoweredBy": "powered by",
    "Yes": "Yes",
    "No": "No",
    "Equal": "Equal",
    "NotEqual": "Not equal",
    "GreaterThan": "Greater than",
    "GreaterOrEqual": "Greater or equal",
    "SmallerThan": "Smaller than",
    "SmallerOrEqual": "Smaller or equal",
    "Between": "Between",
    "ApplyCriterias": "Apply Criterias",
    "And": "and",
    "Name": "Name",
    "ReportName": "Report Name",
    "ReportDescription": "Report Description",
    "Description": "Description",
    "ApplySettings": "Apply Settings",
    "Fields": "Fields",
    "Order": "Order",
    "Groups": "Groups",
    "ReportProperties": "Report Properties",
    "None": "(None)",
    "Sum": "Sum",
    "Average": "Average",
    "MinValue": "Min Value",
    "MaxValue": "Max Value",
    "Count": "Count",
    "Ascending": "Ascending",
    "Descending": "Descending",
    "CoverPage": "Cover Page",
    "Label": "Label",
    "Width": "Width",
    "Type": "Type",
    "IsVisible": "Is Visible",
    "Center": "Center",
    "Alignment": "Alignment",
    "SectionID": "Section ID",
    "Default": "Default",
    "ReportTheme": "Report Theme",
    "CreatedAt": "Created At",
    "PDF": "PDF",
    "Excel": "Excel",
    "Word": "Word",
    "Open": "Open",
    "Save": "Save",
    "Delete": "Delete",
    "New": "New",
    "SaveAs": "Save as",
    "SavedReport": "Save report",
    "SavedReports": "Saved reports",
    "OpenReport": "Open Report",
    "SelectReport": "Select Report",
    "DeleteReport": "Delete Report",
    "ReportDeleted": "Report Deleted",
    "ReportOpened": "Report opened",
    "ReportSaved": "Report saved",
    "GoogleDrive": "Google Drive",
};
window.__Metadocx.Locales.fr = {
    "en": "Anglais",
    "fr": "Français",
    "Options": "Options",
    "Orientation": "Orientation",
    "Margins": "Marges",
    "Top": "Haut",
    "Bottom": "Bas",
    "Left": "Gauche",
    "Right": "Droite",
    "Inches": "pce",
    "Cancel": "Annuler",
    "ApplyOptions": "Appliquer options",
    "PaperSize": "Type de papier",
    "Portrait": "Portrait",
    "Landscape": "Paysage",
    "Reset": "Réinitialiser",
    "MissingReportDefinition": "Définition de rapport manquante",
    "OupsNoReport": "Oups ! Quelque chose s'est mal passé. Nous n'avons pas reçu de rapport à charger.",
    "Criterias": "Critères",
    "ReportSettings": "Paramètres du rapport",
    "Letter": "Lettre",
    "Legal": "Légal",
    "Custom": "Personnalisé",
    "PoweredBy": "propulsé par",
    "Yes": "Oui",
    "No": "Non",
    "Equal": "Égale",
    "NotEqual": "Différent",
    "GreaterThan": "Plus grand que",
    "GreaterOrEqual": "Plus grand ou égale",
    "SmallerThan": "Plus petit que",
    "SmallerOrEqual": "Plus petit ou égale",
    "Between": "Entre",
    "ApplyCriterias": "Appliquer les critères",
    "And": "et",
    "Name": "Nom",
    "ReportName": "Nom du rapport",
    "ReportDescription": "Description du rapport",
    "Description": "Description",
    "ApplySettings": "Appliquer les paramètres",
    "Fields": "Champs",
    "Order": "Ordre de tri",
    "Groups": "Groupements",
    "ReportProperties": "Propriétés du rapport",
    "None": "(Aucun)",
    "Sum": "Somme",
    "Average": "Moyenne",
    "MinValue": "Valeur minimum",
    "MaxValue": "Valeur maximum",
    "Count": "Quantité",
    "Ascending": "Croissant",
    "Descending": "Décroissant",
    "CoverPage": "Page Couverture",
    "Label": "Libellé",
    "Width": "Largeur",
    "Type": "Type",
    "IsVisible": "Est Visible",
    "Center": "Centré",
    "Alignment": "Alignement",
    "SectionID": "ID de la section",
    "Default": "Défaut",
    "ReportTheme": "Thème du rapport",
    "CreatedAt": "Créé le",
    "PDF": "PDF",
    "Excel": "Excel",
    "Word": "Word",
    "Open": "Ouvrir",
    "Save": "Sauvegarder",
    "Delete": "Détruire",
    "New": "Nouveau",
    "SaveAs": "Sauvegarder sous",
    "SavedReport": "Sauvegarde du rapport",
    "SavedReports": "Rapports sauvegardés",
    "OpenReport": "Ouvrir un rapport",
    "SelectReport": "Sélectionnez un rapport",
    "DeleteReport": "Détruire le rapport?",
    "ReportDeleted": "Rapport détruit avec succès",
    "ReportOpened": "Ouverture du rapport",
    "ReportSaved": "Rapport sauvegardé",
    "GoogleDrive": "Google Drive",
};
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
        let js, lsjs = d.getElementsByTagName(s)[0];
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