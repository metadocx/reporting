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