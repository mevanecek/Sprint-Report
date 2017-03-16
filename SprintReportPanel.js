(function() {

    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.SprintReportPanel', {

        extend: 'Ext.panel.Panel',
        componentCls: 'sprintreportpanel',
        alias: 'widget.sprintreportpanel',
        cls: 'sprint-report',

        config: {
            store: undefined,
            width: 1024
        },

        items: [{
                xtype: 'container',
                itemId: 'reportheader'
            },
            {
                xtype: 'container',
                itemId: 'metricsrow'
            },
            {
                xtype: 'container',
                itemId: 'chartsrow'
            },
            {
                xtype: 'container',
                itemId: 'storiesrow'
            },
            {
                xtype: 'container',
                itemId: 'footerrow',
                height: 100
            }
        ],

        layout: {
            type: 'vbox',
            pack: 'center'
                // align: 'center'
        },

        constructor: function(cfg) {
            // this.mergeConfig(cfg);
            this.initConfig(cfg);
            this.callParent(arguments);
        },

        addHeader: function(headerRow) {
            this.down('#reportheader').removeAll();
            this.down('#reportheader').add(headerRow);
        },

        addMetrics: function(metricsRow) {
            this.down('#metricsrow').removeAll();
            this.down('#metricsrow').add(metricsRow);
        },

        addCharts: function(chartsRow) {
            this.down('#chartsrow').removeAll();
            this.down('#chartsrow').add(chartsRow);
        },

        addStories: function(storyGrid) {
            this.down('#storiesrow').removeAll();
            this.down('#storiesrow').add(storyGrid);
        },

        addFooter: function(footerRow) {
            this.down('#footerrow').removeAll();
            this.down('#footerrow').add(footerRow);
        }
    });

})();