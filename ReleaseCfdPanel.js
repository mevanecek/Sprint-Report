(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.ReleaseCfdPanel', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.releasecfdreport',
        cls: 'sprint-report-charts',


        config: {
            reportWidth: 200,
            reportHeight: 200,
            releases: []
        },

        report: null,
        store: null,

        constructor: function(cfg) {
            this.mergeConfig(cfg);
            this.initConfig(cfg);
            this.setReleases([]);
            this.callParent(arguments);
        },

        loadChart: function() {
            var w = this.getReportWidth();
            var h = this.getReportHeight();

            var rls = this.getReleases();
            this.report = Ext.create('Rally.ui.report.StandardReport', {
                reportConfig: {
                    report: 'ReleaseCumulativeFlowDiagram',
                    releases: rls,
                    legend: 'show'
                },
                height: h,
                width: w
            });

            this.add(this.report);
        },
    });
})();