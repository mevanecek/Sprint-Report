//API Docs: https://help.rallydev.com/apps/2.1/doc/
(function() {
    var Ext = window.Ext4 || window.Ext;

 var storyCount = 0;
 var storyPoints = 0;
 var storiesCompleted = 0;
 var storiesIncomplete = 0;
 
     Ext.define('SprintReportApp', {
        extend: 'Rally.app.App',
        componentCls: 'app',
        requires: [
                   'PepsiCo.apps.sprintreport.SprintMetricsRow',
                   'StoryMetricStories'
        ],
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
        stories: null,

        launch: function() {

            this.iterationCombobox = this.down('#reportheader').add({
                xtype: 'rallyiterationcombobox'
            });

            this.metricsRow = this.down('#metricsrow').add({
                xtype: 'sprintrepormetricsrow'
            });
               
            var storyTable = new StoryMetricStories();
            this.metricsRow.items.getAt(0).add(storyTable);
            
            this._addDateFields();
               
            var stories = Ext.create('Rally.data.wsapi.Store', {
                model: 'userstory',
                autoLoad: false,
                limit: 'Infinity',
                listeners: {
                    load: this._onDataLoaded,
                    scope: this
                },
                fetch: ['ObjectID', 'FormattedID', 'Name', 'ScheduleState', 'PlanEstimate', 'Parent', 'Feature',
                        'Project', 'Notes', 'Tasks', 'Defects', 'State', 'Estimate', 'ToDo', 'Actuals']
            });
            
            stories.load();
        },

        _onDataLoaded: function(store, data) {
             this.stories = this._loadStoryRecords(store,data);
             this._loadFeatureStoryTable();
        },

        _loadFeatureStoryTable: function() {
            var records = this.stories;

            this.down('#storiesrow').add({
                xtype: 'rallygrid',
                showPagingToolbar: false,
                showRowActionsColumn: false,
                editable: false,
                store: Ext.create('Rally.data.custom.Store', {
                    data: records
                }),
                columnCfgs: [
                    {
                        text: 'Feature',
                        width: 100,
                        dataIndex: 'FeatureName'
                    },
                    {
                        xtype: 'templatecolumn',
                        text: 'ID',
                        dataIndex: 'FormattedID',
                        width: 70,
                        tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                    },
                    {
                        text: 'Name',
                        dataIndex: 'Name',
                        width: 150
    //                    flex: 1
                    },
                    {
                        text: 'Schedule State',
                        dataIndex: 'ScheduleState',
                        width: 90
                    },
                    {
                        text: 'Points',
                        dataIndex: 'PlanEstimate',
                        width: 55
                    },
                    {
                        text: 'Planned/Added',
                        dataIndex: 'Added',
                        width: 70
                    },
                    {
                        text: '# of Tasks',
                        dataIndex: 'TaskCount',
                        width: 55
                    },
                    {
                        text: '# of Defects',
                        dataIndex: 'Defects',
                        renderer: function(value) {
                            return value.Count;
                        },
                        width: 55
                    },
                    {
                        text: 'Review Feedback',
                        dataIndex: 'Notes',
                        width: 270
                    }
                ]
            });
        // --- end create the feature/story table
        },

        // Grab the stories from the Store, and apply any adjustments
        // or extra fields needed for the Stories table.
        _loadStoryRecords: function(store, data) {
             var records = _.map(data, function(record) {
                //Perform custom actions with the data here
                //Calculations, etc.
                                 
                var fName = "";
                var tCount = 0;
                                 
                // Make sure there is data for the record, before trying
                // to use it.
                if (record.get('Feature') !== null) {
                   fName = record.get('Feature').Name;
                }
                if (record.get('Tasks') !== null) {
                    tCount = record.get('Tasks').Count;
                }
                                 
                return Ext.apply({
                   FeatureName: fName,
                   TaskCount: tCount
                }, record.getData());
             });

             return records;
        },

        _addDateFields: function() {
            var filterPanel = Ext.create('Ext.panel.Panel', {
                bodyPadding: 5,  // Don't want content to crunch against the borders
                width: 300,
                title: 'Filters',
                items: [{
                    xtype: 'datefield',
                    fieldLabel: 'Start date'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'End date'
                }],
                renderTo: Ext.getBody()
            });
            this.down("#reportheader").add(filterPanel);
        }
    });
  })();
