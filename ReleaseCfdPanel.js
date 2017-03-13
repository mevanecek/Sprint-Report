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
        this.callParent(arguments);
    },

    _load: function(store, data) {
        console.log("Release = %o\n", data);
        var w = this.getReportWidth();
        var h = this.getReportHeight();

        var rls = [ data[0].get('ObjectID') ];
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

    loadRelease: function(releaseName) {
        if (!this.store) {
            this.store = Ext.create('Rally.data.wsapi.Store', {
                model: 'Release',
                autoLoad: false,
                listeners: {
                    load: this._load,
                    scope: this
                },
                fetch: [
                    'Name', 'StartDate', 'EndDate', 'ObjectID'
                ]
            });
        }
        this.store.setFilter({
            property: 'Name',
            value: releaseName
        });

        this.store.load();

    }

    });
})();
