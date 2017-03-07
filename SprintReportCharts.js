
(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.SprintReportCharts', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.sprintreportcharts',
        cls: 'sprint-report-charts',
        requires: [ 'Rally.data.wsapi.Store' ],

        items: [
        {
            xtype: 'panel',
            border: 0,
            flex: 1,
            itemId: 'leftChartsPanel'
        },
        {
            xtype: 'panel',
            border: 0,
            flex: 1,
            itemId: 'rightChartsPanel'
        }
            ],
        layout: {
            type: 'hbox',
            align: 'stretch'
        },

            store: null,
        iteration: null,

        mixins: {
            observable: 'Ext.util.Observable'
        },

        constructor: function(config) {
            this.mergeConfig(config);

            this.mixins.observable.constructor.call(this, config);
            this.callParent(arguments);
        },

        _load: function(store, data) {
        },

        _fetchIteration: function() {

            var iter = this.iteration;
            if (!this.store) {
                this.store = Ext.create('Rally.data.wsapi.Store', {
                    model: 'Iteration',
                    autoLoad: false,
                    listeners: {
                        load: this._load,
                        scope: this
                    },
                    fetch: [
                        'Name', 'StartDate', 'EndDate', 'Theme'
                        ]
                });
            }
            this.store.setFilter( {
                property: 'ObjectID',
                value: iter
            });
            this.store.load();
        },

        _setIterationId: function(iter) {
            this.iteration = iter;
        }

    });
})();

