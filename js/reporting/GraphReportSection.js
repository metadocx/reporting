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
    }

    render() {
        return `<div id="${this.reportSection.id}_reportSection" class="report-section-graph">                    
                    <canvas id="${this.reportSection.id}_graphCanvas" class="no-print report-graph-canvas"></canvas>
                    <img id="${this.reportSection.id}_graphImage" class="print-only report-graph-image" style="width:100%;"/>                    
                </div>`;
    }



    buildGraphDataSets() {

        var dataSets = [];
        this._labels = [];

        for (var x in this.reportSection.datasets) {

            var ds = this.reportSection.datasets[x];

            if (ds.source = 'section') {

                var data = {};

                var oSection = this.app.viewer.report.getReportSection(ds.section);
                for (var d in oSection.data) {
                    var row = oSection.data[d];
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

                var dataArray = [];
                for (var x in data) {

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

                var oDS = {
                    label: this.getModelLabel(ds.field, oSection.model) + this.getDataSetFormula(ds.formula),
                    data: dataArray.map(row => row.data)
                };

                /**
                 * Copy additional dataset options (see Chart.js doc)
                 */
                if (ds.options) {
                    for (var kOption in ds.options) {
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
        for (var x in model) {
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

        if (this.reportSection.css) {
            for (var x in this.reportSection.css) {
                $('#' + this.reportSection.id + '_reportSection').css(x, this.reportSection.css[x]);
            }
        }


        /**
         * Render Chart
         */
        const datasets = this.buildGraphDataSets();
        const labels = this.buildGraphLabels(datasets);

        var options = {};
        if (this.reportSection.options != undefined) {
            options = this.reportSection.options;
        }

        var plugins = [];

        plugins.push({
            afterRender: () => {
                var graphCanvas = document.getElementById(this.reportSection.id + '_graphCanvas');
                var graphImage = document.getElementById(this.reportSection.id + '_graphImage');
                graphImage.src = graphCanvas.toDataURL();
                //$('#' + this.reportSection.id + '_graphCanvas').hide();
            },
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