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