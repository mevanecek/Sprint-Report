Ext.define('SprintReportApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [
        {
            xtype: 'container',
            itemId: 'menuBar'
        },
        {
            xtype: 'container',
            itemId: 'header'
        },
        {
            xtype: 'container',
            itemId: 'body'
        }
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    stories: null,

    launch: function() {

        this.iterationCombobox = this.down('#header').add({
            xtype: 'rallyiterationcombobox'
        });

        this.down('#menuBar').add({
            xtype: 'rallybutton',
            text: 'Button!'
        });

        Ext.create('Rally.data.wsapi.Store', {
            model: 'userstory',
            autoLoad: true,
            limit: "Infinity",
            listeners: {
                load: this._onDataLoaded,
                scope: this
            },
            fetch: ['ObjectID', 'FormattedID', 'Name', 'ScheduleState', 'PlanEstimate', 'Parent', 'Feature',
                    'Project', 'Notes', 'Tasks', 'Defects', 'State', 'Estimate', 'ToDo', 'Actuals']
        });

    //API Docs: https://help.rallydev.com/apps/2.1/doc/
    },

    _onDataLoaded: function(store, data) {
         this.stories = this._loadStoryRecords(store,data);
         this._loadFeatureStoryTable();
         this._loadStoriesDefects();
         this._addDateFields();
    },

    _loadStoriesDefects: function() {
        this.down('#body').add({
            xtype: 'rallygrid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'ScheduleState',
                'Owner'
            ],
            context: this.getContext(),
            storeConfig: {
                models: ['userstory', 'defect']
            }
        });
    },

//    _loadFeatureStoryTable: function(store, data) {
    _loadFeatureStoryTable: function() {
        // var records = this._loadStoryRecords(store, data);
        var records = this.stories;

        this.down('#header').add({
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

    _loadStoryRecords: function(store, data) {
         var records = _.map(data, function(record) {
            //Perform custom actions with the data here
            //Calculations, etc.
            return Ext.apply({
               FeatureName: record.get('Feature').Name,
               TaskCount: record.get('Tasks').Count
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
        this.down("#body").add(filterPanel);
    }
});
