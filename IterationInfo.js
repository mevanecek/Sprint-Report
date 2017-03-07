(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.IterationInfo', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.iterationinforow',
        cls: 'iterationInfoRow',
        requires: ['Rally.data.wsapi.Store'],

        leftPanel: null,
        rightPanel: null,
        renderTo: Ext.getBody(),

        store: null,
        iteration: null,

        mixins: {
            observable: 'Ext.util.Observable'
        },

        constructor: function(config) {
            this.mergeConfig(config);

            this.mixins.observable.constructor.call(this, config);
            this.addEvents('loaded');
            this.callParent(arguments);
        },

        _load: function(store, data) {
            var dt = Rally.util.DateTime.format(data[0].data.StartDate, 'M d, Y');
            console.log("Iteration = %o\n", data);
            console.log('Start date = %o\n', dt);
        },

        _fetchIteration: function() {

            var iter = this.iteration;
            if (!this.store) {
                this.store = Ext.create('Rally.data.wsapi.Store', {
                    model: 'Iteration',
                    autoLoad: true,
                    listeners: {
                        load: this._load,
                        scope: this
                    },
                    filters: [{
                        property: 'ObjectID',
                        value: iter
                    }],
                    fetch: [
                        'Name', 'StartDate', 'EndDate', 'Theme'
                    ]
                })
            }
        },

        _setIterationId: function(iter) {
            this.iteration = iter;
        }

    });
})();

