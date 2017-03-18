(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.StoryMetricStories', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.storymetricstories',
        cls: 'story-metric-stories',
        columnLines: true,
        store: null,
        labelColumnTitle: 'Item',
        valueColumnTitle: 'Value',
        frame: true,

        layout: {
            type: 'fit',
            align: 'stretch',
            pack: 'start'
        },
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding: 5px; font-size: 10px;'
        },
        columns: [
            {
                text: 'Item',
                dataIndex: 'metricType',
                flex: 4
            },
            {
                text: 'Value',
                dataIndex: 'metricValue',
                flex: 1
            }
        ],

        constructor: function(config) {
            this.mergeConfig(config);
            this.callParent(arguments);
        },

        initComponent: function() {
            this.columns[0].text = this.labelColumnTitle;
            this.columns[1].text = this.valueColumnTitle;
            this.callParent();
        }
    });
})();

