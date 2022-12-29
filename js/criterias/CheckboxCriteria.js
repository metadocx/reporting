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