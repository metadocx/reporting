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