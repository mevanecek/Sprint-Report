(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.IterationInfo', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.iterationinforow',
        cls: 'iterationInfoRow',
        requires: ['Rally.data.wsapi.Store'],

        items: [{
                xtype: 'panel',
                border: 0,
                flex: 1,
                itemId: 'leftPanel'
            },
            {
                xtype: 'panel',
                border: 0,
                flex: 1,
                itemId: 'rightPanel'
            }
        ],
        layout: {
            type: 'hbox',
            align: 'stretch'
        },

        //        renderTo: Ext.getBody(),

        leftTemplate: new Ext.Template('<table style="margin-left: 25px;"><tr><td style="font-weight: bold;">Sprint:</td><td>{sprintName}</td></tr>' +
            '<tr><td style="font-weight: bold;">Start Date:</td><td>{startDate}</td></tr>' +
            '<tr><td style="font-weight: bold;">End Date:</td><td>{endDate}</td></tr></table>'),
        rightTemplate: new Ext.Template('<table style="margin-left: 25px;"><tr><td style="font-weight: bold;">Theme:</td></tr><tr><td>{sprintTheme}</td></tr></table>'),

        store: null,
        iteration: null,

        //        mixins: {
        //            observable: 'Ext.util.Observable'
        //        },

        constructor: function(config) {
            this.mergeConfig(config);

            //            this.mixins.observable.constructor.call(this, config);
            this.addEvents('loaded');
            this.callParent(arguments);
        },

        _load: function(store, data) {
            var startDt = Rally.util.DateTime.format(data[0].data.StartDate, 'M d, Y');
            var endDt = Rally.util.DateTime.format(data[0].data.EndDate, 'M d, Y');
            var leftHtml = this.leftTemplate.apply({
                sprintName: data[0].data.Name,
                startDate: startDt,
                endDate: endDt
            });
            var rightHtml = this.rightTemplate.apply({ sprintTheme: data[0].data.Theme });

            //            console.log("Iteration = %o\n", data);
            this.getComponent('leftPanel').update(leftHtml);
            this.getComponent('rightPanel').update(rightHtml);
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
            this.store.setFilter({
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