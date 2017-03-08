//API Docs: https://help.rallydev.com/apps/2.1/doc/
(function() {
    var Ext = window.Ext4 || window.Ext;


    var gridConfig = {
        showPagingToolbar: false,
        showRowActionsColumn: false,
        editable: false,
        store: null,
        storeConfig: {
            pageSize: 5000
        },
        sortableColumns: false,
        columnLines: true,
        width: 915,
        bodyStyle: 'margin-bottom: 50px;',
        title: 'User Stories',
        columnCfgs: [
            {
                text: 'Feature',
            dataIndex: 'FeatureName',
        flex: 2
               // width: 100,
            },
            {
                xtype: 'templatecolumn',
                text: 'ID',
                dataIndex: 'FormattedID',
                tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate'),
        flex: 2
              //  width: 90,
            },
            {
                text: 'Name',
                dataIndex: 'Name',
        flex: 3
               // width: 150
            },
            {
                text: 'Points',
                dataIndex: 'PlanEstimate',
        flex: 1
               // width: 55
            },
            {
                text: 'Plan/Add',
                dataIndex: 'Added',
        flex: 1.5
               // width: 70
            },
            {
                text: '# of Defects',
                dataIndex: 'Defects',
                renderer: function(value) {
                    return value.Count;
                },
        flex: 1
               // width: 55
            },
            {
                text: 'Review Feedback',
                dataIndex: 'Notes',
        flex: 5
               // width: 270
            },
            {
                text: 'Schedule State',
                dataIndex: 'ScheduleState',
        flex: 2
               // width: 90
            }
        ]
    };

    Ext.define('SprintReportApp', {
        extend: 'Rally.app.App',
        componentCls: 'app',
//        requires: [
//            'PepsiCo.apps.sprintreport.SprintMetricsRow',
//            'PepsiCo.app.sprintreport.StoryGrid',
//            'PepsiCo.app.sprintreport.StoryStore',
//            'PepsiCo.app.sprintreport.StoryMetricStories',
//            'Rally.ui.combobox.IterationComboBox'
//            ],
        items: [
            {
                xtype: 'container',
                itemId: 'menuBar'
            },
            {
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
            }
            ],
        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        iterationBox: null,
        iterationObjId: null,
        stories: null,
        iterationInfoRow: null,
        metricsRow: null,
        chartsRow: null,
        storyGrid: null,
        storyTable: null,
        storyPointsTable: null,
        tasksTable: null,

        // Launch the application
        launch: function() {

            this._createMetricsRow();
            this._createIterationInfo();
            this._createChartsRow();
            this._createIterationComboBox();
        },

        // Create and add the iteration information row
        _createIterationInfo: function() {
            var row = Ext.create('PepsiCo.app.sprintreport.IterationInfo', {
                title: 'Sprint Information',
                border: 0,
                width: 915,
                height: 150
            });
            this.iterationInfoRow = this.down('#reportheader').add(row);
        },

        // Create and add the metrics row
        _createMetricsRow: function() {
            var metrow = Ext.create('PepsiCo.apps.sprintreport.SprintMetricsRow',{});
            this.metricsRow = this.down('#metricsrow').add(metrow);
        },

        // Add the row for the charts that will be displayed
        _createChartsRow: function() {
             var row = Ext.create('PepsiCo.app.sprintreport.SprintReportCharts', {
                 title: 'Progress',
                 border: 0,
                 width: 915,
                 height: 310
             });
             this.chartsRow = this.down('#chartsrow').add(row);
        },

        // Add the IterationComboBox to the header, and set its listener.
        _createIterationComboBox: function() {
            this.iterationBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
                listeners: {
                        change: this._iterationChange,
                        scope: this
                }
            });
            this.iterationBox.getStore().load();
            this.down('#menuBar').add(this.iterationBox);
        },

        _iterationChange: function(source, newValue /*, oldValue */) {
            // console.log('Iteration changed or loaded. Old = %o, new = %o\n', oldValue, newValue);
            var objIdArr = newValue.split('/');
            this.iterationObjId = objIdArr[objIdArr.length - 1];

//            this.iterationInfoRow.removeAll();
            this.iterationInfoRow._setIterationId(this.iterationObjId);
            this.iterationInfoRow._fetchIteration();

            
            this.chartsRow._setIterationId(this.iterationObjId);
            this.chartsRow._load();

            this._loadStoryData();
        },

        _loadStoryData: function() {
            this.metricsRow.items.getAt(0).removeAll(true);
            this.metricsRow.items.getAt(1).removeAll(true);
            this.metricsRow.items.getAt(2).removeAll(true);
            this.storyTable = null;
            this.storyPointsTable = null;
            this.tasksTable = null;

            if (this.storyGrid) {
                this.storyGrid.removeAll();
                this.storyGrid.close();
                this.remove(this.storyGrid);
            }

            this.stories = Ext.create('PepsiCo.app.sprintreport.StoryStore', {
                listeners: {
                    loaded: this._loadReportWidgets,
                    scope: this
                },
                iterationValue: this.iterationObjId
            });
            this.stories.load();
        },

        _loadReportWidgets: function() {
            this._loadStoryMetrics();
            this._loadFeatureStoryTable();
        },

        // Load the Story table
        _loadFeatureStoryTable: function() {
            var records = this.stories._getStoryRecordsStore();
            gridConfig.store = records;

//            this.storyGrid = Ext.create('PepsiCo.app.sprintreport.StoryGrid', { store: records });
            this.storyGrid = Ext.create('Rally.ui.grid.Grid', gridConfig);
            this.down('#storiesrow').add(this.storyGrid);
            // --- end create the feature/story table
        },

        _loadStoryMetrics: function() {
            this._loadStoryCounts();
            this._loadStoryPoints();
            this._loadTaskHours();
        },

        _loadStoryCounts: function() {
            if (this.storyTable === null) {
                this.storyTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                storyCount: this.stories.storyCount,
                storiesAdded: this.stories.storiesAdded,
                storiesAccepted: this.stories.storiesAccepted,
                storiesIncomplete: this.stories.storiesIncomplete,
                storiesPercent: this.stories.storiesPercent,
                labelColumnTitle: 'Story Counts',
                valueColumnTitle: 'Value',
                store: Ext.create('Ext.data.Store', {
                model: 'Values',
                fields:['metricType', 'metricValue'],
                data: [
                    { 'metricType': '# Stories Planned',  'metricValue': this.stories.storyCount.toString() },
                    { 'metricType': '# Stories Added',  'metricValue': this.stories.storiesAdded.toString() },
                    { 'metricType': '# Stories Accepted', 'metricValue': this.stories.storiesAccepted.toString()  },
                    { 'metricType': '# Stories Not Completed', 'metricValue': this.stories.storiesIncomplete.toString() },
                    { 'metricType': '% Stories Completed', 'metricValue': this.stories.storiesPercent.toString() + '%' }
                    ]
                    })
                });
                this.metricsRow.items.getAt(0).add(this.storyTable);
            }
        },

        _loadStoryPoints: function() {
            if (this.storyPointsTable === null) {
                this.storyPointsTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                labelColumnTitle: 'Story Points',
                valueColumnTitle: 'Value',
                store: Ext.create('Ext.data.Store', {
                model: 'Values',
                fields:['metricType', 'metricValue'],
                data: [
                    { 'metricType': '# Points Planned',  'metricValue': this.stories.storyPoints.toString() },
                    { 'metricType': '# Points Added',  'metricValue': this.stories.storyPointsAdded.toString() },
                    { 'metricType': '# Points Accepted', 'metricValue': this.stories.storyPointsAccepted.toString()  },
                    { 'metricType': '# Points Not Completed', 'metricValue': this.stories.storyPointsIncomplete.toString() },
                    { 'metricType': '% Points Completed', 'metricValue': this.stories.storyPointsPercent.toString() + '%' }
                    ]
                    })
                });
                this.metricsRow.items.getAt(1).add(this.storyPointsTable);
            }
        },

        _loadTaskHours: function() {

            var plan = this.stories.plannedHours;
            var todo = this.stories.todoHours;
            var actual = this.stories.actualHours;

            var percent = (plan === 0) ? 0.00 : Math.round((actual/plan) * 100);

            if (this.tasksTable === null) {
                this.tasksTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                labelColumnTitle: 'Task Hours',
                valueColumnTitle: 'Value',
                store: Ext.create('Ext.data.Store', {
                model: 'Values',
                fields:['metricType', 'metricValue'],
                data: [
                    { 'metricType': 'Planned Task Hours',  'metricValue': plan.toString() },
                    { 'metricType': 'To-Do Task Hours',  'metricValue': todo.toString() },
                    { 'metricType': 'Actual Task Hours', 'metricValue': actual.toString() },
                    { 'metricType': 'Actual/Planned', 'metricValue': percent.toString() + '%' }
                    ]
                    })
                });
                this.metricsRow.items.getAt(2).add(this.tasksTable);
            }
        }

    });
})();
