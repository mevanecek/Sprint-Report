(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.IterationBurndownPanel', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.iterationburndownreport',
        cls: 'sprint-report-charts',


        config: {
            reportWidth: 200,
            reportHeight: 200,
            iterations: []
        },

        report: null,
        store: null,

        constructor: function(cfg) {
            this.mergeConfig(cfg);
            this.initConfig(cfg);
            this.setIterations([]);
            this.callParent(arguments);
        },

        loadChart: function() {
            var w = this.getReportWidth();
            var h = this.getReportHeight();

            var iters = this.iterations;
            this.report = Ext.create('Rally.ui.report.StandardReport', {
                reportConfig: {
                    report: 'IterationBurndown',
                    iterations: iters,
                    legend: 'show'
                },
                height: h,
                width: w
            });

            this.add(this.report);
        }
    });
})();
