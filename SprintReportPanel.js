(function() {

    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.SprintReportPanel', {

        extend: 'Ext.panel.Panel',
        componentCls: 'sprintreportpanel',
        alias: 'widget.sprintreportpanel',
        cls: 'sprint-report',

        plugins: [
            {ptype: 'sprintreportprinting', pluginId: 'print', defaulTitle: 'Sprint Report'}
        ],

        config: {
            store: undefined,
//            width: 0
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
            this.down('#reportheader').removeAll(true);
            this.down('#reportheader').add(headerRow);
        },

        addMetrics: function(metricsRow) {
            this.down('#metricsrow').removeAll(true);
            this.down('#metricsrow').add(metricsRow);
        },

        addCharts: function(chartsRow) {
            this.down('#chartsrow').removeAll(true);
            this.down('#chartsrow').add(chartsRow);
        },

        addStories: function(storyGrid) {
            this.down('#storiesrow').removeAll(true);
            this.down('#storiesrow').add(storyGrid);
        },

        addFooter: function(footerRow) {
            this.down('#footerrow').removeAll(true);
            this.down('#footerrow').add(footerRow);
        },

        resetContents: function() {
            this.down('#reportheader').removeAll(true);
            this.down('#metricsrow').removeAll(true);
            this.down('#chartsrow').removeAll(true);

        }
    });

})();
