Ext.define('SprintReportApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {

        this.iterationCombobox = this.add({
            xtype: 'rallyiterationcombobox'
        });

        Ext.create('Rally.data.wsapi.Store', {
            model: 'userstory',
            autoLoad: true,
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
         this._loadFeatureStoryTable(store,data);
    },

    _loadFeatureStoryTable: function(store, data) {
        var records = _.map(data, function(record) {
            //Perform custom actions with the data here
            //Calculations, etc.
            return Ext.apply({
                FeatureName: record.get('Feature').Name,
                TaskCount: record.get('Tasks').Count
            }, record.getData());
        });

        this.add({
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
    }
});
