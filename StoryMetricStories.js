(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.StoryMetricStories', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.storymetricstories',
        cls: 'story-metric-stories',
        width: 250,
        height: 150,
        store: null,
        labelColumnTitle: 'Item',
        valueColumnTitle: 'Value',

        layout: {
            type: 'fit',
            // The total column count must be specified here
            // columns: 2,
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
        renderTo: Ext.getBody(),

        constructor: function(config) {
//            console.log("In the constructor, args = %o\n", config);
            this.store = config.store;
            this.labelColumnTitle = (config.labelColumnTitle === null) ? 'Item' : config.labelColumnTitle;
            this.valueColumnTitle = (config.valueColumnTitle === null) ? 'Value' : config.valueColumnTitle;
            this.callParent(arguments);
        },

        initComponent: function() {
//            console.log("Component initialized with %o\n", this.labelColumnTitle);
            this.columns[0].text = this.labelColumnTitle;
            this.columns[1].text = this.valueColumnTitle;
            this.callParent();
        }
    });
})();

