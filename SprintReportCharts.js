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
                layout: 'fit',
                id: 'leftChartsPanelID',
                itemId: 'leftChartsPanel'
            },
            {
                xtype: 'panel',
                border: 1,
                flex: 1,
                layout: 'fit',
                id: 'rightChartsPanelID',
                itemId: 'rightChartsPanel'
            }
        ],
        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        store: null,
        iteration: null,

        constructor: function(config) {
            this.mergeConfig(config);
            this.callParent(arguments);
        },

        _load: function() {
            var iters = [this.iteration];
            var iterBurn = Ext.create('Rally.ui.report.StandardReport', {
                reportConfig: {
                    report: 'IterationBurndown',
                    iterations: iters,
                    legend: 'show'
                },
                width: 400,
                height: 400
            });
            console.log("item 0 : %o\n", this.items.getAt(0));
            this.items.getAt(0).add(iterBurn);

            var rCfd = Ext.create('PepsiCo.app.sprintreport.ReleaseCfdPanel', {
                    width: 400,
                    height: 400
            });

            rCfd.loadRelease('Image Vision Upgrade - PI');
            this.items.getAt(1).add(rCfd);
        },

        _setIterationId: function(iter) {
            this.iteration = iter;
        }

    });
})();
