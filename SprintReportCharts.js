(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.SprintReportCharts', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.sprintreportcharts',
        cls: 'sprint-report-charts',
        requires: ['Rally.data.wsapi.Store'],

        items: [{
                xtype: 'panel',
                border: 1,
                flex: 1,
                title: 'Sprint Burndown',
                layout:  { type: 'fit', align: 'center' },
                id: 'leftChartsPanelID',
                itemId: 'leftChartsPanel'
            },
            {
                xtype: 'panel',
                border: 1,
                flex: 1,
                title: 'Release CFD',
                layout:  { type: 'fit', align: 'center' },
                id: 'rightChartsPanelID',
                itemId: 'rightChartsPanel'
            }
        ],
        layout: {
            type: 'hbox',
            align: 'pack'
        },

        store: null,
        iteration: null,

        constructor: function(config) {
            this.mergeConfig(config);
            this.callParent(arguments);
        },

        _load: function() {
            this.items.getAt(0).removeAll();
            this.items.getAt(1).removeAll();

            var iters = [this.iteration];
            var iterBurn = Ext.create('Rally.ui.report.StandardReport', {
                reportConfig: {
                    report: 'IterationBurndown',
                    iterations: iters,
                    legend: 'show'
                },
                height: 450,
                width: 400
            });
            this.items.getAt(0).add(iterBurn);

            var rCfd = Ext.create('PepsiCo.app.sprintreport.ReleaseCfdPanel', {
                    reportWidth: 400,
                    reportHeight: 450
            });

            rCfd.loadRelease('Image Vision Upgrade - PI');
            this.items.getAt(1).add(rCfd);
        },

        _setIterationId: function(iter) {
            this.iteration = iter;
        }

    });
})();
