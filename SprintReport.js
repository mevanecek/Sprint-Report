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

    }
});
