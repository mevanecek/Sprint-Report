//API Docs: https://help.rallydev.com/apps/2.1/doc/
(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('SprintReportApp', {
        extend: 'Rally.app.App',
        componentCls: 'app',
        requires: [
            'PepsiCo.apps.sprintreport.SprintMetricsRow',
            'Rally.ui.combobox.IterationComboBox',
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

            var iter = Ext.create('Rally.ui.combobox.IterationComboBox', {
                listeners: {
                    change: {
                        fn: function(source, newValue, oldValue) { console.log('newValue = %o', newValue); }
                    }
                }
            });
            this.down('#reportheader').add(iter);

            this.metricsRow = this.down('#metricsrow').add( {
                xtype: 'sprintrepormetricsrow'
            });

            var stories = Ext.create('Rally.data.wsapi.Store', {
                model: 'userstory',
                autoLoad: false,
                limit: 'Infinity',
                filters: {
                    property: 'Iteration.Name',
                    value: 'Sprint n'
                },
                listeners: {
                    load: this._onDataLoaded,
                    scope: this
                },
                fetch: [ 'ObjectID', 'FormattedID', 'Name', 'ScheduleState', 'PlanEstimate', 'Parent', 'Feature',
                    'Project', 'Notes', 'Tasks', 'Defects', 'State', 'Estimate', 'ToDo', 'Actuals' ]
            });

            stories.load();
        },

        _onDataLoaded: function(store, data) {
            var storyCount = 0;
            var storyPoints = 0;
            var storiesAccepted = 0;
            var storiesIncomplete = 0;
            var storiesPercent = 0.00;
            var storyPointsPercent = 0.00;
            var storyPointsAccepted = 0;

            this.stories = this._loadStoryRecords(store, data);

            storyPoints = store.sum('PlanEstimate');
            storyCount = store.count();

            store.data.each(function(item, index, totalItems) {
                    //console.log(item.data ['FormattedID']);
                    if ('Accepted' === item.data['ScheduleState']) {
                        storiesAccepted++;
                        storyPointsAccepted += item.data['PlanEstimate'];
                        console.log('Points accepted are %o', item.data);
                    }
                });

            storiesIncomplete = storyCount - storiesAccepted;
            storiesPercent = (storyCount > 0) ? Math.round((storiesAccepted / storyCount) * 100) : 0.00;
            storyPointsPercent = (storyPoints > 0) ? Math.round((storyPointsAccepted / storyPoints) * 100) : 0.00;
            console.log('Stories: %o\nPoints: %o\nAccepted: %o\nA Points: %o\nPercent: %o and %o\n',
                        storyCount, storyPoints, storiesAccepted, storyPointsAccepted, storiesPercent, storyPointsPercent);
            this._loadStoryMetrics(storyCount);
            this._loadFeatureStoryTable();
        },

        _loadFeatureStoryTable: function() {
            var records = this.stories;

            this.down('#storiesrow').add( );
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

                    return Ext.apply( {
                           FeatureName: fName,
                           TaskCount: tCount
                    }, record.getData());
                });

            return records;
        },

        _loadStoryMetrics: function(numStories) {
            var storyTable = new StoryMetricStories( { storyCount: numStories });
            this.metricsRow.items.getAt(0).add(storyTable);

        },

        _addDateFields: function() {
            var filterPanel = Ext.create('Ext.panel.Panel', {
                bodyPadding: 5,  // Don't want content to crunch against the borders
                width: 300,
                title: 'Filters',
                items: [ {
                    xtype: 'datefield',
                    fieldLabel: 'Start date'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'End date'
                } ],
                renderTo: Ext.getBody()
            });
            this.down("#reportheader").add(filterPanel);
        }
    });
})();
