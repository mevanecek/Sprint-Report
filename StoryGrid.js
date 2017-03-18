(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.StoryGrid', {
        extend: 'Rally.ui.grid.Grid',
        alias: 'widget.pepsicostorygrid',
//        cls: 'sprint-report-story-grid',

        config: {
            showPagingToolbar: false,
            showRowActionsColumn: false,
            autoScroll: false,
            overflowY: false,
            overflowX: 'hidden',
            editable: false,
            store: null,
            storeConfig: {
                pageSize: 5000
            },
            sortableColumns: false,
            border: 2,
            columnLines: true,
//            width: 0,
            bodyStyle: 'margin-bottom: 25px;',
            title: 'User Stories',
            columnCfgs: [
                {
                    text: 'Feature',
                    dataIndex: 'FeatureName',
                    flex: 2
                },
                {
                    xtype: 'templatecolumn',
                    text: 'ID',
                    dataIndex: 'FormattedID',
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate'),
                    flex: 2
                },
                {
                    text: 'Name',
                    dataIndex: 'Name',
                    flex: 3
                },
                {
                    text: 'Points',
                    dataIndex: 'PlanEstimate',
                    flex: 1
                },
                {
                    text: 'Plan/Add',
                    dataIndex: 'Added',
                    flex: 1.5
                },
                {
                    text: '# of Defects',
                    dataIndex: 'Defects',
                    renderer: function(value) {
                        return value.Count;
                    },
                    flex: 1
                },
                {
                    text: 'Review Feedback',
                    dataIndex: 'Notes',
                    flex: 5
                },
                {
                    text: 'Schedule State',
                    dataIndex: 'ScheduleState',
                    flex: 2
                }
            ]
        },
        
//        plugins: [{
//            ptype: 'rallygridprintpage',
//            defaultTitle: 'Sprint Report',
//            gridSelector: 'sprintReportStoryTable'
//        }],

        constructor: function(config) {
            this.mergeConfig(config);
            this.initConfig(config);
            this.callParent(arguments, this.config);
        }

    });
})();

