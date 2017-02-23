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
            fetch: ['ObjectID', 'FormattedID', 'Name', 'ScheduleState', 'PlanEstimate', 'Parent',
                    'Project', 'Notes', 'Tasks', 'Defects', 'State', 'Estimate', 'ToDo', 'Actuals']
        });
    //API Docs: https://help.rallydev.com/apps/2.1/doc/
    },

    _onDataLoaded: function(store, data) {

    },

        var records = _.map(data, function(record) {
            //Perform custom actions with the data here
            //Calculations, etc.
            return Ext.apply({
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
                    dataIndex: 'Feature',
                },
                {
                    xtype: 'templatecolumn',
                    text: 'ID',
                    dataIndex: 'FormattedID',
                    width: 100,
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex: 1
                },
                {
                    text: 'Schedule State',
                    dataIndex: 'ScheduleState'
                },
                {
                    text: 'Points',
                    dataIndex: 'PlanEstimate'
                },
                {
                    text: 'Planned/Added',
                    dataIndex: 'Added'
                },
                {
                    text: '# of Tasks',
                    dataIndex: 'TaskCount'
                },
                {
                    text: '# of Defects',
                    dataIndex: 'Defects',
                    renderer: function(value) {
                        return value.Count;
                    }
                },
                {
                    text: 'Review Feedback',
                    dataIndex: 'Notes'
                }
            ]
        });
    // --- end create the feature/story table
    }
});
