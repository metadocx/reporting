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