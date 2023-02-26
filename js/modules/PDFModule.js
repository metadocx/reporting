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

        let paperSize = this.app.modules.Printing.getPaperSize($('#pdfPaperSize').val());
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

        let paperSize = this.app.viewer.options.page.paperSize;
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
            marginTop = this.app.viewer.options.page.margins.top;
        }
        let marginBottom = $('#pdfBottomMargin').val();
        if (marginBottom == undefined) {
            marginBottom = this.app.viewer.options.page.margins.bottom;
        }
        let marginLeft = $('#pdfLeftMargin').val();
        if (marginLeft == undefined) {
            marginLeft = this.app.viewer.options.page.margins.left;
        }
        let marginRight = $('#pdfRightMargin').val();
        if (marginRight == undefined) {
            marginRight = this.app.viewer.options.page.margins.right;
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
            "coverpage": this.app.viewer.options.coverPage.enabled,
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