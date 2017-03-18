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
                layout: { type: 'fit', align: 'center' },
                id: 'leftChartsPanelID',
                itemId: 'leftChartsPanel'
            },
            {
                xtype: 'panel',
                border: 1,
                flex: 1,
                title: 'Release CFD',
                layout: { type: 'fit', align: 'center' },
                id: 'rightChartsPanelID',
                itemId: 'rightChartsPanel'
            }
        ],
        layout: {
            type: 'hbox',
            align: 'center'
        },

        config: {
            iterationId: 0,
            releaseId: 0
        },

        constructor: function(config) {
            this.mergeConfig(config);
            this.initConfig(config);
            this.callParent(arguments);
        },

        loadCharts: function() {
            var w = this.getWidth()/2;

            if (this.getIterationId() > 0) {
                this.items.getAt(0).removeAll();
                var iters = [this.getIterationId()];
                var iterBurn = Ext.create("PepsiCo.app.sprintreport.IterationBurndownPanel", {
                    iterations: iters,
                    reportWidth: w*0.95,
                    reportHeight: w*1.15
                });
                iterBurn.loadChart();
                this.items.getAt(0).add(iterBurn);
            }

            if (this.getReleaseId() > 0) {
                this.items.getAt(1).removeAll();
                var rels = [this.getReleaseId()];
                var rCfd = Ext.create('PepsiCo.app.sprintreport.ReleaseCfdPanel', {
                    releases: rels,
                    reportWidth: w,
                    reportHeight: w*1.15
                });

                rCfd.loadChart();
                this.items.getAt(1).add(rCfd);
            }
        }
    });
})();
