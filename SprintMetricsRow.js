(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.apps.sprintreport.SprintMetricsRow', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.sprintrepormetricsrow',
        cls: 'metricsRowPanel',
        width: 915,
        height: 190,
        title: "Sprint Metrics",
        border: 0,
        collapsible: false,

        config: {
            store: undefined
        },

        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding: 5px; font-size: 10px;'
        },
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
                xtype: 'panel',
                border: 0,
                flex: 1
            },
            {
                xtype: 'panel',
                border: 0,
                flex: 1
            },
            {
                xtype: 'panel',
                border: 0,
                flex: 1
            }
        ],

        constructor: function(config) {
            this.mergeConfig(config);
            this.initConfig(config);
            this.callParent(arguments);
        },

        loadStoryCounts: function() {
            if (this.items.getAt(0)) {
                this.items.getAt(0).removeAll(true);
            }
            
            if (this.store) {
                var storyTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                    storyCount: this.store.storyCount,
                    storiesAdded: this.store.storiesAdded,
                    storiesAccepted: this.store.storiesAccepted,
                    storiesIncomplete: this.store.storiesIncomplete,
                    storiesPercent: this.store.storiesPercent,
                    labelColumnTitle: 'Story Counts',
                    valueColumnTitle: 'Value',
                    store: Ext.create('Ext.data.Store', {
                    model: 'Values',
                    fields: ['metricType', 'metricValue'],
                    data: [
                        { 'metricType': '# Stories Planned', 'metricValue': this.store.storyCount.toString() },
                        { 'metricType': '# Stories Added', 'metricValue': this.store.storiesAdded.toString() },
                        { 'metricType': '# Stories Accepted', 'metricValue': this.store.storiesAccepted.toString() },
                        { 'metricType': '# Stories Not Completed', 'metricValue': this.store.storiesIncomplete.toString() },
                        { 'metricType': '% Stories Accepted', 'metricValue': this.store.storiesPercent.toString() + '%' }
                        ]
                    })
                });
                this.items.getAt(0).add(storyTable);
            }
        },

    loadStoryPoints: function() {
        if (this.items.getAt(1)) {
            this.items.getAt(1).removeAll(true);
        }

        if (this.store) {
            this.storyPointsTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
            labelColumnTitle: 'Story Points',
            valueColumnTitle: 'Value',
            store: Ext.create('Ext.data.Store', {
            model: 'Values',
            fields: ['metricType', 'metricValue'],
            data: [
                { 'metricType': '# Points Planned', 'metricValue': this.store.storyPoints.toString() },
                { 'metricType': '# Points Added', 'metricValue': this.store.storyPointsAdded.toString() },
                { 'metricType': '# Points Accepted', 'metricValue': this.store.storyPointsAccepted.toString() },
                { 'metricType': '# Points Not Completed', 'metricValue': this.store.storyPointsIncomplete.toString() },
                { 'metricType': '% Points Completed', 'metricValue': this.store.storyPointsPercent.toString() + '%' }
                ]
                })
                });
            this.items.getAt(1).add(this.storyPointsTable);
        }
    },

    loadTaskHours: function() {
        if (this.items.getAt(2)) {
            this.items.getAt(2).removeAll(true);
        }


        if (this.store) {
            var plan = this.store.plannedHours;
            var todo = this.store.todoHours;
            var actual = this.store.actualHours;

            var percent = (plan === 0) ? 0.00 : Math.round((actual / plan) * 100);

            this.tasksTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                labelColumnTitle: 'Task Hours',
                valueColumnTitle: 'Value',
                store: Ext.create('Ext.data.Store', {
                model: 'Values',
                fields: ['metricType', 'metricValue'],
                data: [
                    { 'metricType': 'Planned Task Hours', 'metricValue': plan.toString() },
                    { 'metricType': 'To-Do Task Hours', 'metricValue': todo.toString() },
                    { 'metricType': 'Actual Task Hours', 'metricValue': actual.toString() },
                    { 'metricType': 'Actual/Planned', 'metricValue': percent.toString() + '%' }
                    ]
                    })
                });
            this.items.getAt(2).add(this.tasksTable);
        }
    }
    });
})();
