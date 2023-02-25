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