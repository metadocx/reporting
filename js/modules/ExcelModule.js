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

        return {};

    }

    exportExcel() {

        /**
         *  Get all graphs images and encode them in base64 to insert in excel
         */
        var thisObject = this;

        /**
         * Show exporting dialog
         */
        var exportDialog = bootbox.dialog({
            title: 'Export to Excel',
            message: '<p><i class="fas fa-spin fa-spinner"></i> Exporting report to Excel...</p>'
        });


        $.ajax({
            type: 'post',
            url: '/Metadocx/Convert/Excel',
            data: {
                ExportOptions: this.getExcelExportOptions(),
                ReportDefinition: JSON.parse(JSON.stringify(this.app.viewer.report.getReportDefinition())),
                Graphs: [],
            },
            xhrFields: {
                responseType: 'blob'
            },
            success: (data, status, xhr) => {
                var blob = new Blob([data]);

                var sContent = `Report has been converted to Excel, click on button to download file<br><br>
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