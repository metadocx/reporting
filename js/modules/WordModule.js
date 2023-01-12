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

        return {}

    }

    exportWord() {

        var thisObject = this;

        $('.report-graph-canvas').hide();
        $('.report-graph-image').show();

        /**
         * Show exporting dialog
         */
        var exportDialog = bootbox.dialog({
            title: 'Export to Word',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to Word...</p>'
        });

        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/Word',
            data: {
                ExportOptions: this.getWordExportOptions(),
                HTML: btoa(unescape(encodeURIComponent($('#' + this.app.viewer.report.id + '_canvas').html()))),
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                //, { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
                var blob = new Blob([data]);
                var sContent = `Report has been converted to Word, click on button to download file<br><br>
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